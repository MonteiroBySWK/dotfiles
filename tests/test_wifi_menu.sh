# tests/test_wifi_menu.sh
# Prova o parsing do wifi-menu.sh com nmcli e wofi falsos.
# Uso: bash tests/test_wifi_menu.sh
set -uo pipefail
cd "$(dirname "$0")/.." || exit 1

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

cat > "$tmp/nmcli" <<'EOF'
#!/usr/bin/env bash
args="$*"
case "$args" in
  *"device wifi list"*) printf '%b' "$FAKE_LIST" ;;
  *"ACTIVE,SSID"*) if [ -n "$FAKE_ACTIVE" ]; then echo "yes:$FAKE_ACTIVE"; else echo "no:"; fi ;;
  *"DEVICE,TYPE"*) if [ -n "$FAKE_IFACE" ]; then echo "$FAKE_IFACE:wifi"; else echo "lo:wired"; fi ;;
  *"device wifi connect"*|*"device disconnect"*) echo "ACTION|$args" >> "$FAKE_LOG" ;;
  *) : ;;
esac
EOF
cat > "$tmp/wofi" <<'EOF'
#!/usr/bin/env bash
if [ -n "${FAKE_PICK:-}" ]; then line=$(grep -F -- "$FAKE_PICK" | head -1); else line=$(head -1); fi
printf '%s\n' "$line"
EOF
chmod +x "$tmp/nmcli" "$tmp/wofi"

export PATH="$tmp:$PATH" WAYBAR_WIFI_NO_RESCAN=1 FAKE_LOG="$tmp/log"

fail=0
check() {
  if [ "$2" = "$3" ]; then echo "ok   - $1"
  else echo "FAIL - $1"; echo "         esperado: $3"; echo "         obtido:   $2"; fail=1; fi
}

# roda o script com uma lista e uma escolha, e imprime a acao registrada
run() {
  : > "$FAKE_LOG"
  FAKE_LIST="$1" FAKE_ACTIVE="$2" FAKE_PICK="$3" FAKE_IFACE="$4" \
    bash waybar/scripts/wifi-menu.sh >/dev/null 2>&1
  echo "exit=$?"; cat "$FAKE_LOG"
}

# --- SSID com dois-pontos: o nmcli escapa como \: ---
out=$(run 'RedeCom\\:DoisPontos:80:WPA2\nNormal:100:WPA2\n' '' 'RedeCom:DoisPontos' wlan0)
check "ssid com ':' conecta com o nome inteiro" \
  "$(printf '%s' "$out" | grep -c 'ACTION|device wifi connect RedeCom:DoisPontos ifname wlan0')" "1"

# --- SSID com espaco ---
out=$(run 'Rede Com Espaco:70:WPA2\n' '' 'Rede Com Espaco' wlan0)
check "ssid com espaco sobrevive" \
  "$(printf '%s' "$out" | grep -c 'ACTION|device wifi connect Rede Com Espaco ifname wlan0')" "1"

# --- SSID que contem parenteses e porcento ---
out=$(run 'Party (50%):55:WPA2\n' '' 'Party (50%)' wlan0)
check "ssid com (50%) sobrevive" \
  "$(printf '%s' "$out" | grep -c 'ACTION|device wifi connect Party (50%) ifname wlan0')" "1"

# --- rede oculta (ssid vazio) nao aparece no menu ---
out=$(run ':70:WPA2\nNormal:100:WPA2\n' '' 'Normal' wlan0)
check "ssid vazio e omitido" \
  "$(printf '%s' "$out" | grep -c '^  (')" "0"

# --- escolher a ativa desconecta ---
out=$(run 'Normal:100:WPA2\nOutra:60:WPA2\n' 'Normal' 'Normal' wlan0)
check "escolher a ativa desconecta" \
  "$(printf '%s' "$out" | grep -c 'ACTION|device disconnect wlan0')" "1"

# --- sem interface wifi: exit 0 e nenhuma acao ---
out=$(run 'Normal:100:WPA2\n' '' 'Normal' '')
check "sem interface wifi: exit 0" "$(printf '%s' "$out" | head -1)" "exit=0"
check "sem interface wifi: nenhuma acao" "$(printf '%s' "$out" | grep -c ACTION)" "0"

# --- lista vazia: exit 0, sem abrir wofi ---
: > "$FAKE_LOG"
FAKE_LIST="" FAKE_ACTIVE="" FAKE_PICK="" FAKE_IFACE=wlan0 \
  timeout 5 bash waybar/scripts/wifi-menu.sh >/dev/null 2>&1
check "lista vazia: exit 0" "$?" "0"
check "lista vazia: nenhuma acao" "$(grep -c ACTION "$FAKE_LOG")" "0"

echo
if [ "$fail" -ne 0 ]; then echo "FALHOU"; exit 1; fi
echo "OK"