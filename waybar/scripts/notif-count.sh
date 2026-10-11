#!/usr/bin/env bash
# Icone de notificacao na barra. Abre o painel do quickshell no clique.
#
# NAO conta nada: o historico mora no processo do quickshell, e nao ha um
# IPC para consultar a contagem. Entao o icone e estatico e o que muda e o
# clique. Preferi um botao honesto a um numero que mente.
set -u

# U+EAA2 e o "bell" do Material Design. Antes era U+F0A3, que a cheat
# sheet mostra ser fa-certificate -- um selo, nao um sino. Os glifos U+F0Ax
# da faixa Font Awesome nao sao o que o nome sugere; conferi na
# nerd-fonts/glyphnames.json em vez de supor.
export ICON=$'\ueaa2'

printf '{"text":"%s","class":"normal","tooltip":"notificacoes"}\n' "$ICON"
