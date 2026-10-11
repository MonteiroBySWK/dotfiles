import QtQuick
import QtQuick.Layouts
import QtQuick.Controls
import QtQuick.Controls.Basic
import Qt5Compat.GraphicalEffects
import Quickshell
import Quickshell.Io
import Quickshell.Services.Notifications
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

	// 0 = fechado, 1 = volume, 2 = brilho, 3 = calendario, 4 = recursos
	property int mode: 0

	// Onde abrir. Negativo = centrado na tela, que e o fallback quando o
	// popup e aberto por tecla e nao por clique. Vem do cursor no momento
	// do clique, via hyprctl cursorpos.
	property real popX: -1

	// Em qual tela o popup vai aparecer. A posicao do cursor chega em
	// coordenada global, e as telas podem ter x negativo -- o monitor a
	// esquerda deste setup comeca em -1920. Sem converter, o popup iria
	// para a borda da tela errada.
	readonly property var telaAtual: {
		for (const s of Quickshell.screens) {
			if (popX >= s.x && popX < s.x + s.width)
				return s;
		}
		return Quickshell.screens[0];
	}

	// Cursor na coordenada local da tela do popup.
	readonly property real localX: popX < 0 ? -1 : popX - telaAtual.x

	// Tela do CURSOR, nao da tela do popup. O toast nao tem clique: ele
	// aparece sozinho quando a notificacao chega, entao nao ha popX para
	// deduzir a tela. Sem isto ele sai sempre na tela padrao, que pode nao
	// ser a que a pessoa esta olhando.
	property var telaDoCursor: Quickshell.screens.length > 0
		? Quickshell.screens[0] : null

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
	// Roda UMA vez por notificacao, nao em laco. Um hyprctl por
	// notificacao e irrelevante; um hyprctl por quadro seria um processo a
	// mais o tempo todo.
	Process {
		id: cursorProc
		command: ["hyprctl", "-j", "cursorpos"]
		running: false

		stdout: StdioCollector {
			id: cursorOut
			onStreamFinished: {
				try {
					const c = JSON.parse(cursorOut.text);
					const x = c.x !== undefined ? c.x : 0;
					const y = c.y !== undefined ? c.y : 0;
					for (const s of Quickshell.screens) {
						if (x >= s.x && x < s.x + s.width
								&& y >= s.y && y < s.y + s.height) {
							root.telaDoCursor = s;
							return;
						}
					}
				} catch (e) {
					// hyprctl fora do ar: fica na tela padrao, que e
					// o mesmo comportamento de antes.
				}
			}
		}
	}

	// Le a bateria. Caminho absoluto: o cwd do quickshell nao e o
	// ~/.config, e com caminho relativo o processo falhava em silencio --
	// o painel abria sem nenhuma linha.
	Process {
		id: readBatteryProc
		command: ["/home/monteiro/.config/quickshell/popup/battery.sh"]
		running: false

		stdout: StdioCollector {
			id: batteryOut
			onStreamFinished: {
				try {
					root.bateria = JSON.parse(batteryOut.text);
				} catch (e) {
					// JSON quebrado nao pode limpar o painel que ja
					// esta na tela; o erro vai para o log e o painel
					// segue com o que tinha.
					console.warn("battery.sh devolveu JSON invalido:", e);
				}
			}
		}
	}

	// Aplica o perfil escolhido. Separado da leitura: um `running` so,
	// com o argumento trocado, daria condicao de corrida entre dois
	// cliques seguidos -- o segundo comecaria antes do primeiro acabar.
	Process {
		id: applyPerfilProc
		property string perfil: ""
		command: ["/home/monteiro/.config/quickshell/popup/tlp-apply.sh", perfil]
		running: false

		stdout: StdioCollector {
			id: applyOut
			onStreamFinished: {
				try {
					const r = JSON.parse(applyOut.text);
					if (!r.ok)
						console.warn("TLP recusou:", r.erro);
				} catch (e) {
					console.warn("tlp-apply.sh devolveu JSON invalido:", e);
				}
				root.aplicandoPerfil = false;
				root.readBattery();
			}
		}
	}

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

	// Calendario: mes visivel, e o dia de hoje separado. "Hoje" tem de ser
	// fixo no instante em que o popup abre -- se fosse uma funcao lida a
	// cada reavaliacao, virar o mes mudaria o dia de referencia junto.
	property int calYear: 0
	property int calMonth: 0

	function calToday() {
		const d = new Date();
		return [d.getDate(), d.getMonth(), d.getFullYear()];
	}

	// Grade do mes: null nos lugares vazios do comeco e do fim, para o dia
	// 1 cair na coluna certa sem posicao manual.
	function calGrid() {
		const primeiro = new Date(calYear, calMonth, 1);
		// getDay() comeca no domingo; a grade comeca na segunda, como no
		// macOS e no calendario do GNOME.
		const vazios = (primeiro.getDay() + 6) % 7;
		const dias = new Date(calYear, calMonth + 1, 0).getDate();
		const celulas = [];
		for (let i = 0; i < vazios; i++)
			celulas.push(null);
		for (let d = 1; d <= dias; d++)
			celulas.push(d);
		while (celulas.length % 7 !== 0)
			celulas.push(null);
		return celulas;
	}

	readonly property var calCells: calGrid()

	// Qt.formatDate segue o locale do sistema, que nesta maquina e C e
	// devolve "October de 2026". A lista e escrita a mao.
	readonly property var meses: ["janeiro", "fevereiro", "marco", "abril",
		"maio", "junho", "julho", "agosto", "setembro", "outubro",
		"novembro", "dezembro"]

	// Notificacoes: servico NATIVO do quickshell. Ele se registra em
	// org.freedesktop.Notifications e sinaliza cada notificacao recebida.
	//
	// O mako saiu do autostart: ocupava o mesmo nome no DBus e nao deixava
	// o quickshell registrar. As teclas de volume nao dependiam dele --
	// elas vao pelo swayosd-client.
	//
	// A lista e NOSSA, alimentada pelo sinal, e nao o trackedNotifications
	// do servico. Medido no quickshell 0.3.2: o sinal dispara e a
	// notificacao chega, mas trackedNotifications fica vazio -- tanto sem
	// keepOnReload quanto com ele. A fonte so devolve o modelo quando o
	// servico fica "live", o que nao acontece aqui. Depender dele daria um
	// painel permanentemente vazio.
	property var notificacoes: []
	property int notifLimite: 30

	// Toast: a janela que ANUNCIA a notificacao assim que ela chega.
	//
	// Com o mako fora, sem isto a notificacao so aparecia se a pessoa
	// abrisse o painel e olhasse -- existia mas nao se anunciava. E o que
	// o mako fazia, agora sem daemon externo.
	property var toasts: []

	Timer {
		id: toastTimer
		// 4,2s e o que o mako usava. Curto o bastante para nao
		// acumular, longo o bastante para ler o titulo.
		interval: 4200
		onTriggered: {
			// Sai a mais antiga. A janela se fecha sozinha quando a
			// lista esvazia, entao nao ha cronometro por item.
			if (root.toasts.length > 0)
				root.toasts = root.toasts.slice(1);
		}
	}

	NotificationServer {
		id: notifServer
		actionsSupported: true
		bodyHyperlinksSupported: true
		inlineReplySupported: true

		onNotification: (n) => {
			// Mais nova primeiro, como o Notification Center do macOS.
			root.notificacoes = [n].concat(root.notificacoes);
			if (root.notificacoes.length > root.notifLimite)
				root.notificacoes = root.notificacoes.slice(0, root.notifLimite);
			// Anuncia. No maximo dois: o terceiro empurra o
			// primeiro, que ja cumpriu os 4,2s dele.
			root.toasts = root.toasts.concat([n]).slice(-2);
			cursorProc.running = false;
			cursorProc.running = true;
			toastTimer.restart();
		}
	}

	function openNotifications(x) {
		// Sem esta linha o painel ignora a posicao do cursor e abre onde a
		// janela ja estivesse. As outras acoes do popup fazem isto.
		root.popX = (x === undefined || x <= 0) ? -1 : x;
		root.mode = 5;
		// Nao some sozinho: o usuario abriu para LER.
		hideTimer.stop();
	}

	function fecharNotificacoes() {
		root.close();
	}

	function limparNotificacoes() {
		for (const n of root.notificacoes)
			n.dismiss();
		root.notificacoes = [];
	}

	// Recursos, do list-resources.sh
	// Altura do painel por modo. Fica em funcao porque ternario com seis
	// niveis fica ilegivel, e parentese faltando so aparece quando o popup
	// abre.
	function alturaPainel() {
		if (mode === 5)
			return Math.max(120, 44 + Math.min(notificacoes.length, 6) * 78);
		if (mode === 3)
			return 300;
		if (mode === 4)
			return 322;
		if (mode === 1)
			return Math.max(64, 28 + sinks.length * 58
				+ (micInUse ? 56 : 0) + 32);
		if (mode === 2)
			return ddcAvailable ? 104 : 48;
		if (mode === 6)
			return 96 + (bateria.perfis ? bateria.perfis.length : 3) * 52;
		return 4;
	}

	// ------------------------------------------------------------------
	// Bateria / perfil de energia
	// ------------------------------------------------------------------
	// O objeto inteiro do battery.sh: carga, fonte, perfil, epp e a lista
	// de perfis. Tudo num so lugar porque o painel e pequeno e os dados
	// chegam juntos.
	property var bateria: ({})

	function readBattery() {
		readBatteryProc.running = false;
		readBatteryProc.running = true;
	}

	// Clique numa linha de perfil: aplica no TLP e re-le. A re-leitura
	// importa porque o TLP renomeia o perfil conforme a fonte (balanced
	// vira balanced/BAT, power-saver vira power-saver/SAV), entao o
	// check precisa vir do que ele gravou, nao do que pedimos.
	function applyPerfil(id) {
		applyPerfilProc.perfil = id;
		applyPerfilProc.running = false;
		applyPerfilProc.running = true;
	}

	// Faz o botao travar enquanto o TLP aplica: sao ~1 s de sudo e da para
	// clicar duas vezes, e o segundo comando brigaria com o primeiro.
	property bool aplicandoPerfil: false

	property var res: ({})
	property var temps: []

	// Enquanto o painel de recursos esta aberto ele se atualiza sozinho;
	// fechado, nao ha polling -- ler recursos a cada segundo para nada
	// seria desperdicio de processo.
	property bool resTimerOn: false

	function applyResources(text) {
		try {
			const d = JSON.parse(text);
			root.res = d;
			root.temps = d.temp || [];
			syncResourceRows(d);
		} catch (e) {
			// JSON quebrado nao pode apagar o painel que ja esta na tela.
			console.warn("list-resources.sh devolveu JSON invalido:", e);
		}
	}

	// Which linhas existem e quais sao os valores delas.
	function resourceRows(d) {
		if (!d || !d.cpu)
			return [];
		const c = d.cpu;
		const m = d.mem || {};
		const g = d.gpu || {};
		const linhas = [
			{ rotulo: "CPU", detalhe: c.cores + " nucleos",
				valor: c.percent, sufixo: "%" },
			{ rotulo: "Memoria", detalhe: m.usedMb + " MB de " + m.totalMb + " MB",
				valor: m.percent || 0, sufixo: "%" },
		];
		if (m.swapPercent !== undefined)
			linhas.push({ rotulo: "Swap",
				detalhe: m.swapUsedMb + " MB de " + m.swapTotalMb + " MB",
				valor: m.swapPercent, sufixo: "%" });

		// A barra da GPU mostra TEMPERATURA, nao uso. Uso de GPU ocioso e
		// poucos por cento e nao diz nada de saude; a temperatura e o numero
		// que importa. Com o uso na barra, um GPU a 77 C aparecia cinza,
		// como se estivesse bem.
		if (g.celsius !== undefined) {
			linhas.push({ rotulo: g.name || "GPU",
				detalhe: "uso " + (g.percent || 0) + "%",
				valor: g.celsius, sufixo: "°C" });
		} else if (g.percent !== undefined) {
			linhas.push({ rotulo: g.name || "GPU", detalhe: "",
				valor: g.percent, sufixo: "%" });
		}
		return linhas;
	}

	// Repopula so quando o CONJUNTO de linhas muda. No caso comum -- CPU,
	// memoria, swap e GPU sempre presentes -- so os valores sao escritos, e
	// os delegates vivem. E o que permite a barra animar em vez de nascer
	// do zero a cada leitura.
	function syncResourceRows(d) {
		const linhas = resourceRows(d);
		let mesmoEsqueleto = resModel.count === linhas.length;
		if (mesmoEsqueleto) {
			for (let i = 0; i < linhas.length; i++) {
				if (resModel.get(i).rotulo !== linhas[i].rotulo) {
					mesmoEsqueleto = false;
					break;
				}
			}
		}
		if (!mesmoEsqueleto) {
			resModel.clear();
			for (const l of linhas)
				resModel.append(l);
			return;
		}
		for (let i = 0; i < linhas.length; i++) {
			resModel.setProperty(i, "detalhe", linhas[i].detalhe);
			resModel.setProperty(i, "valor", linhas[i].valor);
			resModel.setProperty(i, "sufixo", linhas[i].sufixo);
		}
	}

	// As linhas do painel de recursos. Ver syncResourceRows: o modelo e um
	// ListModel, nao um array, porque o Repeater recria o delegate a cada
	// objeto novo e a barra nascia em zero.
	ListModel {
		id: resModel
	}

	function openResources(x) {
		// x <= 0 em vez de x < 0: sem argumento o IPC passa 0, que e um
		// valor legitimo (borda esquerda da tela). Com "x < 0" o 0 caia
		// fora e o popup ia para a borda em vez de centralizar.
		root.popX = (x === undefined || x <= 0) ? -1 : x;
		root.mode = 4;
		root.resTimerOn = true;
		readResources.running = false;
		readResources.running = true;
		hideTimer.restart();
	}

	Process {
		id: readResources
		command: ["/home/monteiro/.config/quickshell/popup/list-resources.sh"]
		stdout: StdioCollector {
			onStreamFinished: root.applyResources(text)
		}
	}

	Timer {
		id: resTimer
		interval: 1000
		repeat: true
		running: root.resTimerOn
		triggeredOnStart: true
		onTriggered: {
			readResources.running = false;
			readResources.running = true;
		}
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

		function showVolume(x: int): void {
			root.openVolume(x);
		}

		function showBrightness(x: int): void {
			root.openBrightness(x);
		}

		function showCalendar(x: int): void {
			root.openCalendar(x);
		}

		function showResources(x: int): void {
			root.openResources(x);
		}

		function showNotifications(x: int): void {
			root.openNotifications(x);
		}

		function showBattery(x: int): void {
			root.openBattery(x);
		}

		function hide(): void {
			root.close();
		}
	}

	// ------------------------------------------------------------------
	// Acoes
	// ------------------------------------------------------------------
	function openVolume(x) {
		// x <= 0 em vez de x < 0: sem argumento o IPC passa 0, que e um
		// valor legitimo (borda esquerda da tela). Com "x < 0" o 0 caia
		// fora e o popup ia para a borda em vez de centralizar.
		root.popX = (x === undefined || x <= 0) ? -1 : x;
		root.refreshDevices();
		root.mode = 1;
		hideTimer.restart();
	}

	function openCalendar(x) {
		// x <= 0 em vez de x < 0: sem argumento o IPC passa 0, que e um
		// valor legitimo (borda esquerda da tela). Com "x < 0" o 0 caia
		// fora e o popup ia para a borda em vez de centralizar.
		root.popX = (x === undefined || x <= 0) ? -1 : x;
		root.mode = 3;
		// Ao abrir, volta para o mes de hoje: sair de novembro e voltar
		// amanha e encontrar a grade em branco e confuso.
		const agora = new Date();
		root.calYear = agora.getFullYear();
		root.calMonth = agora.getMonth();
		hideTimer.restart();
	}

	function openBrightness(x) {
		// x <= 0 em vez de x < 0: sem argumento o IPC passa 0, que e um
		// valor legitimo (borda esquerda da tela). Com "x < 0" o 0 caia
		// fora e o popup ia para a borda em vez de centralizar.
		root.popX = (x === undefined || x <= 0) ? -1 : x;
		readBrightness.running = false;
		readBrightness.running = true;
		readDdc();
		root.mode = 2;
		hideTimer.restart();
	}

	// Bateria e perfil de energia.
	//
	// Le antes de abrir, e nao depois: abrir com a coluna de perfis vazia e
	// so preencher depois faz o painel mudar de altura debaixo da mao da
	// pessoa. Lendo antes, ele ja abre do tamanho certo.
	function openBattery(x) {
		root.popX = (x === undefined || x <= 0) ? -1 : x;
		root.readBattery();
		root.mode = 6;
		// Fica aberto: trocar perfil e uma acao deliberada, e fechar
		// sozinho no meio do clique seria travar a mao da pessoa.
		hideTimer.stop();
	}

	function close() {
		root.mode = 0;
		root.dragging = false;
		root.resTimerOn = false;
		root.popX = -1;
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

		// A janela precisa IR para a tela onde foi clicado. Sem isso ela
		// fica presa no monitor do notebook, e o localX -- que é a
		// posição do cursor dentro da tela certa -- era aplicado na tela
		// errada, resultado no meio.
		screen: root.telaAtual

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
			// Segue o cursor quando o popup foi aberto por clique; com popX
			// negativo cai no centro, que e o caso de quem abre por tecla.
			//
			// Sem usar anchors de proposito: ancorar e posicionar sao
			// mecanismos que se brigam -- com "horizontalCenter: undefined"
			// a ancora continuava ditando o x e o popup ia para a borda
			// esquerda. Aqui o x e calculado direto.
			x: root.popX < 0
				? (parent.width - width) / 2
				: Math.max(0, Math.min(parent.width - width,
					root.localX - width / 2))
			// A altura do volume deixou de ser fixa: a lista de aparelhos
			// tem uma linha por sink, mais o divisor e a linha do mic. Com
			// altura fixa de 96px o painel cortava o segundo aparelho.
			// O minimo de 48px e o piso do modo brilho sem DDC.
		// A altura depende do conteudo. Ternario com seis niveis fica
		// ilegivel e erro de parenteses nao aparece ate o popup abrir --
		// por isso e uma funcao.
		width: 340
		height: root.alturaPainel()

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
						// Enquanto o botao esta apertado, o numero mostra o valor
						// sob o dedo. Sem isto so atualizava no onCommitted, e
						// arrastar parecia nao mudar nada.
						readonly property real shown: sinkSlider.pressed ? sinkSlider.value : modelData.volume
						readonly property bool shownMuted: sinkSlider.pressed ? false : modelData.muted

						// Escrita durante o arraste, com limite de taxa. Sem o
						// limite, cada pixel do arraste abriria um processo
						// pactl. ~20 por segundo e imperceptivel e nao
						// entope o pipewire.
						property real lastSent: 0
						property int minIntervalMs: 50

						function sendLive(v) {
							const agora = Date.now();
							if (agora - lastSent < minIntervalMs)
								return;
							lastSent = agora;
							writeDevice.setVolume(modelData.name, v, modelData.kind === "source");
						}

						ColumnLayout {
							anchors.fill: parent
							anchors.margins: 10
							spacing: 6

							RowLayout {
								Layout.fillWidth: true
								spacing: 8

								Text {
									text: shownMuted ? "\uf026" : "\uf028"
									color: shownMuted ? "#FF453A" : "#98989D"
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
									text: shownMuted ? "mudo" : Math.round(shown) + "%"
									color: shownMuted ? "#FF453A" : "#98989D"
									font.pixelSize: 12
									font.family: "JetBrainsMono Nerd Font"
								}
							}

							MacSlider {
								id: sinkSlider
								Layout.fillWidth: true
								from: 0
								to: root.maxVolume
								value: modelData.volume

								onPressedChanged: {
									hideTimer.restart();
									root.dragging = pressed;
								}
								onDragged: function (v) {
									sendLive(v);
								}
								onCommitted: function (v) {
									// Ultimo valor, sem passar pelo limite de taxa: se
									// caiu fora da janela, ele nunca foi enviado.
									lastSent = 0;
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

				// ---------------- mais ajustes ----------------
				// Dentro do ColumnLayout do volume, e nao como irmo: o volCol
				// tem anchors.fill, entao um Rectangle irmao ficaria por cima
				// da lista.
				Rectangle {
					id: moreBtn
					Layout.alignment: Qt.AlignHCenter
					Layout.topMargin: 6
					implicitWidth: moreLabel.implicitWidth + 24
					implicitHeight: 26
					radius: 6
					color: "transparent"

					Text {
						id: moreLabel
						anchors.centerIn: parent
						text: "mais ajustes"
						color: "#98989D"
						font.pixelSize: 12
						font.family: "JetBrainsMono Nerd Font"
					}

					MouseArea {
						anchors.fill: parent
						hoverEnabled: true
						cursorShape: Qt.PointingHandCursor
						onEntered: moreBtn.color = "#2C2C2E"
						onExited: moreBtn.color = "transparent"
						onPressed: hideTimer.restart()
						onClicked: openPavu.apply()
					}
				}
			}

			// ---------------- notificacoes ----------------
			// Lista no spirit do Notification Center do macOS: cabecalho
			// com o total e um botao de limpar, e um cartao por
			// notificacao com as acoes quando o app as oferece.
			ColumnLayout {
				id: notifCol
				visible: root.mode === 5
				anchors.fill: parent
				anchors.margins: 12
				spacing: 8

				RowLayout {
					Layout.fillWidth: true

					Text {
						Layout.fillWidth: true
						text: root.notificacoes.length === 0
							? "notificacoes"
							: "notificacoes (" + root.notificacoes.length + ")"
						color: "#F5F5F7"
						font.pixelSize: 13
						font.weight: Font.DemiBold
						font.family: "JetBrainsMono Nerd Font"
					}

					Text {
						text: "limpar"
						color: "#98989D"
						font.pixelSize: 11
						font.family: "JetBrainsMono Nerd Font"
						visible: root.notificacoes.length > 0

						MouseArea {
							anchors.fill: parent
							cursorShape: Qt.PointingHandCursor
							onClicked: root.limparNotificacoes()
						}
					}

					Text {
						text: "x"
						color: "#98989D"
						font.pixelSize: 13
						font.family: "JetBrainsMono Nerd Font"

						MouseArea {
							anchors.fill: parent
							cursorShape: Qt.PointingHandCursor
							onClicked: root.fecharNotificacoes()
						}
					}
				}

				// Vazio: um placeholder curto e honesto, em vez de um
				// painel em branco sem explicacao.
				Text {
					Layout.fillWidth: true
					visible: root.notificacoes.length === 0
					text: "nenhuma notificacao"
					color: "#636366"
					font.pixelSize: 12
					font.family: "JetBrainsMono Nerd Font"
					horizontalAlignment: Text.AlignHCenter
					Layout.topMargin: 20
					Layout.bottomMargin: 20
				}

				ListView {
					Layout.fillWidth: true
					Layout.fillHeight: true
					clip: true
					spacing: 6
					model: root.notificacoes
					// Sem ScrollBar visivel: no macOS a lista rola sem barra
					// e o cursor de scroll ja da o feedback.

					delegate: Rectangle {
						required property var modelData
						required property int index
						width: ListView.view.width
						height: cartao.implicitHeight + 16
						radius: 10
						color: "#2C2C2E"

						ColumnLayout {
							id: cartao
							anchors.fill: parent
							anchors.margins: 8
							spacing: 4

							Text {
								Layout.fillWidth: true
								text: modelData.appName
								color: "#636366"
								font.pixelSize: 10
								font.family: "JetBrainsMono Nerd Font"
								elide: Text.ElideRight
							}

							Text {
								Layout.fillWidth: true
								text: modelData.summary
								color: "#F5F5F7"
								font.pixelSize: 13
								font.weight: Font.DemiBold
								font.family: "JetBrainsMono Nerd Font"
								wrapMode: Text.WordWrap
								maximumLineCount: 2
								elide: Text.ElideRight
							}

							Text {
								Layout.fillWidth: true
								visible: modelData.body !== ""
								text: modelData.body
								color: "#98989D"
								font.pixelSize: 11
								font.family: "JetBrainsMono Nerd Font"
								wrapMode: Text.WordWrap
								maximumLineCount: 3
								elide: Text.ElideRight
							}

							// Acoes do app ("Mostrar", "Responder"...). Sem
							// isso a notificacao e so leitura.
							RowLayout {
								Layout.fillWidth: true
								visible: modelData.actions.length > 0
								spacing: 6
								Layout.topMargin: 2

								Repeater {
									model: modelData.actions

									delegate: Rectangle {
										// O modelData interno SOMBREIA o da
										// notificacao. Por isso o id acao: sem ele
										// nao ha como alcançar a notificacao de
										// dentro do delegate, e a acao quebrava com
										// "Cannot read property of undefined".
										id: acao
										required property var modelData
										implicitWidth: acaoLabel.implicitWidth + 16
										implicitHeight: 22
										radius: 6
										color: "#3A3A3C"

										Text {
											id: acaoLabel
											anchors.centerIn: parent
											text: acao.modelData.text
											color: "#F5F5F7"
											font.pixelSize: 11
											font.family: "JetBrainsMono Nerd Font"
										}

										MouseArea {
											anchors.fill: parent
											cursorShape: Qt.PointingHandCursor
											// O objeto da acao tem invoke(): e o
											// proprio servico que dispara, sem
											// gdbus e sem id numerico.
											onClicked: acao.modelData.invoke()
										}
									}
								}
							}
						}
					}
				}
			}

			// ---------------- calendario ----------------
			// Cabecalho com navegacao, dias da semana, grade. Tokens do
			// macOS: hoje e um circulo azul cheios, o resto e texto.
			ColumnLayout {
				id: calCol
				visible: root.mode === 3
				anchors.fill: parent
				anchors.margins: 14
				spacing: 8

				RowLayout {
					Layout.fillWidth: true

					Text {
						Layout.fillWidth: true
						// Mes por extenso: "outubro de 2026".
						text: root.meses[root.calMonth] + " de " + root.calYear
						color: "#F5F5F7"
						font.pixelSize: 14
						font.family: "JetBrainsMono Nerd Font"
					}

					Text {
						text: "\u2039"
						color: "#98989D"
						font.pixelSize: 17
						font.family: "JetBrainsMono Nerd Font"
						MouseArea {
							anchors.fill: parent
							cursorShape: Qt.PointingHandCursor
							onClicked: root.calMonth--
							onPressed: hideTimer.restart()
						}
					}

					Text {
						text: "\u203a"
						color: "#98989D"
						font.pixelSize: 17
						font.family: "JetBrainsMono Nerd Font"
						MouseArea {
							anchors.fill: parent
							cursorShape: Qt.PointingHandCursor
							onClicked: root.calMonth++
							onPressed: hideTimer.restart()
						}
					}
				}

				// Cabecalho dos dias da semana. A grade comeca na segunda.
				RowLayout {
					Layout.fillWidth: true
					Repeater {
						model: ["seg", "ter", "qua", "qui", "sex", "sab", "dom"]
						delegate: Text {
							required property string modelData
							Layout.fillWidth: true
							horizontalAlignment: Text.AlignHCenter
							text: modelData
							color: "#636366"
							font.pixelSize: 10
							font.family: "JetBrainsMono Nerd Font"
						}
					}
				}

				GridLayout {
					columns: 7
					columnSpacing: 0
					rowSpacing: 2
					Layout.fillWidth: true

					Repeater {
					model: root.calCells
					delegate: Item {
						id: calCell
						required property var modelData
						// Num Repeater com required property, o index tambem
						// precisa ser declarado -- sem isso o QML loga
						// "index is not defined" e o fimDeSemana fica
						// indefinido.
						required property int index
						Layout.fillWidth: true
						Layout.preferredHeight: 30

						readonly property var hoje: root.calToday()
						readonly property bool isHoje: modelData !== null
							&& modelData === hoje[0]
							&& root.calMonth === hoje[1]
							&& root.calYear === hoje[2]
						readonly property bool fimDeSemana: (index % 7) >= 5

						Text {
							anchors.centerIn: parent
							width: 26
							height: 26
							horizontalAlignment: Text.AlignHCenter
							verticalAlignment: Text.AlignVCenter
							text: calCell.modelData === null ? "" : calCell.modelData
							// Hoje: circulo azul cheio. No macOS o dia de
							// hoje e o unico elemento com cor de destaque.
							color: calCell.isHoje ? "#FFFFFF" : (calCell.fimDeSemana ? "#98989D" : "#F5F5F7")
							font.pixelSize: 12
							font.family: "JetBrainsMono Nerd Font"
							font.weight: calCell.isHoje ? Font.DemiBold : Font.Normal

							Rectangle {
								anchors.centerIn: parent
								width: 26
								height: 26
								radius: 13
								visible: calCell.isHoje
								color: "#0A84FF"
							}
						}
					}
					}
				}
			}

			// ---------------- recursos ----------------
			// No spirit do Activity Monitor: rotulo, valor e barra por
			// recurso, com a cor mudando por faixa. So faz polling enquanto
			// o painel esta aberto.
			ColumnLayout {
				id: resCol
				visible: root.mode === 4
				anchors.fill: parent
				anchors.margins: 14
				spacing: 10

				Repeater {
				// ListModel e nao um array no model: o Repeater recria o
					// delegate sempre que o model e um objeto novo, e um
					// delegate recriado nasce com a barra em zero -- era o
					// "zera e carrega" que aparecia a cada segundo. Com
					// ListModel so as linhas que entram ou saem mexem no
					// delegate; os valores sao atualizados no lugar, a barra
					// mantem o estado e pode animar.
					model: resModel

					delegate: Item {
						required property string rotulo
						required property string detalhe
						required property real valor
						required property string sufixo
						Layout.fillWidth: true
						Layout.preferredHeight: 44

						ColumnLayout {
							anchors.fill: parent
							spacing: 5

							RowLayout {
								Layout.fillWidth: true

								Text {
									Layout.fillWidth: true
									text: rotulo
									color: "#F5F5F7"
									font.pixelSize: 13
									font.weight: Font.DemiBold
									font.family: "JetBrainsMono Nerd Font"
								}

								Text {
									text: detalhe
									color: "#636366"
									font.pixelSize: 11
									font.family: "JetBrainsMono Nerd Font"
								}

								Text {
									// O numero tambem anima, junto com a barra: mudar
									// os dois no mesmo tempo le o olho como uma
									// transicao so.
									text: Math.round(valor) + sufixo
									color: "#98989D"
									font.pixelSize: 12
									font.family: "JetBrainsMono Nerd Font"
								}
							}

							StatBar {
								Layout.fillWidth: true
								Layout.preferredHeight: 8
								percent: valor
							}
						}
					}
				}

				// Divisor antes dos sensores.
				Rectangle {
					Layout.fillWidth: true
					Layout.preferredHeight: 1
					color: "#3A3A3C"
				}

				Text {
					Layout.fillWidth: true
					// Cabecalho dos chips de sensor. A unidade da barra da
					// GPU ja aparece na propria linha ("69 °C"), entao nao
					// precisa de aviso aqui.
					text: "temperaturas"
					color: "#636366"
					font.pixelSize: 10
					font.family: "JetBrainsMono Nerd Font"
				}

				Flow {
					Layout.fillWidth: true
					spacing: 6

					Repeater {
						model: root.temps

						delegate: Rectangle {
							required property var modelData
							implicitWidth: tempText.implicitWidth + 14
							implicitHeight: 22
							radius: 6
							color: "#2C2C2E"

							Text {
								id: tempText
								anchors.centerIn: parent
								// Acima de 80 o texto fica vermelho: e o ponto em
								// que o CPU comeca a reduzir frequencia.
								text: modelData.label + " " + Math.round(modelData.celsius) + "°"
								color: modelData.celsius >= 80 ? "#FF453A" : "#98989D"
								font.pixelSize: 11
								font.family: "JetBrainsMono Nerd Font"

								// Transiciona junto com a barra: cruzar os 80 C
								// vira uma troca de cor, e nao um piscar.
								Behavior on color {
									ColorAnimation {
										duration: 380
									}
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

			// ------------------------------------------------------------------
			// Bateria e perfil de energia
			// ------------------------------------------------------------------
			// Cada perfil e uma LINHA, e nao um slider de 0 a 100. Sao tres
			// posicoes discretas, nao um continuo: um slider aqui seria
			// bonito e mentiria, porque "70%" nao existe neste TLP.
			//
			// O cabecalho junta carga e fonte. Com o carregador e um raio;
			// na bateria, uma bateria -- que e o unico jeito de diferenciar
			// "100% e estou bem" de "100% e carregando".
			ColumnLayout {
				id: batCol
				visible: root.mode === 6
				anchors.fill: parent
				anchors.margins: 16
				spacing: 12

				RowLayout {
					spacing: 12
					Layout.fillWidth: true

					// nf-md-battery-charging / nf-md-battery. O glifo muda
					// com a fonte, que e a informacao util.
					Text {
						Layout.preferredWidth: 22
						text: root.bateria.fonte === "AC" ? "\uf1b6" : "\uf1b3"
						color: root.bateria.fonte === "AC" ? "#34C759" : "#FF9F0A"
						font.pixelSize: 18
						font.family: "JetBrainsMono Nerd Font"
					}

					ColumnLayout {
						spacing: 1
						Layout.fillWidth: true

						Text {
							Layout.fillWidth: true
							text: (root.bateria.carga !== undefined
								? root.bateria.carga : 0) + "%"
								+ (root.bateria.status === "Full" ? " · cheia"
									: root.bateria.status === "Charging" ? " · carregando"
									: root.bateria.status === "Discharging" ? " · na bateria"
									: "")
							color: "#F5F5F7"
							font.pixelSize: 15
							font.weight: Font.DemiBold
							font.family: "JetBrainsMono Nerd Font"
						}

						// O epp e a letra que o TLP escreve no
						// energy_performance_preference. Nome crivel para
						// ninguem, mas e ele que mostra o que mudou de
						// verdade ao trocar de perfil.
						Text {
							Layout.fillWidth: true
							text: root.bateria.fonte === "AC" ? "no carregador" : "na bateria"
								+ (root.bateria.epp ? " · epp " + root.bateria.epp : "")
							color: "#636366"
							font.pixelSize: 10
							font.family: "JetBrainsMono Nerd Font"
							elide: Text.ElideRight
						}
					}
				}

				// As tres linhas de perfil. Repetidor sobre o array que o
				// battery.sh mandou -- a ordem e do TLP (performance,
				// balanced, power-saver), nao alfabetica.
				Repeater {
					model: root.bateria.perfis || []

					delegate: Rectangle {
						id: perfilLinha
						required property var modelData

						readonly property bool ativo: modelData.id === root.bateria.perfil

						Layout.fillWidth: true
						Layout.preferredHeight: 46
						radius: 9
						// A linha ativa tem fundo; as outras, nao. Sem
						// borda para ninguem: o preenchimento ja diz
						// qual vale, e contorno seria ruido.
						color: ativo ? "#2C2C2E" : "transparent"
						border.width: ativo ? 1 : 0
						border.color: "#48484A"

						// Enquanto o TLP aplica (cerca de 1s de sudo), o
						// painel esmaece e ignora clique: dois cliques
						// rapidos subiriam dois `sudo -n tlp` e o segundo
						// brigaria com o primeiro.
						opacity: root.aplicandoPerfil ? 0.5 : 1

						Behavior on opacity {
							NumberAnimation {
								duration: 140
								easing.type: Easing.OutCubic
							}
						}

						MouseArea {
							anchors.fill: parent
							cursorShape: Qt.PointingHandCursor
							enabled: !root.aplicandoPerfil

							onClicked: {
								hideTimer.stop();
								root.aplicandoPerfil = true;
								root.applyPerfil(perfilLinha.modelData.id);
							}
						}

						RowLayout {
							anchors.fill: parent
							anchors.leftMargin: 12
							anchors.rightMargin: 12
							spacing: 10

							// O check so na linha ativa. Reservado
							// (largura fixa) nas outras para o nome nao
							// pular de coluna quando o perfil muda.
							Text {
								Layout.preferredWidth: 16
								text: "\uf00c"
								visible: perfilLinha.ativo
								color: "#34C759"
								font.pixelSize: 12
								font.family: "JetBrainsMono Nerd Font"
							}

							ColumnLayout {
								spacing: 0
								Layout.fillWidth: true

								Text {
									Layout.fillWidth: true
									text: perfilLinha.modelData.nome
									color: perfilLinha.ativo ? "#F5F5F7" : "#98989D"
									font.pixelSize: 13
									font.weight: perfilLinha.ativo ? Font.DemiBold : Font.Normal
									font.family: "JetBrainsMono Nerd Font"
								}

								Text {
									Layout.fillWidth: true
									text: perfilLinha.modelData.nota
									color: "#636366"
									font.pixelSize: 10
									font.family: "JetBrainsMono Nerd Font"
									elide: Text.ElideRight
								}
							}
						}
					}
				}
			}
			}
		}
	}

	// ------------------------------------------------------------------
	// Toast
	// ------------------------------------------------------------------
	// Janela SEPARADA da do popup, e nao um modo a mais. Motivo concreto:
	// as duas precisam estar abertas ao mesmo tempo -- o popup de recursos
	// nao pode fechar porque chegou uma notificacao -- e a janela do popup
	// tem um unico `mode` com `height: root.alturaPainel()` e `screen`.
	// Embutir aqui mexeria nos dois.
	PanelWindow {
		id: toastWindow
		visible: root.toasts.length > 0
		screen: root.telaDoCursor
		exclusionMode: ExclusionMode.Ignore
		aboveWindows: true
		// Sem `screen` a janela vai para a tela padrao. A notificacao
		// pode ter vindo de qualquer um, entao centralizar na tela onde
		// o mouse esta e o comportamento menos surpresa.

		anchors {
			top: true
			left: true
			right: true
		}

		margins {
			top: 44
		}

		color: "transparent"
		implicitHeight: toastsCol.implicitHeight + 8

		Column {
			id: toastsCol
			anchors.horizontalCenter: parent.horizontalCenter
			spacing: 8
			width: 340

			Repeater {
				model: root.toasts

				delegate: Item {
					required property var modelData
					required property int index

					width: 340
					// Cartao com fundo solido atras. O DropShadow do
					// painel recortaria: aqui a janela e so do
					// tamanho dos cards, sem folga.
					height: toastCol.implicitHeight + 2

					Rectangle {
						z: -1
						anchors.fill: parent
						radius: 12
						color: "#1C1C1E"
						border.width: 1
						border.color: "#3A3A3C"
					}

					Column {
						id: toastCol
						anchors.left: parent.left
						anchors.right: parent.right
						anchors.top: parent.top
						anchors.margins: 1
						spacing: 2

						// App: pequeno e cinza, como no macOS. Some
						// quando vazio -- nem toda notificacao tem.
						Text {
							width: parent.width
							text: modelData.appName
							visible: text !== ""
							color: "#636366"
							font.pixelSize: 10
							font.family: "JetBrainsMono Nerd Font"
							elide: Text.ElideRight
						}

						Text {
							width: parent.width
							text: modelData.summary
							color: "#F5F5F7"
							font.pixelSize: 13
							font.weight: Font.DemiBold
							font.family: "JetBrainsMono Nerd Font"
							elide: Text.ElideRight
						}

						Text {
							width: parent.width
							text: modelData.body
							visible: text !== ""
							color: "#98989D"
							font.pixelSize: 11
							font.family: "JetBrainsMono Nerd Font"
							maximumLineCount: 2
							elide: Text.ElideRight
						}
					}

					// Clique em qualquer lugar do card abre a lista
					// inteira e joga o toast fora -- e o que o
					// Notification Center faz.
					MouseArea {
						anchors.fill: parent
						cursorShape: Qt.PointingHandCursor
						onClicked: {
							root.toasts = [];
							toastTimer.stop();
							root.openNotifications();
						}
					}
				}
			}
		}
	}
}
