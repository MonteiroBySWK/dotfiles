#!/usr/bin/env bash
# brightness.sh up|down [step_pct] [quiet]
# Ajusta o brilho do painel interno (brightnessctl, instantâneo) e de
# monitores externos via DDC/CI (brightness-ddc.sh, desacoplado com setsid).
#
# Feedback (painel + notificação) NUNCA espera o DDC. O monitor externo roda
# em sessão própria (setsid) para sobreviver ao kill do grupo de processos
# que o keybind do Hyprland faz ao terminar.
set -euo pipefail

dir="${1:-up}"
step_pct="${2:-5}"
quiet="${3:-}"

# brightnessctl aceita "5%+" / "5%-" — sufixos "up"/"down" seriam ignorados
# (e tratados como valor absoluto 5%!)
case "$dir" in
  up)   sign="+" ;;
  down) sign="-" ;;
  *)    exit 1 ;;
esac

# 1) Painel interno (laptop) — imediato, ~10ms
brightnessctl set "${step_pct}%${sign}" -q 2>/dev/null || true

# 2) Notificação imediata — não espera o DDC
if [ -z "$quiet" ]; then
  pct=$(brightnessctl i 2>/dev/null | grep -oP '\(\K\d+(?=%)' || echo 100)
  notify-send -h string:x-canonical-private-synchronous:brightness -h int:value:"$pct" "Brilho" -t 1500 >/dev/null 2>&1 || true
fi

# 3) Monitor externo — sessão nova (setsid), imune a kill do grupo do bind.
#    Passo do DDC: mínimo 10% do range por operação. O I2C só aguenta
#    ~3 ops/s e o flock descarta o resto — passo pequeno (scroll 1% → 2%)
#    deixaria o monitor quase parado. 10% = ~30%/s no scroll, perceptível.
if command -v ddcutil >/dev/null 2>&1; then
  ddc_pct=$((step_pct * 2))
  [ "$ddc_pct" -lt 10 ] && ddc_pct=10
  setsid /home/monteiro/.config/hypr/scripts/brightness-ddc.sh "$dir" "$ddc_pct" \
    </dev/null >/dev/null 2>&1 &
fi
