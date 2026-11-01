import QtQuick
import QtQuick.Layouts
import Quickshell
import Quickshell.Hyprland
import Quickshell.Io
import Quickshell.Services.SystemTray
import Quickshell.Services.UPower
import Quickshell.Services.Pipewire

/*
 * quickshell/bar/shell.qml — barra superior estilo macOS
 *
 * Config separado (`qs -c bar`) para conviver com o `popup` enquanto a
 * troca nao acontece. Nada aqui depende da waybar: os cliques chamam o
 * open.sh que ja abre os paineis do config popup.
 *
 * Fase 1: esqueleto, workspaces, titulo, relogio, tray, bateria, volume
 * e rede. Os demais modulos entram na fase 2.
 */

ShellRoot {
	id: root

	readonly property int barHeight: 24
	readonly property int barMargin: 12
	readonly property string iconFont: "JetBrainsMono Nerd Font"
	readonly property string textFont: "Noto Sans"
	readonly property color fg: "#FFFFFF"
	readonly property color dim: "#B3FFFFFF"
	readonly property color pillActive: "#33FFFFFF"

	// ------------------------------------------------------------------
	// Relogio
	// ------------------------------------------------------------------
	property string clockText: root.formatNow()

	function pad2(n) {
		return (n < 10 ? "0" : "") + n;
	}

	function formatNow() {
		const d = new Date();
		return root.pad2(d.getHours()) + ":" + root.pad2(d.getMinutes())
			+ " - " + root.pad2(d.getDate()) + "/"
			+ root.pad2(d.getMonth() + 1) + "/" + d.getFullYear();
	}

	Timer {
		interval: 1000
		repeat: true
		running: true
		onTriggered: root.clockText = root.formatNow()
	}

	// ------------------------------------------------------------------
	// Abrir os paineis do config popup
	// ------------------------------------------------------------------
	Process {
		id: popupProc
		command: ["/home/monteiro/.config/quickshell/popup/open.sh",
			"volume"]
		running: false
	}

	function openPopup(which) {
		if (popupProc.running)
			return;
		popupProc.command = ["/home/monteiro/.config/quickshell/popup/open.sh",
			which];
		popupProc.running = true;
	}

	Process {
		id: nmtuiProc
		command: ["kitty", "-e", "nmtui"]
		running: false
	}

	function openNmtui() {
		nmtuiProc.running = false;
		nmtuiProc.running = true;
	}

	Process {
		id: pavuProc
		command: ["pavucontrol"]
		running: false
	}

	// ------------------------------------------------------------------
	// Volume (PipeWire nativo, sem processo)
	// ------------------------------------------------------------------
	PwObjectTracker {
		objects: [root.sink]
	}

	readonly property var sink: Pipewire.defaultAudioSink
	readonly property int volumePct: root.sink && root.sink.audio
		? Math.round(root.sink.audio.volume * 100) : 0
	readonly property bool muted: root.sink && root.sink.audio
		? root.sink.audio.muted : false

	readonly property var _volIcons: ["\uf026", "\uf027", "\uf028"]

	function volumeIcon() {
		if (root.muted)
			return "\uf026";
		const nome = root.sink && root.sink.name ? root.sink.name : "";
		// bluez_output (A2DP) e fone/headset; o waybar mostra o mesmo
		// icone de headphone nesse caso.
		if (nome.indexOf("bluez") >= 0)
			return "\uf025";
		return root.volumePct < 34 ? "\uf027"
			: (root.volumePct < 67 ? "\uf028" : "\uf028");
	}

	function bumpVolume(delta) {
		if (!root.sink || !root.sink.audio)
			return;
		const v = root.sink.audio.volume + delta;
		root.sink.audio.volume = Math.max(0, Math.min(1.5, v));
	}

	// ------------------------------------------------------------------
	// Rede (uma chamada de nmcli a cada 5 s)
	// ------------------------------------------------------------------
	property string netLabel: ""
	property string netKind: ""   // wifi, eth ou vazio

	Process {
		id: netProc
		command: ["nmcli", "-t", "-f", "TYPE,STATE,CONNECTION,DEVICE",
			"device"]
		running: false

		stdout: StdioCollector {
			onStreamFinished: root.parseNet(text)
		}
	}

	Timer {
		interval: 5000
		repeat: true
		running: true
		triggeredOnStart: true
		onTriggered: {
			if (!netProc.running)
				netProc.running = true;
		}
	}

	// nmcli -t escapa ':' como '\:' dentro dos campos. Sem respeitar o
	// escape, um SSID com dois-pontos parte a linha no meio.
	function splitNmcli(line) {
		const out = [];
		let atual = "";
		for (let i = 0; i < line.length; i++) {
			const c = line[i];
			if (c === "\\" && i + 1 < line.length) {
				atual += line[i + 1];
				i++;
			} else if (c === ":") {
				out.push(atual);
				atual = "";
			} else {
				atual += c;
			}
		}
		out.push(atual);
		return out;
	}

	function parseNet(text) {
		root.netKind = "";
		root.netLabel = "";
		for (const linha of text.split("\n")) {
			if (!linha)
				continue;
			const f = root.splitNmcli(linha);
			// TYPE:STATE:CONNECTION:DEVICE
			if (f.length < 4)
				continue;
			if (f[1] !== "connected")
				continue;
			if (f[0] === "wifi") {
				root.netKind = "wifi";
				root.netLabel = f[2];
				return;
			}
			if (f[0] === "ethernet" && !root.netKind) {
				root.netKind = "eth";
				root.netLabel = f[3];
			}
		}
	}

	// ------------------------------------------------------------------
	// Bateria (UPower)
	// ------------------------------------------------------------------
	readonly property var bat: UPower.displayDevice
	// O quickshell entrega 0.0..1.0 (medido: 0.85), nao 0..100 como o
	// upower CLI. Sem o *100 a barra mostrava "1%".
	readonly property int batPct: root.bat
		? Math.round(root.bat.percentage * 100) : -1

	// So `Charging` (e PendingCharge) pinta de verde. FullyCharged e o
	// estado de bateria cheia plugada -- a waybar tambem nao aplica a
	// classe .charging nesse caso.
	readonly property bool charging: root.bat
		&& (root.bat.state === UPowerDeviceState.Charging
			|| root.bat.state === UPowerDeviceState.PendingCharge)

	function bateriaIcone(pct) {
		if (pct < 0)
			return "";
		if (pct < 15)
			return "\uf244";
		if (pct < 35)
			return "\uf243";
		if (pct < 60)
			return "\uf242";
		if (pct < 90)
			return "\uf241";
		return "\uf240";
	}

	// ------------------------------------------------------------------
	// Brilho (brightnessctl, uma leitura a cada 5 s)
	// ------------------------------------------------------------------
	property int brightPct: -1

	Process {
		id: brightProc
		command: ["brightnessctl", "-m"]
		running: false

		stdout: StdioCollector {
			onStreamFinished: {
				// "amdgpu_bl1,backlight,65535,100%,65535"
				const f = text.trim().split(",");
				const pct = f.length > 3 ? parseInt(f[3]) : NaN;
				if (!isNaN(pct))
					root.brightPct = pct;
			}
		}
	}

	Process {
		id: brightScroll
		command: ["/home/monteiro/.config/hypr/scripts/brightness.sh",
			"up", "1", "quiet"]
		running: false
	}

	Timer {
		interval: 5000
		repeat: true
		running: true
		triggeredOnStart: true
		onTriggered: {
			if (!brightProc.running)
				brightProc.running = true;
		}
	}

	// Mesma escala de glifos do modulo backlight da waybar.
	readonly property var _brightIcons: ["\ue38d", "\ue3d3", "\ue3d1",
		"\ue3cf", "\ue3ce", "\ue3cd", "\ue3ca", "\ue3c8", "\ue39b"]

	function brightIcon() {
		if (root.brightPct < 0)
			return "\ue3ce";
		const i = Math.max(0, Math.min(8,
			Math.round(root.brightPct / 100 * 8)));
		return root._brightIcons[i];
	}

	function bumpBrightness(up) {
		brightScroll.command = ["/home/monteiro/.config/hypr/scripts/brightness.sh",
			up ? "up" : "down", "1", "quiet"];
		brightScroll.running = false;
		brightScroll.running = true;
	}

	// ------------------------------------------------------------------
	// TLP (perfil de energia)
	// ------------------------------------------------------------------
	property string tlpText: ""
	property string tlpClass: ""

	Process {
		id: tlpProc
		command: ["/home/monteiro/.config/waybar/scripts/tlp.sh", "status"]
		running: false

		stdout: StdioCollector {
			onStreamFinished: {
				try {
					const d = JSON.parse(text);
					root.tlpText = d.text || "";
					root.tlpClass = d.class || "";
				} catch (e) {
				}
			}
		}
	}

	Timer {
		interval: 30000
		repeat: true
		running: true
		triggeredOnStart: true
		onTriggered: {
			if (!tlpProc.running)
				tlpProc.running = true;
		}
	}

	// ------------------------------------------------------------------
	// Bluetooth
	// ------------------------------------------------------------------
	property string btText: ""
	property string btClass: ""

	Process {
		id: btProc
		command: ["/home/monteiro/.config/waybar/scripts/bt.sh"]
		running: false

		stdout: StdioCollector {
			onStreamFinished: {
				try {
					const d = JSON.parse(text);
					root.btText = d.text || "";
					root.btClass = d.class || "";
				} catch (e) {
				}
			}
		}
	}

	Timer {
		interval: 5000
		repeat: true
		running: true
		triggeredOnStart: true
		onTriggered: {
			if (!btProc.running)
				btProc.running = true;
		}
	}

	// ------------------------------------------------------------------
	// Sysinfo (o script da waybar roda em laco; lemos cada linha)
	// ------------------------------------------------------------------
	property string sysText: ""
	property string sysClass: "normal"

	Process {
		id: sysProc
		command: ["/home/monteiro/.config/waybar/scripts/sysinfo.sh"]
		running: true

		stdout: SplitParser {
			onRead: (line) => {
				try {
					const d = JSON.parse(line);
					root.sysText = d.text || "";
					root.sysClass = d.class || "normal";
				} catch (e) {
				}
			}
		}
	}

	function sysColor() {
		if (root.sysClass === "critico")
			return "#FF453A";
		if (root.sysClass === "atencao")
			return "#FF9F0A";
		if (root.sysClass === "erro")
			return "#636366";
		return "#98989D";
	}

	// ------------------------------------------------------------------
	// Nightlight
	// ------------------------------------------------------------------
	property string nightText: ""
	property string nightClass: ""

	Process {
		id: nightProc
		command: ["/home/monteiro/.config/waybar/scripts/nightlight.sh",
			"status"]
		running: false

		stdout: StdioCollector {
			onStreamFinished: {
				try {
					const d = JSON.parse(text);
					root.nightText = d.text || "";
					root.nightClass = d.class || "";
				} catch (e) {
				}
			}
		}
	}

	Process {
		id: nightToggle
		command: ["/home/monteiro/.config/waybar/scripts/nightlight.sh",
			"toggle"]
		running: false
		onExited: {
			if (!nightProc.running)
				nightProc.running = true;
		}
	}

	Timer {
		interval: 30000
		repeat: true
		running: true
		triggeredOnStart: true
		onTriggered: {
			if (!nightProc.running)
				nightProc.running = true;
		}
	}

	// ------------------------------------------------------------------
	// Janela ativa (titulo + icone)
	// ------------------------------------------------------------------
	readonly property var activeTop: Hyprland.activeToplevel
	readonly property string activeTitle: root.activeTop
		&& root.activeTop.title ? root.activeTop.title : ""

	// O HyprlandToplevel do quickshell nao traz appId nesta versao (vem
	// vazio), entao a classe vem do hyprctl a cada troca de foco. E uma
	// consulta por foco, nao polling.
	property string activeClass: ""

	Process {
		id: activeWinProc
		command: ["hyprctl", "-j", "activewindow"]
		running: false

		stdout: StdioCollector {
			onStreamFinished: {
				try {
					const d = JSON.parse(text);
					root.activeClass = d.class || "";
				} catch (e) {
					root.activeClass = "";
				}
			}
		}
	}

	function refreshActiveClass() {
		if (activeWinProc.running)
			return;
		activeWinProc.running = true;
	}

	Component.onCompleted: root.refreshActiveClass()
	onActiveTopChanged: root.refreshActiveClass()

	// ------------------------------------------------------------------
	// Elementos reutilizaveis
	// ------------------------------------------------------------------
	component BarText: Text {
		color: root.fg
		font.family: root.textFont
		// Noto Sans 14px tem altura de x equivalente ao SF Pro 13pt do
		// menu bar; em 13px a barra parecia comprimida ao lado da waybar.
		font.pixelSize: 14
		verticalAlignment: Text.AlignVCenter
	}

	component IconText: Text {
		color: root.fg
		font.family: root.iconFont
		font.pixelSize: 16
		verticalAlignment: Text.AlignVCenter
	}

	// ------------------------------------------------------------------
	// A barra, uma por monitor
	// ------------------------------------------------------------------
	Variants {
		model: Quickshell.screens

		delegate: PanelWindow {
			id: bar
			required property var modelData

			screen: modelData
			anchors {
				top: true
				left: true
				right: true
			}
			implicitHeight: root.barHeight
			color: "transparent"
			// Auto reserva a zona exclusiva a partir da altura implicita
			exclusionMode: ExclusionMode.Auto

			// Sem fundo: o menu bar fica 100% transparente e mostra o
			// papel de parede. A janela do layer-shell reserva a faixa,
			// entao nenhum app fica atras do texto.

			// ---------------- esquerda: workspaces ----------------
			Row {
				anchors.left: parent.left
				anchors.leftMargin: root.barMargin
				anchors.verticalCenter: parent.verticalCenter
				spacing: 4

				Repeater {
					model: Hyprland.workspaces

					delegate: Rectangle {
						required property var modelData

						// Cada monitor mostra so os seus workspaces. O
						// HyprlandWorkspace carrega o monitor dono.
						visible: modelData.id > 0 && modelData.monitor
							&& modelData.monitor.name === bar.screen.name
						width: wsLabel.implicitWidth + 14
						height: 18
						radius: 5
						color: modelData.active ? root.pillActive
							: "transparent"

						Text {
							id: wsLabel
							anchors.centerIn: parent
							text: modelData.name || modelData.id
							color: modelData.active ? root.fg : root.dim
							font.family: root.textFont
							font.pixelSize: 13
						}

						MouseArea {
							anchors.fill: parent
							cursorShape: Qt.PointingHandCursor
							onClicked: modelData.activate()
						}
					}
				}
			}

			// ---------------- centro: icone + titulo da janela ----------------
			// Equivale ao hyprland/window com icon: true da waybar: icone
			// do tema pelo appId, 16px, e o titulo ao lado.
			Item {
				id: titleBox
				anchors.centerIn: parent
				width: Math.min(titleRow.implicitWidth, 620)
				height: 20
				clip: true

				Row {
					id: titleRow
					anchors.verticalCenter: parent.verticalCenter
					spacing: 6

					Image {
						id: titleIcon
						visible: root.activeClass !== ""
						width: 16
						height: 16
						source: root.activeClass !== ""
							? Quickshell.iconPath(root.activeClass) : ""
						sourceSize.width: 16
						sourceSize.height: 16
						fillMode: Image.PreserveAspectFit
					}

					Text {
						id: titleText
						width: Math.min(implicitWidth, 600)
						text: root.activeTitle
						color: root.fg
						font.family: root.textFont
						font.pixelSize: 14
						elide: Text.ElideRight
					}
				}
			}

			// ---------------- direita ----------------
			Row {
				anchors.right: parent.right
				anchors.rightMargin: root.barMargin
				anchors.verticalCenter: parent.verticalCenter
				spacing: 8

				// tray (16pt por icone, como a HIG)
				Row {
					spacing: 2

					Repeater {
						model: SystemTray.items

						delegate: Item {
							id: trayItem
							required property var modelData
							width: 18
							height: 20

							Image {
								anchors.centerIn: parent
								width: 16
								height: 16
								source: modelData.icon
								sourceSize.width: 16
								sourceSize.height: 16
								fillMode: Image.PreserveAspectFit
							}

							// Menu nativo do SNI. `display()` abre o menu do
							// proprio app na posicao do icone; sem isto os
							// itens so-de-menu (Discord, Steam) nao faziam
							// nada no clique.
							MouseArea {
								anchors.fill: parent
								cursorShape: Qt.PointingHandCursor
								acceptedButtons: Qt.LeftButton | Qt.RightButton
								onClicked: (mouse) => {
									const p = trayItem.mapToItem(bar, 0,
										trayItem.height);
									if (mouse.button === Qt.RightButton) {
										if (modelData.hasMenu)
											modelData.display(bar, p.x, p.y);
										else
											modelData.secondaryActivate();
										return;
									}
									if (modelData.onlyMenu && modelData.hasMenu)
										modelData.display(bar, p.x, p.y);
									else
										modelData.activate();
								}
							}
						}
					}
				}

				// rede
				BarModule {
					onClicked: (mouse) => {
						if (mouse.button === Qt.RightButton)
							pavuProc.running = true;
						else
							root.openNmtui();
					}
					IconText {
						text: root.netKind === "wifi" ? "\uf1eb"
							: (root.netKind === "eth" ? "\uf6ff" : "⚠")
					}
					BarText {
						visible: root.netLabel !== ""
						text: root.netLabel
					}
				}

				// volume
				BarModule {
					onClicked: (mouse) => {
						if (mouse.button === Qt.RightButton)
							pavuProc.running = true;
						else
							root.openPopup("volume");
					}
					onWheeled: (wheel) => {
						root.bumpVolume(wheel.angleDelta.y > 0 ? 0.02 : -0.02);
					}
					IconText {
						text: root.volumeIcon()
					}
					BarText {
						text: root.muted ? "mudo" : root.volumePct + "%"
					}
				}

				// brilho
				BarModule {
					onClicked: root.openPopup("brightness")
					onWheeled: (wheel) => {
						root.bumpBrightness(wheel.angleDelta.y > 0);
					}
					IconText { text: root.brightIcon() }
					BarText {
						visible: root.brightPct >= 0
						text: root.brightPct + "%"
					}
				}

				// bateria (verde enquanto carrega, como no macOS)
				BarModule {
					onClicked: root.openPopup("battery")
					IconText {
						text: root.bateriaIcone(root.batPct)
						color: root.charging ? "#34C759"
							: (root.batPct >= 0 && root.batPct < 15
								? "#FF453A" : root.fg)
					}
					BarText {
						visible: root.batPct >= 0
						text: root.batPct + "%"
						color: root.charging ? "#34C759"
							: (root.batPct >= 0 && root.batPct < 15
								? "#FF453A" : root.fg)
					}
				}

				// bluetooth
				BarModule {
					onClicked: root.openPopup("bluetooth")
					IconText {
						text: root.btText
						color: root.btClass === "bt-off"
							? "#66FFFFFF" : root.fg
					}
				}

				// notificacoes
				BarModule {
					onClicked: root.openPopup("notification")
					IconText { text: "\ueaa2" }
				}

				// sysinfo
				BarModule {
					onClicked: root.openPopup("resources")
					IconText {
						text: root.sysText
						color: root.sysColor()
					}
				}

				// nightlight
				BarModule {
					onClicked: {
						nightToggle.running = false;
						nightToggle.running = true;
					}
					IconText {
						// Lua, e nao o texto do script: o nightlight.sh
						// devolve o mesmo \uf185 do brilho.
						text: "\uf186"
						color: root.nightClass === "on" ? "#FFB454" : root.fg
					}
				}

				// TLP
				BarModule {
					onClicked: root.openPopup("battery")
					IconText {
						text: root.tlpText
						color: root.tlpClass === "switching"
							? "#80FFFFFF" : root.fg
					}
				}

				// relogio
				BarModule {
					onClicked: root.openPopup("calendar")
					BarText { text: root.clockText }
				}
			}
		}
	}

	// Popup e notificacoes no MESMO processo da barra: um runtime Qt
	// so, em vez de dois processos. O config `popup` continua no disco
	// como fallback.
	PopupShell {}

}
