#!/usr/bin/env bash
# Testa quickshell/popup/shell.qml: sintaxe real + os tokens do macOS.
set -u
CFG="$(dirname "$0")/../quickshell/popup/shell.qml"
fails=0

ok()   { echo "ok   - $1"; }
bad()  { echo "FAIL - $1  [$2]"; fails=1; }

# --- sintaxe ---
# qmllint e o validador do proprio Qt. Sem ele, um erro de QML so aparece
# quando o popup e aberto -- e o popup abre por clique, entao o sintoma
# chega tarde e sem mensagem.
if command -v qmllint >/dev/null 2>&1; then
  out=$(qmllint "$CFG" 2>&1)
  # Imports de Quickshell nao resolvem fora do runtime, entao avisos de
  # "module not installed" sao esperados e nao contam como erro.
  erros=$(printf '%s\n' "$out" | grep -iE '^.*(error|Error):' | grep -viE 'was not installed|import' | head -5)
  if [ -z "$erros" ]; then
    ok "shell.qml passa no qmllint"
  else
    bad "shell.qml passa no qmllint" "$(printf '%s' "$erros" | head -1)"
  fi
else
  echo "pula - qmllint ausente, sintaxe nao verificada"
fi

# --- paleta do macOS, nao Catppuccin ---
# O popup nasceu com a paleta Catppuccin (#1e1e2e, #313244, #cdd6f4), que
# nao e a do macOS. Tokens do modo escuro da Apple:
#   superficie #1C1C1E   texto #F5F5F7   secundario #98989D
#   terciario  #636366   acento  #0A84FF
for cor in 1C1C1E F5F5F7 98989D; do
  grep -qi "#$cor" "$CFG" \
    && ok "token do macOS #$cor presente" \
    || bad "token do macOS #$cor presente" "nao encontrado no shell.qml"
done

catppuccin=$(grep -coE '#(1e1e2e|313244|cdd6f4|a6adc8|6c7086|f38ba8)' "$CFG")
if [ "$catppuccin" -eq 0 ]; then
  ok "nenhuma cor Catppuccin sobrando"
else
  bad "nenhuma cor Catppuccin sobrando" "$catppuccin ocorrencia(s)"
fi

# --- sombra ---
# Sem a sombra o popup fica colado na janela e nao tem cara de material.
grep -q 'DropShadow' "$CFG" \
  && ok "popup tem DropShadow" \
  || bad "popup tem DropShadow" "DropShadow ausente"

# --- as duas barras de brilho ---
# O monitor externo so aparece se o DDC responder. Desligado, ela some em
# vez de mostrar 0%, que seria mentira.
grep -q 'ddcAvailable' "$CFG" \
  && ok "brilho do monitor externo (DDC) condicional" \
  || bad "brilho do monitor externo (DDC) condicional" "ddcAvailable ausente"

[ "$fails" -eq 0 ] || exit 1