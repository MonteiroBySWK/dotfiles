#!/usr/bin/env bash
# Abre um painel do quickshell na posicao do cursor.
#
# O waybar so executa um comando no on-click -- ele nao repassa onde foi
# clicado. A posicao do ponteiro no momento do clique vem do compositor:
# hyprctl cursorpos devolve o cursor, e o compositor sabe onde ele esta
# independentemente de qual elemento foi clicado.
#
# Uso: open.sh <volume|brightness|calendar|resources|notification>
set -u

case "${1:-volume}" in
	volume)     FN=showVolume ;;
	brightness) FN=showBrightness ;;
	calendar)   FN=showCalendar ;;
	resources)  FN=showResources ;;
	notification|notifications) FN=showNotifications ;;
	*)          FN=showVolume ;;
esac

X=-1
# hyprctl -j cursorpos e o caminho novo; o legado ("x, y") continua valido
# como reserva. Se os dois falharem, X fica -1 e o popup abre centrado.
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

exec qs -c popup ipc call control "$FN" "$X"