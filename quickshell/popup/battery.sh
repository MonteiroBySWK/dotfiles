#!/usr/bin/env bash
# Leitura do perfil de energia e da bateria. Devolve JSON.
#
# A logica fica aqui, nao no QML: abrir o painel tem que ser imediato e
# sem fork de um programa que formata tabela. O QML so desenha.
#
# Fontes:
# - sysfs em /sys/class/power_supply -- carga, status, se o carregador
#   esta conectado. Nao precisa de acpi nem poppler, que nenhum dos dois
#   esta instalado nesta maquina.
# - tlp-stat -s -- o perfil. Sem sudo, so leitura.
#
# NADA e escrito aqui -- so leitura. Mudar de perfil e tlp-apply.sh.
set -u

BAT=/sys/class/power_supply/BAT1
AC=/sys/class/power_supply/ACAD

readfile() {
	cat "$1" 2>/dev/null || echo ""
}

cap=$(readfile "$BAT/capacity")
status=$(readfile "$BAT/status")
online=$(readfile "$AC/online")

# tlp-stat traz "performance/AC (manual)". O nome que o painel mostra e
# so a primeira parte: o sufixo e o modo, nao o perfil.
perfil=$(tlp-stat -s 2>/dev/null \
	| awk -F'= ' '/TLP profile/ {print $2}' \
	| tr -d ' ' | cut -d/ -f1)

# "on battery" e o que muda a leitura: com o carregadorplugado, 40% e
# quase nada; na bateria, 40% e comecar a economizar. O painel mostra isso.
# O status do sysfs e confiavel ("Charging"/"Discharging"/"Full"); a
# fonte do TLP e o fallback.
if [ "$online" = "1" ]; then fonte=AC; else fonte=BAT; fi

# O EPP e a letra que o TLP escreve no
# energy_performance_preference -- e o que realmente muda o consumo.
# Nao existe energy_performance_preference em cpu0 nesta maquina AMD; o
# caminho e por policy, e todas as 16 policies respondem igual (AMD agrupa
# os nucleos em policies em vez de um por nucleo). policy0 existe e
# representa o mesmo governor para o painel, entao le-se de la.
epp=$(cat /sys/devices/system/cpu/cpufreq/policy0/energy_performance_preference 2>/dev/null)
[ -n "$epp" ] || epp="desconhecido"

# Perfis aceitos pelo TLP 1.10. Confirmado em `tlp` sem argumentos, que
# lista os pares: performance|ac, balanced|bat, power-saver|usb.

perfis='[{"id":"performance","nome":"Performance","nota":"sem economia, usa mais bateria"},
{"id":"balanced","nome":"Equilibrado","nota":"o meio-termo"},
{"id":"power-saver","nome":"Economia","nota":"menos desempenho, dura mais na bateria"}]'

printf '{'
printf '"carga": %s, ' "${cap:-0}"
printf '"status": "%s", ' "${status:-Unknown}"
printf '"fonte": "%s", ' "$fonte"
printf '"perfil": "%s", ' "${perfil:-desconhecido}"
printf '"epp": "%s", ' "$epp"
printf '"perfis": %s' "$perfis"
printf '}\n'