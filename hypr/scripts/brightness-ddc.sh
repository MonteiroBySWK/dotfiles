#!/usr/bin/env bash
# brightness-ddc.sh up|down [step_pct]
# Ajusta o brilho de monitores externos via DDC/CI (ddcutil).
# Roda desacoplado (setsid) — o keybind do Hyprland mata o grupo de
# processos quando o comando principal termina; uma nova sessão sobrevive.
# Usa valores ABSOLUTOS calculados (incremento relativo "+1" foi instável
# no Samsung LS24F32xG).
set -euo pipefail

dir="${1:-up}"
step_pct="${2:-5}"

# Serializa execuções: binds com repeating=true disparam em paralelo e o
# I2C só aguenta ~2-3 operações/s. Quem não pega o lock sai — o passo alto
# (10%) compensa os descartes.
exec 9>/tmp/brightness-ddc.lock
flock -n 9 || exit 0

DISP_CACHE=/tmp/brightness-ddc-display
if [ -s "$DISP_CACHE" ]; then
  d=$(cat "$DISP_CACHE")
else
  d=$(ddcutil detect --terse 2>/dev/null | awk '/^Display /{print $2}' | head -1)
  [ -n "$d" ] && echo "$d" > "$DISP_CACHE"
fi
[ -n "${d:-}" ] || exit 0

# Formato terse do getvcp: "VCP 10 C <cur> <max>" → campos 4 e 5
vcp=$(ddcutil --display "$d" --sleep-multiplier 0.05 getvcp 10 --terse 2>/dev/null) || exit 0
cur=$(echo "$vcp" | awk '{print $4}')
max=$(echo "$vcp" | awk '{print $5}')
[ -n "$cur" ] || exit 0

# Arredonda para CIMA para o passo ser perceptível (2.5 → 3)
step=$(( (max * step_pct + 99) / 100 ))
[ "$step" -lt 1 ] && step=1
if [ "$dir" = "up" ]; then
  new=$(( cur + step ))
  [ "$new" -gt "$max" ] && new=$max
else
  new=$(( cur - step ))
  [ "$new" -lt 1 ] && new=1
fi

[ "$new" -ne "$cur" ] && ddcutil --display "$d" --sleep-multiplier 0.05 setvcp 10 "$new" 2>/dev/null || true
