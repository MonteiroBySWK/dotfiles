import QtQuick

// Chave no estilo do macOS, para o painel.
//
// E um componente separado porque o desenho e o mesmo em mais de um
// lugar, e porque a animacao do botão precisa ficar com ele: se o
// Behavior morar no painel, cada uso repete as mesmas quatro linhas e um
// deles esquece.
//
// A chave e so do desenho. Quem decide o que acontece no clique e o
// de fora, pelo sinal toggled. Assim nao ha estado duplicado: a chave
// mostra `ligado`, e nao guarda um copies que pode divergir.
Item {
	id: raiz

	// Estado mostrado. Recebido de fora, nunca guardado aqui.
	property bool ligado: false
	property bool enabled: true

	// Sinalizado, nao aplicado: quem sabe o que acontece no clique e o
	// painel. A chave nao escreve em `ligado` sozinha.
	signal toggled()

	implicitWidth: 38
	implicitHeight: 22

	opacity: enabled ? 1 : 0.4

	Rectangle {
		id: trilho
		anchors.fill: parent
		radius: height / 2
		color: raiz.ligado ? "#34C759" : "#3A3A3C"

		Behavior on color {
			ColorAnimation { duration: 180; easing.type: Easing.OutCubic }
		}
	}

	Rectangle {
		id: botao
		width: 18
		height: 18
		radius: 9
		color: "#FFFFFF"

		// Off fica em x=2, on em x=18: 38 - 18 - 2. A conta esta aqui
		// porque escrever o numero solto e o que faz a chave "pular" quando
		// o componente ganha de largura.
		x: raiz.ligado ? raiz.width - width - 2 : 2
		y: (raiz.height - height) / 2

		Behavior on x {
			NumberAnimation { duration: 180; easing.type: Easing.OutCubic }
		}
	}

	MouseArea {
		anchors.fill: parent
		enabled: raiz.enabled
		cursorShape: Qt.PointingHandCursor
		onClicked: raiz.toggled()
	}
}