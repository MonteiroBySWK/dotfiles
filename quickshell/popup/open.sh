#!/usr/bin/env bash
# Abre um painel do quickshell na posicao do cursor.
#
# O waybar so executa um comando no on-click -- ele nao repassa onde foi
# clicado. A posicao do ponteiro no momento do clique vem do compositor:
# hyprctl cursorpos devolve o cursor, e o compositor sabe onde ele esta
# independentemente de qual elemento foi clicado.
#
# Uso: open.sh <volume|brightness|calendar|resources|notification|battery|power>
set -u

case "${1:-volume}" in
	volume)     FN=showVolume ;;
	brightness) FN=showBrightness ;;
	calendar)   FN=showCalendar ;;
	resources)  FN=showResources ;;
	notification|notifications) FN=showNotifications ;;
	bluetooth)          FN=showBluetooth ;;
	# "battery" e "power" sao apelidos do mesmo painel: o botao na barra
	# mostra a bateria (icone), mas o que se gerencia ali e o perfil de
	# energia. Os dois nomes abrem a mesma coisa.
	battery|power|profile) FN=showBattery ;;
	*)          FN=showVolume ;;
esac

# -99999 e a sentinela de "sem posicao" (o QML centra). -1 nao serve:
# no monitor a esquerda da origem o cursor tem x NEGATIVO, e o QML confundia
# um x=-684 real com "sem argumento" -- por isso os popups abriam centrados
# no monitor externo.
X=-99999
# hyprctl -j cursorpos e o caminho novo; o legado ("x, y") continua valido
# como reserva. Se os dois falharem, X fica -99999 e o popup abre centrado.
if pos=$(hyprctl -j cursorpos 2>/dev/null | python3 -c '
import sys, json
try:
    print(int(json.load(sys.stdin)["x"]))
except Exception:
    pass' 2>/dev/null) && [ -n "$pos" ]; then
	X="$pos"
elif pos=$(hyprctl cursorpos 2>/dev/null | grep -oE '^-?[0-9]+' | head -1); then
	X="$pos"
fi

# Depois da fusao, o handler `control` mora no processo da barra.
# Prefere o config que realmente tem o alvo; cai no popup como fallback.
CFG=popup
if qs -c bar ipc show 2>/dev/null | grep -q "target control"; then
	CFG=bar
fi

exec qs -c "$CFG" ipc call control "$FN" "$X"