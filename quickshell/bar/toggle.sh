#!/usr/bin/env bash
# Liga/desliga a waybar para comparar com a barra do quickshell.
#
# O quickshell NUNCA e escondido nem morto aqui: ele segura as notificacoes
# e os popups, e a comparacao lado a lado precisa das duas barras visiveis.
# Se um dia quiser esconder a barra do quickshell, use:
#   qs -c bar ipc call bar hide
set -u

if pgrep -x waybar >/dev/null 2>&1; then
	pkill -x waybar
else
	# Garante a barra do quickshell visivel (pode ter sido escondida antes).
	qs -c bar ipc call bar showBar >/dev/null 2>&1
	setsid -f waybar >/dev/null 2>&1
fi
