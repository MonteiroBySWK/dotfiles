#!/usr/bin/env bash
# Liga/desliga o QUICKSHELL (barra + popups + notificacoes).
# A waybar nao e tocada: ela fica como estiver, para comparar as duas.
#
# Ao matar o processo, o servidor de notificacoes cai junto (o quickshell
# e o dono de org.freedesktop.Notifications). Ao levantar de novo, ele
# reassume. O backend software e o mesmo do autostart.
set -u

if pgrep -f '^qs -c bar$' >/dev/null 2>&1; then
	pkill -f '^qs -c bar$'
else
	setsid -f env QT_QUICK_BACKEND=software qs -c bar >/dev/null 2>&1
fi
