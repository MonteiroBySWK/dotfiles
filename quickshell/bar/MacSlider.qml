/*
 * MacSlider.qml — slider no formato do macOS.
 *
 * Existe como componente separado por um motivo concreto: a primeira
 * versao tinha o trilho e o handle escritos inline em cada Slider. Quando
 * ajustei so o de volume, os dois de brilho ficaram com a bola branca
 * gigante do QtQuick.Controls.Basic -- a UI ficou incoerente sem ninguem
 * mexer no codigo. Com um componente so, os tres nao tem como divergir.
 *
 * Substitui o visual do Basic, nao o comportamento: from/to/value e
 * onPressedChanged continuam valendo, e o parents escuta committed no
 * onReleased (arrastar reescrever a cada pixel era o que travava o DDC,
 * que aceita ~4 ops/s).
 */
import QtQuick
import QtQuick.Controls.Basic

Slider {
	id: control

	/* Emitida so no onReleased. */
	signal committed(real v)

	/* Emitida durante o arraste, ja com o valor novo. Quem chama e que
	 * decide se vale a pena escrever -- no DDC nao vale (o barramento I2C
	 * aceita ~4 ops/s), no pactl vale.
	 *
	 * O nome nao pode ser "moved": colide com o signal homonimo das
	 * animacoes do QML, e o proprio Qt avisa
	 * (qt.qml.invalidOverride: Duplicate signal name). */
	signal dragged(real v)

	onValueChanged: {
		if (pressed)
			dragged(control.value);
	}

	onPressedChanged: {
		if (!pressed)
			committed(control.value);
	}

	background: Rectangle {
		x: control.leftPadding
		y: control.topPadding + control.availableHeight / 2 - height / 2
		width: control.availableWidth
		height: 4
		radius: 2
		color: "#3A3A3C"

		// Porcao preenchida. Sem isto o Basic so pinta o trilho todo.
		Rectangle {
			width: control.visualPosition * parent.width
			height: parent.height
			radius: 2
			color: "#F5F5F7"
		}
	}

	handle: Rectangle {
		x: control.leftPadding + control.visualPosition * (control.availableWidth - width)
		y: control.topPadding + control.availableHeight / 2 - height / 2
		width: 14
		height: 14
		radius: 7
		color: control.pressed ? "#E8E8ED" : "#FFFFFF"
	}
}