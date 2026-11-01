import QtQuick

/*
 * BarModule.qml — slot de um item da barra
 *
 * Area minima de 22px (referencia: menu bar extras da Apple usam ~22pt),
 * conteudo centrado e hover discreto. Existe como arquivo separado porque
 * o componente inline dentro do shell.qml era rejeitado como "not a type"
 * nesta versao do quickshell.
 */
Item {
	id: mod

	default property alias content: moduleRow.data
	property bool hovered: false
	property color hoverColor: "#26FFFFFF"

	signal clicked(var mouse)
	signal wheeled(var wheel)

	// 12px de folga interna (6 de cada lado). Com 8px entre modulos, o
	// respiro visual entre conteudos fica ~20px, igual ao da waybar
	// (margin 0 6px + padding 0 4px de cada modulo).
	implicitWidth: Math.max(28, moduleRow.implicitWidth + 12)
	implicitHeight: 20

	Rectangle {
		anchors.fill: parent
		radius: 4
		color: mod.hovered ? mod.hoverColor : "transparent"
	}

	Row {
		id: moduleRow
		anchors.centerIn: parent
		spacing: 4
	}

	MouseArea {
		anchors.fill: parent
		hoverEnabled: true
		cursorShape: Qt.PointingHandCursor
		acceptedButtons: Qt.LeftButton | Qt.RightButton
		onEntered: mod.hovered = true
		onExited: mod.hovered = false
		onClicked: (mouse) => mod.clicked(mouse)
		onWheel: (wheel) => mod.wheeled(wheel)
	}
}
