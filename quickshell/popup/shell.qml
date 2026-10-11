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

	property real volume: 0
	property bool muted: false
	property real brightness: 0

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
		readVolume.running = false;
		readVolume.running = true;
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

	function parseVolume(text) {
		// wpctl devolve FRACAO: "Volume: 0.74" ou "Volume: 1.19 [MUTED]".
		// O slider e o texto trabalham em pontos (0..maxVolume), entao
		// multiplicar por 100 aqui. Sem isso, 0.74 aparecia como "1%".
		const m = /([0-9]*\.?[0-9]+)/.exec(text);
		if (m) {
			root.volume = parseFloat(m[1]) * 100;
		}
		root.muted = text.indexOf("MUTED") !== -1;
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

	// ------------------------------------------------------------------
	// Leitura
	// ------------------------------------------------------------------
	Process {
		id: readVolume
		command: ["wpctl", "get-volume", "@DEFAULT_AUDIO_SINK@"]
		stdout: StdioCollector {
			id: volOut
			onStreamFinished: root.parseVolume(volOut.text)
		}
	}

	Process {
		id: readBrightness
		command: ["brightnessctl", "get"]
		stdout: StdioCollector {
			id: brightOut
			onStreamFinished: root.parseBrightness(brightOut.text)
		}
	}

	// ------------------------------------------------------------------
	// Escrita
	// ------------------------------------------------------------------
	Process {
		id: writeVolume
		// startDetached: o processo nao e rastreado e nao morre junto com
		// o quickshell -- que e o que queremos para o wpctl.
		function apply(v) {
			writeVolume.command = ["wpctl", "set-volume", "@DEFAULT_AUDIO_SINK@", Math.round(v) + "%"];
			writeVolume.startDetached();
		}
	}

	Process {
		id: writeMute
		function apply() {
			writeMute.command = ["wpctl", "set-mute", "@DEFAULT_AUDIO_SINK@", "toggle"];
			writeMute.startDetached();
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
			writeBrightness.command = ["brightnessctl", "set", pct + "%"];
			writeBrightness.startDetached();
		}
	}

	// DDC/CI (monitor externo): ~230ms por setvcp e o barramento I2C
	// aguenta ~4 ops/s. Por isso o arrasto so escreve ao soltar, nunca a
	// cada pixel -- que e o que onPressedChanged ja faz.
	Process {
		id: writeDdc
		function apply(v) {
			const raw = Math.round((v / 100) * root.ddcMax);
			writeDdc.command = ["ddcutil", "--display", root.ddcDisplay,
				"--sleep-multiplier", "0.05", "setvcp", "10", String(raw)];
			writeDdc.startDetached();
		}
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
			width: 300
			height: root.mode === 2 ? (root.ddcAvailable ? 104 : 48) : 96

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
			ColumnLayout {
				id: volCol
				visible: root.mode === 1
				anchors.fill: parent
				anchors.margins: 16
				spacing: 12

				RowLayout {
					spacing: 12
					Layout.fillWidth: true

					Text {
						Layout.preferredWidth: 18
						text: root.muted ? "" : ""
						color: root.muted ? "#FF453A" : "#F5F5F7"
						font.pixelSize: 15
						font.family: "JetBrainsMono Nerd Font"
					}

					MacSlider {
						id: volSlider
						Layout.fillWidth: true
						from: 0
						to: root.maxVolume
						value: root.volume

						onPressedChanged: {
							hideTimer.restart();
							root.dragging = pressed;
						}
						onCommitted: function (v) {
							writeVolume.apply(v);
						}
					}

					Text {
						Layout.preferredWidth: 38
						text: Math.round(root.volume) + "%"
						color: "#98989D"
						font.pixelSize: 12
						font.family: "JetBrainsMono Nerd Font"
						horizontalAlignment: Text.AlignRight
					}
				}

				Text {
					Layout.fillWidth: true
					text: "controle completo do audio"
					color: "#636366"
					font.pixelSize: 11
					font.family: "JetBrainsMono Nerd Font"
					horizontalAlignment: Text.AlignHCenter

					MouseArea {
						anchors.fill: parent
						cursorShape: Qt.PointingHandCursor
						onClicked: openPavu.apply()
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
