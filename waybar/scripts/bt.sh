#!/usr/bin/env bash
# Icone do bluetooth na barra. Abre o painel no clique.
#
# As classes sao bt-on/bt-off, e nao on/off. O style.css usa .on e .off
# em #custom-nightlight: nome sem prefixo funciona ate o dia em que
# alguem escreve uma regra solta e os dois modulos mudam de cor juntos.
#
# Nao spawna processo a toa hora: o script so chama `bluetoothctl devices
# Connected`, que mede 4 ms. O icone muda com a contagem, e nao com um
# booleano, porque assim da para ver dois fones connected ao mesmo tempo
# sem abrir nada.
set -u

# nf-md-bluetooth. O codigo foi conferido na cheat sheet do
# nerd-fonts, e nao suposto pelo nome.
GLIFO=$'\uf293'

conectados=$(bluetoothctl devices Connected 2>/dev/null | grep -c '^Device' || true)
[ "$conectados" -gt 0 ] || conectados=0

if [ "$conectados" -eq 0 ]; then
	# Nenhum aparelho ligado: cinza, e sem numero.
	printf '{"text":"%s","class":"bt-off"}\n' "$GLIFO"
elif [ "$conectados" -eq 1 ]; then
	printf '{"text":"%s 1","class":"bt-on"}\n' "$GLIFO"
else
	printf '{"text":"%s %s","class":"bt-on"}\n' "$GLIFO" "$conectados"
fi