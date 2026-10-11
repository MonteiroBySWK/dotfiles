/*
 * StatBar.qml — barra de recurso no estilo do Activity Monitor do macOS.
 *
 * Componente separado pelo mesmo motivo do MacSlider: o visual ia ser
 * repetido em CPU, memoria, swap e GPU. Repetido, ele diverge — foi o que
 * aconteceu com os sliders.
 *
 * Uso: percent 0-100. A cor muda com o valor, no mesmo spirit da Apple:
 * normal cinza, atenção em amarelo, crítico em vermelho.
 */
import QtQuick

Item {
	id: control

	required property real percent
	property real barHeight: 8
	readonly property color barColor: {
		if (percent >= 90)
			return "#FF453A";
		if (percent >= 70)
			return "#FF9F0A";
		return "#98989D";
	}

	Rectangle {
		anchors.fill: parent
		radius: height / 2
		color: "#3A3A3C"

		Rectangle {
			width: Math.max(0, Math.min(1, control.percent / 100)) * parent.width
			height: parent.height
			radius: height / 2
			color: control.barColor
			// Sem "Behavior on width". A cada leitura (1s) o Repeater e
			// recriado, entao o delegate nasce com width 0 e a animacao o
			// levava de zero ate o valor -- a barra "zera e carrega" a cada
			// segundo, exatamente o que foi relatado. Sem a animacao o
			// delegate ja aparece no valor.
		}
	}
}