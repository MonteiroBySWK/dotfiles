#!/usr/bin/env bash
# Alterna a barra visivel entre quickshell e waybar (comparacao / rollback).
#
# A barra do quickshell so e escondida: o processo continua rodando e
# segurando as notificacoes e os popups. A waybar e morta/iniciada de
# verdade, porque ela nao tem um "hide" via IPC.
set -u

if pgrep -x waybar >/dev/null 2>&1; then
	pkill -x waybar
	qs -c bar ipc call bar show >/dev/null 2>&1
else
	qs -c bar ipc call bar hide >/dev/null 2>&1
	setsid -f waybar
fi
