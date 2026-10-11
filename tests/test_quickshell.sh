#!/usr/bin/env bash
# Testa quickshell/popup/shell.qml: sintaxe real + os tokens do macOS.
set -u
CFG="$(dirname "$0")/../quickshell/popup/shell.qml"
DIR="$(dirname "$CFG")"
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
# --- os tres sliders usam o componente ---
# A primeira versao escrevia o visual do slider inline em cada Slider. Ao
# ajustar so o de volume, os dois de brilho ficaram com a bola branca
# gigante do Basic -- a UI divergiu sem ninguem tocar no codigo. Este teste
# existe para pegar esse tipo de drift: qualquer Slider cru no shell.qml
# reintroduz o estilo padrao.
cru=$(grep -cE '^[[:space:]]*Slider[[:space:]]*\{' "$CFG")
if [ "$cru" -eq 0 ]; then
  ok "nenhum Slider cru (todos via MacSlider)"
else
  bad "nenhum Slider cru (todos via MacSlider)" "$cru Slider(s) com visual inline"
fi

[ ! -f "$(dirname "$CFG")/MacSlider.qml" ] && bad "MacSlider.qml existe" "arquivo ausente"
[ -f "$(dirname "$CFG")/MacSlider.qml" ] && ok "MacSlider.qml existe"

# --- o numero do "%" tem de acompanhar o slider ---
# Os tres processos de escrita usavam startDetached(), que nao e rastreado
# e por isso nao tem onExited. Sem reler depois de escrever, root.volume
# ficava congelado no valor da leitura inicial: o slider mexia e o "%" nao.
# O sintoma e silencioso -- so se nota arrastando.
# O startDetached e erro SO nos processos que escrevem valor: sem onExited
# nao ha releitura e o "%" congela. No openPavu ele esta correto -- o
# pavucontrol e um app grafico, nao um comando que devolva estado -- entao a
# busca ignora aquele bloco.
if grep -B4 'startDetached' "$CFG" | grep -q 'openPavu'; then
  ok "openPavu segue detached (app grafico, nao devolve estado)"
else
  bad "openPavu segue detached (app grafico, nao devolve estado)" "estado incerto"
fi

if grep -A6 'id: write' "$CFG" | grep -q 'startDetached'; then
  bad "processos de escrita sao rastreados (releitura no onExited)" "startDetached em processo de escrita"
else
  ok "processos de escrita sao rastreados (releitura no onExited)"
fi

# --- lista de aparelhos ---
# O script entrega os sinks e sources; sem ele o popup abre vazio e sem
# aviso nenhum, que foi como o bug do caminho relativo apareceu.
if [ -x "$DIR/list-devices.sh" ]; then
  ok "list-devices.sh existe e e executavel"
else
  bad "list-devices.sh existe e e executavel" "ausente ou sem bit de execucao"
fi

saida=$("$DIR/list-devices.sh" 2>/dev/null)
if printf '%s' "$saida" | python3 -c '
import json,sys
d=json.load(sys.stdin)
assert "sinks" in d and "sources" in d and "micInUse" in d
for s in d["sinks"]+d["sources"]:
    for k in ("name","label","volume","muted","default","running","kind"):
        assert k in s, "faltando %s" % k
' 2>/dev/null; then
  ok "list-devices.sh devolve JSON com os campos esperados"
else
  bad "list-devices.sh devolve JSON com os campos esperados" "JSON invalido ou incompleto"
fi

# .monitor nao e microfone que a pessoa escolhe; se vazar, a linha do mic
# mostra um dispositivo que nao existe.
if printf '%s' "$saida" | grep -q '\.monitor'; then
  bad "sources .monitor filtrados" "um monitor de entrada vazou para a lista"
else
  ok "sources .monitor filtrados"
fi

# --- pactl, e nao wpctl, para escrever por nome ---
# O wpctl quer NUMERO de objeto. Com nome ele falha:
#   Error: 'bluez_output.01_92_25_21_0D_0D.1' is not a valid number
# e o clique no nome do aparelho nao fazia nada, silenciosamente.
if grep -q 'command: \["wpctl", "set-' "$CFG"; then
  bad "escrita por aparelho usa pactl" "wpctl com nome de aparelho nao funciona"
else
  ok "escrita por aparelho usa pactl"
fi

# --- caminho absoluto no Process ---
# Com caminho relativo o quickshell nao achava o binario:
#   WARN Process failed to start, likely because the binary could not be found
if grep -qE 'command: \["quickshell/' "$CFG"; then
  bad "Process usa caminho absoluto" "caminho relativo falha: cwd do quickshell nao e ~/.config"
else
  ok "Process usa caminho absoluto"
fi

# --- linha do mic condicional ---
grep -q 'micInUse' "$CFG" \
  && ok "linha do microfone so aparece em uso" \
  || bad "linha do microfone so aparece em uso" "micInUse ausente"

# --- altura da caixa acompanha a lista ---
# Com altura fixa, o segundo aparelho da lista ficava cortado.
grep -q 'root.sinks.length' "$CFG" \
  && ok "altura da caixa cresce com a lista de aparelhos" \
  || bad "altura da caixa cresce com a lista de aparelhos" "altura fixa"

# --- o numero acompanha o arraste ---
# O texto lia modelData.volume, que so muda depois do onCommitted. Arrastar
# seemed no-op porque o numero nao mexia. A propriedade "shown" resolve
# lendo o slider enquanto o botao esta apertado.
grep -q 'readonly property real shown' "$CFG" \
  && ok "numero mostra o valor sob o dedo durante o arraste" \
  || bad "numero mostra o valor sob o dedo durante o arraste" "propriedade shown ausente"

grep -q 'sinkSlider.pressed ? sinkSlider.value' "$CFG" \
  && ok "shown le o slider enquanto pressionado" \
  || bad "shown le o slider enquanto pressionado" "shown nao depende de pressed"

# O id precisa existir: sem ele o QML loga ReferenceError e o numero fica
# sem atualizacao nenhuma durante o arraste.
grep -q 'id: sinkSlider' "$CFG" \
  && ok "sinkSlider tem id (sem ReferenceError)" \
  || bad "sinkSlider tem id (sem ReferenceError)" "id ausente"

# --- botao de mais ajustes ---
# O link solto "controle completo do audio" saiu; o pavucontrol continua
# acessivel por um botao de rodape.
grep -q 'openPavu.apply()' "$CFG" \
  && ok "botao de mais ajustes chama o pavucontrol" \
  || bad "botao de mais ajustes chama o pavucontrol" "openPavu sem chamador"

grep -q 'mais ajustes' "$CFG" \
  && ok "botao de mais ajustes visivel" \
  || bad "botao de mais ajustes visivel" "rotulo ausente"
