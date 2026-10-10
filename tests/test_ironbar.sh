#!/usr/bin/env bash
# tests/test_ironbar.sh — verificacao estatica da config do ironbar.
# Nao sobe o ironbar: ele precisa de $WAYLAND_DISPLAY e abriria uma
# segunda barra. Assim como tests/run.sh faz com o waybar.
set -uo pipefail
cd "$(dirname "$0")/.." || exit 1

fail=0
ok()   { printf 'ok   - %s\n' "$1"; }
bad()  { printf 'FAIL - %s  [%s]\n' "$1" "${2:-}"; fail=1; }

CFG=ironbar/config.toml

[[ -f "$CFG" ]] || { bad "config.toml existe" "nao encontrado"; exit 1; }
ok "config.toml existe"

# --- sintaxe TOML ---
if command -v python3 >/dev/null && python3 -c 'import tomllib' 2>/dev/null; then
  if python3 - "$CFG" <<'PY'
import sys, tomllib
try:
    tomllib.load(open(sys.argv[1], 'rb'))
except Exception as e:
    print(e, file=sys.stderr)
    sys.exit(1)
PY
  then ok "TOML valido"
  else bad "TOML valido" "erro de parse"; fi
else
  bad "TOML valido" "python3 sem tomllib"
fi

# --- modulos: o ironbar rejeita nome invalido com "unknown variant" ---
# Lista tirada da propria mensagem de erro do ironbar 0.19.1, nao de
# memoria -- e a unica fonte autoritativa do que ele aceita.
validos="battery,bindmode,bluetooth,brightness,cairo,clipboard,clock,custom,focused,inhibit,keyboard,label,launcher,menu,music,network_manager,notifications,script,sys_info,tray,volume,workspaces"

declare -A usados=()
while read -r tipo; do [[ -n "$tipo" ]] && usados[$tipo]=1; done < <(grep -oE '^type = "[a-z_]+"' "$CFG" | sed 's/type = "//; s/"//')

for t in "${!usados[@]}"; do
  if [[ ",$validos," == *",$t,"* ]]; then
    ok "modulo existe: $t"
  else
    bad "modulo existe: $t" "nao esta na lista do ironbar"
  fi
done

# --- posicao da barra ---
# O default do ironbar e position = "bottom". Sem isto a barra abre embaixo
# e o "layer = top" da ilusao de estar em cima -- sao coisas diferentes:
# layer e a camada do compositor, position e onde na tela.
grep -qE '^position = "top"' "$CFG" \
  && ok "barra no topo da tela" \
  || bad "barra no topo da tela" 'position nao esta "top"'

# --- orientacao do popup: e o que faz parecer macOS ---
# popup_orientation default e "horizontal" (tudo lado a lado). "vertical"
# empilha os blocos, como a lista do Control Center.
grep -qE '^popup_orientation = "vertical"' "$CFG" \
  && ok "popup empilha os blocos (estilo Control Center)" \
  || bad "popup empilha os blocos (estilo Control Center)" 'popup_orientation nao esta "vertical"'

# slider deitado: o do Control Center do macOS e horizontal. O vertical e o
# HUD antigo, pre-Sonoma.
grep -qE '^sink_slider_orientation = "horizontal"' "$CFG" \
  && ok "slider do volume deitado (como o macOS)" \
  || bad "slider do volume deitado (como o macOS)" 'sink_slider_orientation nao esta "horizontal"'

# --- bateria: "{icon}" sai LITERAL na barra ---
# O modulo battery do ironbar 0.19 so reconhece {percentage}, {state} e
# {time_remaining}. O icone vem de show_icon, estilizavel em .battery .icon.
# O bloco inteiro e extraido: com -A3 o teste quebrava sozinho assim que
# entrou um comentario entre type = e format. E o volume usa {icon} de
# verdade, entao a busca precisa ficar escopada na bateria.
sed -n '/type = "battery"/,/^\[\[/p' "$CFG" | grep -q '{icon}' \
  && bad "bateria sem placeholder {icon}" '"{icon}" no format da bateria sai literal' \
  || ok "bateria sem placeholder {icon}"

# --- workspaces clicaveis: o motivo da migracao ---
grep -q 'type = "workspaces"' "$CFG" && ok "tem workspaces" || bad "tem workspaces"
# all_monitors = false mostraria so os workspaces do monitor da barra, e o
# seu estao divididos entre HDMI-A-1 e eDP-1.
grep -qE '^all_monitors = true' "$CFG" \
  && ok "workspaces ve os dois monitores" \
  || bad "workspaces ve os dois monitores" "all_monitors nao esta true"

# --- popup de volume: sliders e seletor de aparelho ---
grep -q 'sink_slider_orientation' "$CFG" \
  && ok "popup de volume com slider vertical" \
  || bad "popup de volume com slider vertical"
grep -qE '^max_volume = 120' "$CFG" \
  && ok "volume ate 120%" || bad "volume ate 120%"

# --- o waybar nao pode ter sido apagado ---
[[ -f waybar/config.jsonc ]] && ok "waybar/config.jsonc preservado" \
                           || bad "waybar/config.jsonc preservado" "sumiu"
[[ -f waybar/style.css ]]    && ok "waybar/style.css preservado" \
                           || bad "waybar/style.css preservado" "sumiu"

echo
if [[ "$fail" -ne 0 ]]; then echo "FALHOU"; exit 1; fi
echo "OK"