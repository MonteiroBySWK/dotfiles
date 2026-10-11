/*
 * StatBar.qml — barra de recurso no estilo do Activity Monitor do macOS.
 *
 * Componente separado pelo mesmo motivo do MacSlider: o visual ia ser
 * repetido em CPU, memoria, swap e GPU. Repetido, ele diverge — foi o que
 * aconteceu com os sliders.
 *
 * A animacao aqui e possivel porque o painel de recursos alimenta as
 * linhas por ListModel e atualiza os valores no lugar. Com um array como
 * model, o Repeater recriava o delegate a cada leitura e a barra nascia
 * com width 0 — ai a animacao era justamente o defeito ("zera e
 * carrega" a cada segundo).
 *
 * Uso: percent 0-100. A cor muda com o valor, no spirit da Apple:
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
			id: fill
			width: Math.max(0, Math.min(1, control.percent / 100)) * parent.width
			height: parent.height
			radius: height / 2
			color: control.barColor

			// Suavizar a largura mostra a tendencia: um salto de 12% para
			// 70% fica legivel como movimento. Sem isto o olho ve um
			// recorte seco e nao sabe o que mudou.
			Behavior on width {
				NumberAnimation {
					duration: 380
					easing.type: Easing.OutCubic
				}
			}

			// A cor tambem transiciona, para a mudanca de estado (cinza ->
			// amarelo -> vermelho) nao ser um corte seco.
			Behavior on color {
				ColorAnimation {
					duration: 380
				}
			}
		}
	}
}