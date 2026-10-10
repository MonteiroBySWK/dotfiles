#!/usr/bin/env bash
# Menu de redes WiFi para o módulo network da waybar.
#
# Substitui o nmtui, que era aberto no clique do ícone de rede.
# Roda sob demanda (é alvo de on-click, não módulo custom), então não usa
# cache em /tmp, nem saída JSON, nem sinal RTMIN para recarregar a barra.
set -uo pipefail

# nmcli device menu não existe no NetworkManager 1.58, que tem nm-applet e
# nmtui como as únicas interfaces. A lista é montada aqui e a conexão é
# feita direto com nmcli device wifi connect.
#
# WAYBAR_WIFI_NO_RESCAN=1 pula o --rescan, que é a parte lenta (~3s).
rescan="--rescan yes"
[ "${WAYBAR_WIFI_NO_RESCAN:-0}" = "1" ] && rescan=""

list=$(nmcli -t -f SSID,SIGNAL,SECURITY device wifi list $rescan 2>/dev/null) || exit 0
[ -z "$list" ] && exit 0

active=$(nmcli -t -f ACTIVE,SSID device wifi 2>/dev/null \
  | awk -F: '$1 == "yes" { print $2; exit }')

# Mantém a ordem do nmcli (por sinal) e marca a ativa com ">".
# Redes ocultas têm SSID vazio e ficam de fora.
menu=$(printf '%s\n' "$list" | awk -F: -v active="$active" '
  NF >= 2 && $1 != "" {
    mark = ($1 == active) ? "> " : "  "
    printf "%s%s (%s%%)\n", mark, $1, $2
  }')

# Nenhuma rede visível (desligadas, sem permissão, ou em outro plano):
# sai sem abrir wofi, em vez de deixar um menu vazio na tela.
[ -z "$menu" ] && exit 0

choice=$(printf '%s\n' "$menu" | wofi --show dmenu --prompt "WiFi" --hide-input)
[ -z "${choice:-}" ] && exit 0

# Desfaz a marcação e o "(NN%)" do final para recuperar o SSID exato.
ssid=$(printf '%s' "$choice" | sed -E 's/^>[[:space:]]?//; s/^[[:space:]]+//; s/[[:space:]]+\([0-9]+%\)$//')
[ -z "$ssid" ] && exit 0

iface=$(nmcli -t -f DEVICE,TYPE device status 2>/dev/null \
  | awk -F: '$2 == "wifi" { print $1; exit }')

if [ "$ssid" = "$active" ]; then
  [ -n "$iface" ] && nmcli device disconnect "$iface" >/dev/null 2>&1
else
  [ -n "$iface" ] && nmcli device wifi connect "$ssid" ifname "$iface" >/dev/null 2>&1
fi