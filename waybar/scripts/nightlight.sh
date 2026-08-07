#!/usr/bin/env bash
# nightlight.sh — controla o modo noturno (hyprsunset) para a waybar
# Uso: nightlight.sh {status|toggle}

set -euo pipefail

# ícones Nerd Font: U+F185 (sun) / U+F186 (moon)
SUN=$'\uf185'
MOON=$'\uf186'

SIGNAL="RTMIN+3"
TEMP=3500

is_running() { pgrep -x hyprsunset >/dev/null; }

status() {
  if is_running; then
    printf '{"text":"%s","class":"on","tooltip":"Modo noturno: ativo (%sK)"}' "$MOON" "$TEMP"
  else
    printf '{"text":"%s","class":"off","tooltip":"Modo noturno: inativo"}' "$SUN"
  fi
}

toggle() {
  if is_running; then
    pkill -x hyprsunset
  else
    setsid hyprsunset -t "$TEMP" >/dev/null 2>&1 &
  fi
  # notifica a waybar para atualizar o ícone
  pkill -"$SIGNAL" waybar 2>/dev/null || true
}

# modo idempotente para automação (timer do hyprland.lua)
set() {
  case "$1" in
    on)
      if ! is_running; then
        setsid hyprsunset -t "$TEMP" >/dev/null 2>&1 &
      fi
      ;;
    off)
      pkill -x hyprsunset 2>/dev/null || true
      ;;
    *)
      echo "uso: $0 set {on|off}" >&2; exit 1
      ;;
  esac
  pkill -"$SIGNAL" waybar 2>/dev/null || true
}

case "${1:-status}" in
  status) status ;;
  toggle) toggle ;;
  set) set "${2:-}" ;;
  *) echo "uso: $0 {status|toggle|set on|set off}" >&2; exit 1 ;;
esac
