#!/usr/bin/env bash
# Dispara a busca de dispositivos bluetooth por alguns segundos.
#
# POR QUE ISTO E UM SCRIPT E NAO UMA CHAMADA NO QML:
# o modulo Bluetooth do quickshell expoe o adaptador com `discovering`
# somente para LEITURA. Gravar nele nao faz nada -- medido, o valor volta
# como estava. E o proprio BlueZ recusa a busca enquanto o radio esta
# desligado, com org.bluez.Error.NotReady. Logo a busca e um comando
# bloqueante de fora, e a logica fica no QML.
#
# O script so inicia a busca e sai depois que o tempo acaba. Os
# dispositivos novos NAO chegam por aqui: o modulo do quickshell os ve
# pelo BlueZ direto, entao este processo nao devolve JSON.
set -u

SEGUNDOS="${1:-12}"

# Radio desligado: o BlueZ devolve NotReady e nao ha busca possivel.
if ! bluetoothctl show 2>/dev/null | grep -q 'Powered: yes'; then
	exit 1
fi

bluetoothctl --timeout "$SEGUNDOS" scan on >/dev/null 2>&1
exit 0