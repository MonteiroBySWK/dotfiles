#!/usr/bin/env bash
# waybar custom module - TLP profile display & cycle
# Feedback imediato: spinner + bloqueio de clique enquanto o TLP aplica o perfil.
# Display: tlp-stat -s (sem root). Toggle: tlpctl se existir, senão sudo -n tlp.

CACHE="/tmp/tlp-status.json"

get_profile() {
  tlp-stat -s 2>/dev/null | awk -F'= ' '/TLP profile/ {print $2}' | tr -d ' '
}

get_source() {
  tlp-stat -s 2>/dev/null | awk -F'= ' '/Power source/ {print $2}' | tr -d ' '
}

status() {
  # estado de transição (troca em andamento) -> spinner
  if [ -f "$CACHE" ]; then
    cat "$CACHE"
    return
  fi
  profile="$(get_profile)"
  source="$(get_source)"
  base="${profile%%/*}"   # "balanced/BAT" -> "balanced"
  case "$base" in
    performance) icon=""; cls="performance" ;;
    balanced)    icon=""; cls="balanced" ;;
    power-saver) icon=""; cls="power-saver" ;;
    *)           icon=""; cls="unknown" ;;
  esac
  printf '{"text":"%s","class":"%s","tooltip":"Perfil: %s\\nFonte: %s"}' \
    "$icon" "$cls" "$profile" "$source"
}

toggle() {
  # bloqueia clique duplo enquanto a troca está em andamento (cache fresco)
  if [ -f "$CACHE" ]; then
    age=$(( $(date +%s) - $(stat -c %Y "$CACHE") ))
    [ "$age" -lt 15 ] && return 0   # ainda trocando
    rm -f "$CACHE"                   # cache velho/órfão -> limpa e continua
  fi

  current="$(get_profile)"; current="${current%%/*}"
  case "$current" in
    power-saver) next="balanced" ;;
    balanced)    next="performance" ;;
    performance) next="power-saver" ;;
    *)           next="balanced" ;;
  esac

  # 1) feedback imediato: spinner + bloqueio
  printf '{"text":"","class":"switching","tooltip":"Trocando para %s..."}' "$next" > "$CACHE"
  pkill -RTMIN+2 waybar

  # 2) aplica o perfil (pode demorar ~2s)
  if command -v tlpctl >/dev/null 2>&1; then
    tlpctl set "$next" >/dev/null 2>&1 || sudo -n tlp "$next" >/dev/null 2>&1
  else
    sudo -n tlp "$next" >/dev/null 2>&1
  fi

  # 3) estado final
  rm -f "$CACHE"
  pkill -RTMIN+2 waybar
}

case "${1:-status}" in
  status) status ;;
  toggle) toggle ;;
esac
