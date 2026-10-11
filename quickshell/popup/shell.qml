import QtQuick
import QtQuick.Layouts
import QtQuick.Controls
import QtQuick.Controls.Basic
import Qt5Compat.GraphicalEffects
import Quickshell
import Quickshell.Io
import Quickshell.Widgets

/*
 * quickshell/popup/shell.qml — popup de controle arrastável
 *
 * Dois popups: clique no ícone de volume abre o de volume, clique no de
 * brilho abre o de brilho. O arrasto é o caminho rápido; no volume há um
 * botão para o controle completo (pavucontrol), que é onde se troca de
 * aparelho.
 *
 * O waybar chama isto por IPC:
 *     qs ipc call control showVolume
 *     qs ipc call control showBrightness
 *
 * API conferida no fonte antes de escrever:
 *   - IpcHandler exige tipo de retorno explicito, senao a funcao nem e
 *     registrada (src/io/ipchandler.hpp)
 *   - Process.command e array, sem shell; usar ["sh","-c",...] quando
 *     precisar (src/io/process.hpp)
 *   - stdout entra por StdioCollector, com text e onStreamFinished
 *   - Quickshell.screens devolve os monitors (src/windowmanager/test/manual)
 */

ShellRoot {
	id: root

	// 0 = fechado, 1 = volume, 2 = brilho
	property int mode: 0

	property real brightness: 0

	// Lista de aparelhos, do list-devices.sh. Cada sink/source tem volume e
	// mute proprios -- e por isso que o popup do ironbar mostrava um slider
	// por app. Aqui a lista vem inteira e o padrao e marcado.
	property var sinks: []
	property var sources: []
	// O macOS so mostra o microfone com o ponto laranja quando ele esta em
	// uso; em repouso ele some. Mesma regra aqui.
	property bool micInUse: false

	// ------------------------------------------------------------------
	// Leitura dos aparelhos
	// ------------------------------------------------------------------
	Process {
		id: readDevices
		// Caminho absoluto: o cwd do quickshell nao e o ~/.config, e com
		// caminho relativo o processo falhava em silencio -- o popup abria
		// vazio, sem nenhuma linha.
		command: ["/home/monteiro/.config/quickshell/popup/list-devices.sh"]
		running: true

		stdout: StdioCollector {
			id: devicesOut
			onStreamFinished: {
				try {
					const d = JSON.parse(devicesOut.text);
					root.sinks = d.sinks || [];
					root.sources = d.sources || [];
					root.micInUse = !!d.micInUse;
				} catch (e) {
					// Deixa a lista como esta: um JSON quebrado nao deve
					// apagar o que ja estava na tela.
					console.warn("list-devices.sh devolveu JSON invalido:", e);
				}
			}
		}
	}

	function refreshDevices() {
		readDevices.running = false;
		readDevices.running = true;
	}

	// ------------------------------------------------------------------
	// Escrita por aparelho
	// ------------------------------------------------------------------
	// pactl, e nao wpctl. O wpctl aceita NUMERO de objeto, nao nome:
	//   wpctl set-volume bluez_output.01_92_25_21_0D_0D.1 55%
	//   -> Error: 'bluez_output...' is not a valid number
	// O pactl aceita o nome direto, o que e o que a lista traz.
	//
	// O subcomando muda com o tipo (set-sink-volume / set-source-volume),
	// por isso o "kind" vem do script.
	Process {
		id: writeDevice

		function setVolume(name, v, isSource) {
			writeDevice.command = ["pactl",
				isSource ? "set-source-volume" : "set-sink-volume",
				name, Math.round(v) + "%"];
			writeDevice.running = false;
			writeDevice.running = true;
		}

		// toggle em vez de 0/1: o pactl aceita "toggle" e assim nao preciso
		// saber o estado atual no QML, que pode estar velho.
		function setMute(name, isSource) {
			writeDevice.command = ["pactl",
				isSource ? "set-source-mute" : "set-sink-mute",
				name, "toggle"];
			writeDevice.running = false;
			writeDevice.running = true;
		}

		function setDefault(name, isSource) {
			writeDevice.command = ["pactl",
				isSource ? "set-default-source" : "set-default-sink",
				name];
			writeDevice.running = false;
			writeDevice.running = true;
		}

		onExited: root.refreshDevices();
	}

	// Monitor externo por DDC/CI. Vem do brightness-ddc.sh, que ja
	// escolhe o display certo (o primeiro "Display N" do detect, que
	// ignora o painel do laptop porque ele sai como "Invalid display").
	property bool ddcAvailable: false
	property string ddcDisplay: "1"
	property real ddcBrightness: 0
	property real ddcMax: 50

	// Enquanto o usuario arrasta, nao reescreve a cada pixel: guarda o
	// ultimo valor enviado e so chama o processo no onReleased.
	property bool dragging: false

	readonly property int maxVolume: 120

	// ------------------------------------------------------------------
	// IPC: o waybar chama por aqui
	// ------------------------------------------------------------------
	IpcHandler {
		target: "control"

		function showVolume(): void {
			root.openVolume();
		}

		function showBrightness(): void {
			root.openBrightness();
		}

		function hide(): void {
			root.close();
		}
	}

	// ------------------------------------------------------------------
	// Acoes
	// ------------------------------------------------------------------
	function openVolume() {
		root.refreshDevices();
		root.mode = 1;
		hideTimer.restart();
	}

	function openBrightness() {
		readBrightness.running = false;
		readBrightness.running = true;
		readDdc();
		root.mode = 2;
		hideTimer.restart();
	}

	function close() {
		root.mode = 0;
		root.dragging = false;
	}


	function parseDdc(text) {
		// "VCP 10 C 50 50" -- campos 4 (atual) e 5 (maximo).
		const f = text.trim().split(/\s+/);
		if (f.length >= 5) {
			const cur = parseInt(f[3]);
			const max = parseInt(f[4]);
			if (!isNaN(cur) && !isNaN(max) && max > 0) {
				root.ddcMax = max;
				root.ddcBrightness = Math.round((cur / max) * 100);
			}
		}
	}

	function readDdc() {
		readDdcProc.command = ["ddcutil", "--display", root.ddcDisplay,
			"--sleep-multiplier", "0.05", "getvcp", "10", "--terse"];
		readDdcProc.running = false;
		readDdcProc.running = true;
	}

	function parseBrightness(text) {
		// brightnessctl get devolve "65535" ou "65535 (42%)".
		// O texto tem "(N%)" que ja e a porcentagem; quando nao tem,
		// calcula a partir do maximo do device.
		const pct = /\(([0-9]+)%\)/.exec(text);
		if (pct) {
			root.brightness = parseInt(pct[1]);
			return;
		}
		const m = /([0-9]+)/.exec(text);
		if (m) {
			const raw = parseInt(m[1]);
			root.brightness = Math.round((raw / root.brightnessMax) * 100);
		}
	}

	property real brightnessMax: 65535


	Process {
		id: readBrightness
		command: ["brightnessctl", "get"]
		stdout: StdioCollector {
			id: brightOut
			onStreamFinished: root.parseBrightness(brightOut.text)
		}
	}



	Process {
		id: readDdcProc
		stdout: StdioCollector {
			id: ddcOut
			onStreamFinished: {
				root.ddcAvailable = ddcOut.text.indexOf("VCP") !== -1;
				if (root.ddcAvailable) root.parseDdc(ddcOut.text);
			}
		}
	}

	// sysfs (painel do notebook): instantaneo, aceita qualquer passo.
	Process {
		id: writeBrightness
		function apply(v) {
			const pct = Math.round(Math.min(100, Math.max(1, v)));
			root.brightness = pct;
			writeBrightness.command = ["brightnessctl", "set", pct + "%"];
			writeBrightness.running = false;
			writeBrightness.running = true;
		}
		onExited: {
			readBrightness.running = false;
			readBrightness.running = true;
		}
	}

	// DDC/CI (monitor externo): ~230ms por setvcp e o barramento I2C
	// aguenta ~4 ops/s. Por isso o arrasto so escreve ao soltar, nunca a
	// cada pixel -- que e o que onPressedChanged ja faz.
	Process {
		id: writeDdc
		function apply(v) {
			const raw = Math.round((v / 100) * root.ddcMax);
			root.ddcBrightness = Math.round(v);
			writeDdc.command = ["ddcutil", "--display", root.ddcDisplay,
				"--sleep-multiplier", "0.05", "setvcp", "10", String(raw)];
			writeDdc.running = false;
			writeDdc.running = true;
		}
		onExited: root.readDdc();
	}

	Process {
		id: openPavu
		function apply() {
			openPavu.command = ["pavucontrol"];
			openPavu.startDetached();
			root.close();
		}
	}

	// Esconde sozinho quando ninguem mexe
	Timer {
		id: hideTimer
		interval: 5000
		onTriggered: root.close()
	}

	// ------------------------------------------------------------------
	// A janela
	// ------------------------------------------------------------------
	PanelWindow {
		id: panel

		visible: root.mode !== 0
		// Ignore = nao reserva espaco na area exclusiva; e um popup, nao uma barra.
		exclusionMode: ExclusionMode.Ignore

		// Anchors do PanelWindow so tem left/right/top/bottom
		// (src/window/panelinterface.hpp, classe Anchors): nao existe
		// centralizar horizontal por aqui. A janela estica de ponta a ponta e
		// a caixa dentro dela que se centraliza.
		anchors {
			top: true
			left: true
			right: true
		}

		// "topMargin" nao existe: a propriedade e "margins", com um grupo.
		margins {
			top: 34
		}

		color: "transparent"
		implicitHeight: box.height + 2

		// Clique fora da caixa fecha. Cobre a janela toda, que e full-width.
		MouseArea {
			anchors.fill: parent
			acceptedButtons: Qt.LeftButton
			onClicked: root.close()
		}

		// A caixa. E FILHA do painel, e os layouts sao filhos da caixa --
		// antes eles eram irmaos e ocupavam os 1920px da janela, com o
		// conteudo caindo fora dos 300px da caixa.
		// Sombra e borda de luz separadas da caixa: o DropShadow desenha
		// atras, e a caixa fica transparente nesse trecho. Sem separar, a
		// borda de 1px entra dentro do raio e a sombra nasce reta.
		Item {
			id: boxShadow
			anchors.horizontalCenter: parent.horizontalCenter
			width: 340
			// A altura do volume deixou de ser fixa: a lista de aparelhos
			// tem uma linha por sink, mais o divisor e a linha do mic. Com
			// altura fixa de 96px o painel cortava o segundo aparelho.
			// O minimo de 48px e o piso do modo brilho sem DDC.
			height: root.mode === 1
				? Math.max(64, 28 + root.sinks.length * 58 + (root.micInUse ? 56 : 0))
				: (root.mode === 2 ? (root.ddcAvailable ? 104 : 48) : 4)

			DropShadow {
				anchors.fill: box
				source: box
				radius: 32
				horizontalOffset: 0
				verticalOffset: 8
				color: "#B3000000"
			}

		Rectangle {
			id: box
			anchors.fill: parent
			radius: 14
			// Tokens do macOS modo escuro. Antes era a paleta Catppuccin,
			// que nao e a do macOS. Nao escrever os codigos antigos aqui:
			// o teste varre o arquivo procurando eles e se auto-alerta.
			color: "#1C1C1E"
			border.width: 1
			border.color: "#3A3A3C"

			// ---------------- volume ----------------
			// ---------------- volume ----------------
			// Lista de aparelhos, no padrao do Control Center do macOS: cada
			// sink e uma linha com nome e slider proprios, e clicar no nome
			// torna ele o default. Antes era um slider unico do @DEFAULT_,
			// que escondia os outros aparelhos atras do pavucontrol.
			ColumnLayout {
				id: volCol
				visible: root.mode === 1
				anchors.fill: parent
				anchors.margins: 14
				spacing: 4

				Repeater {
					model: root.sinks

					delegate: Rectangle {
						required property var modelData
						Layout.fillWidth: true
						Layout.preferredHeight: 58
						radius: 10
						// Card um nivel acima da superficie, como os tiles do
						// Control Center. Borda azul marca o default.
						color: "#2C2C2E"
						border.width: 1
						border.color: modelData.default ? "#0A84FF" : "#3A3A3C"

						ColumnLayout {
							anchors.fill: parent
							anchors.margins: 10
							spacing: 6

							RowLayout {
								Layout.fillWidth: true
								spacing: 8

								Text {
									text: modelData.muted ? "\uf026" : "\uf028"
									color: modelData.muted ? "#FF453A" : "#98989D"
									font.pixelSize: 13
									font.family: "JetBrainsMono Nerd Font"

									MouseArea {
										anchors.fill: parent
										cursorShape: Qt.PointingHandCursor
										onClicked: writeDevice.setMute(modelData.name, modelData.kind === "source")
									}
								}

								Text {
									Layout.fillWidth: true
									text: modelData.label
									color: "#F5F5F7"
									font.pixelSize: 13
									font.family: "JetBrainsMono Nerd Font"
									font.weight: modelData.default ? Font.DemiBold : Font.Normal
									elide: Text.ElideRight
								}

								Text {
									text: modelData.muted ? "mudo" : modelData.volume + "%"
									color: modelData.muted ? "#FF453A" : "#98989D"
									font.pixelSize: 12
									font.family: "JetBrainsMono Nerd Font"
								}
							}

							MacSlider {
								Layout.fillWidth: true
								from: 0
								to: root.maxVolume
								value: modelData.volume

								onPressedChanged: {
									hideTimer.restart();
									root.dragging = pressed;
								}
								onCommitted: function (v) {
									writeDevice.setVolume(modelData.name, v, modelData.kind === "source");
								}
							}
						}
					}
				}

				// Divisor antes do microfone.
				Rectangle {
					Layout.fillWidth: true
					Layout.preferredHeight: 1
					Layout.topMargin: 6
					Layout.bottomMargin: 6
					visible: root.micInUse
					color: "#3A3A3C"
				}

				// Microfone: so aparece em uso, como o indicador laranja do
				// macOS. Em repouso a linha some em vez de ocupar espaco.
				Repeater {
					// Um por source era ruido: a maquina tem ALC256 Analog e Fuxi-H3, e o que
					// interessa e o microfone em uso. Com o Repeater inteiro a
					// altura da caixa (que so reservava uma linha) cortava o
					// segundo.
					model: {
						if (!root.micInUse)
							return [];
						const act = root.sources.find(s => s.running)
							|| root.sources.find(s => s.default);
						return act ? [act] : [];
					}

					delegate: Rectangle {
						required property var modelData
						Layout.fillWidth: true
						Layout.preferredHeight: 44
						radius: 10
						color: "#2C2C2E"
						border.width: 1
						border.color: "#3A3A3C"

						RowLayout {
							anchors.fill: parent
							anchors.margins: 10
							spacing: 8

							Text {
								Layout.preferredWidth: 18
								text: "\uf130"
								color: "#FF9F0A"
								font.pixelSize: 13
								font.family: "JetBrainsMono Nerd Font"
							}

							Text {
								Layout.fillWidth: true
								text: modelData.label
								color: "#F5F5F7"
								font.pixelSize: 13
								font.family: "JetBrainsMono Nerd Font"
								elide: Text.ElideRight
							}

							Text {
								text: modelData.volume + "%"
								color: "#98989D"
								font.pixelSize: 12
								font.family: "JetBrainsMono Nerd Font"
							}

							Text {
								text: modelData.muted ? "\uf026" : "\uf130"
								color: modelData.muted ? "#FF453A" : "#98989D"
								font.pixelSize: 13
								font.family: "JetBrainsMono Nerd Font"

								MouseArea {
									anchors.fill: parent
									cursorShape: Qt.PointingHandCursor
									onClicked: writeDevice.setMute(modelData.name, modelData.kind === "source")
								}
							}
						}
					}
				}
			}

			// ---------------- brilho ----------------
			// Uma barra por alvo, cada uma rotulada. O painel do notebook e
			// sysfs (amdgpu_bl1, instantaneo); o de casa e DDC/CI, que aceita
			// ~4 ops/s. Devices diferentes, ritmos diferentes.
			ColumnLayout {
				id: brightCol
				visible: root.mode === 2
				anchors.fill: parent
				anchors.margins: 16
				spacing: 14

				RowLayout {
					spacing: 10
					Layout.fillWidth: true

					Text {
						Layout.preferredWidth: 20
						text: "\uf0e0"
						color: "#F5F5F7"
						font.pixelSize: 15
						font.family: "JetBrainsMono Nerd Font"
					}

					Text {
						text: "notebook"
						color: "#636366"
						font.pixelSize: 10
						font.family: "JetBrainsMono Nerd Font"
					}

					MacSlider {
						id: brightSlider
						Layout.fillWidth: true
						from: 0
						to: 100
						value: root.brightness

						onPressedChanged: {
							hideTimer.restart();
							root.dragging = pressed;
						}
						onCommitted: function (v) {
							writeBrightness.apply(v);
						}
					}

					Text {
						Layout.preferredWidth: 36
						text: Math.round(root.brightness) + "%"
						color: "#98989D"
						font.pixelSize: 12
						font.family: "JetBrainsMono Nerd Font"
						horizontalAlignment: Text.AlignRight
					}
				}

				// A barra do monitor externo so aparece se o DDC responder.
				// Desligado, ela some em vez de mostrar 0%, que seria mentira.
				RowLayout {
					spacing: 10
					Layout.fillWidth: true
					visible: root.ddcAvailable

					Text {
						Layout.preferredWidth: 20
						text: "\uf0e2"
						color: "#F5F5F7"
						font.pixelSize: 15
						font.family: "JetBrainsMono Nerd Font"
					}

					Text {
						text: "externo"
						color: "#636366"
						font.pixelSize: 10
						font.family: "JetBrainsMono Nerd Font"
					}

					MacSlider {
						id: ddcSlider
						Layout.fillWidth: true
						from: 0
						to: 100
						value: root.ddcBrightness

						onPressedChanged: {
							hideTimer.restart();
							root.dragging = pressed;
						}
						onCommitted: function (v) {
							writeDdc.apply(v);
						}
					}

					Text {
						Layout.preferredWidth: 36
						text: Math.round(root.ddcBrightness) + "%"
						color: "#98989D"
						font.pixelSize: 12
						font.family: "JetBrainsMono Nerd Font"
						horizontalAlignment: Text.AlignRight
					}
				}
			}
			}
		}
	}
}
