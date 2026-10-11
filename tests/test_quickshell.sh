#!/usr/bin/env bash
# Testa quickshell/popup/shell.qml: sintaxe real + os tokens do macOS.
set -u
CFG="$(dirname "$0")/../quickshell/popup/shell.qml"
DIR="$(dirname "$CFG")"
# Raiz do repo: DIR e <raiz>/quickshell/popup, entao sobe dois niveis.
# Com "../waybar" o caminho resolvia para quickshell/waybar, que nao existe.
RAIZ="$(cd "$(dirname "$DIR")/.." && pwd)"
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
grep -q 'sinks.length' "$CFG" \
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

# --- calendario ---
grep -q 'function showCalendar' "$CFG" \
  && ok "IPC showCalendar existe" \
  || bad "IPC showCalendar existe" "handler ausente"

# A grade tem que ser GridLayout com 7 colunas. Em ColumnLayout cada dia
# virava uma linha -- o calendario saia como uma coluna de 1 a 31.
grep -q 'columns: 7' "$CFG" \
  && ok "grade do calendario em 7 colunas" \
  || bad "grade do calendario em 7 colunas" "sem GridLayout de 7 colunas"

# Em Repeater com required property, o index tambem precisa ser declarado,
# senao o QML loga ReferenceError e o fimDeSemana fica indefinido.
grep -q 'required property int index' "$CFG" \
  && ok "index declarado no delegate (sem ReferenceError)" \
  || bad "index declarado no delegate (sem ReferenceError)" "index nao declarado"

# O locale do sistema e C: Qt.formatDate devolveria "October de 2026".
grep -q 'root.meses\[root.calMonth\]' "$CFG" \
  && ok "nome do mes em portugues (locale C nao traduz)" \
  || bad "nome do mes em portugues (locale C nao traduz)" "usa Qt.formatDate"

# --- escrita ao vivo durante o arraste ---
grep -q 'signal dragged' "$DIR/MacSlider.qml" \
  && ok "MacSlider emite dragged durante o arraste" \
  || bad "MacSlider emite dragged durante o arraste" "sem signal dragged"

grep -q 'onDragged' "$CFG" \
  && ok "popup escreve durante o arraste, nao so ao soltar" \
  || bad "popup escreve durante o arraste, nao so ao soltar" "onDragged nao tratado"

# --- recursos ---
grep -q 'function showResources' "$CFG" \
  && ok "IPC showResources existe" \
  || bad "IPC showResources existe" "handler ausente"

[ -x "$DIR/list-resources.sh" ] \
  && ok "list-resources.sh existe e e executavel" \
  || bad "list-resources.sh existe e e executavel" "ausente ou sem bit de execucao"

saida=$("$DIR/list-resources.sh" 2>/dev/null)
if printf '%s' "$saida" | python3 -c '
import json,sys
d=json.load(sys.stdin)
assert "percent" in d.get("cpu",{}), "cpu sem percent"
assert d["cpu"]["cores"] > 0, "cpu sem numero de nucleos"
assert "percent" in d.get("mem",{}), "mem sem percent"
assert isinstance(d.get("temp"), list)
for t in d["temp"]:
    assert "label" in t and "celsius" in t
' 2>/dev/null; then
  ok "list-resources.sh devolve JSON com os campos esperados"
else
  bad "list-resources.sh devolve JSON com os campos esperados" "JSON invalido ou incompleto"
fi

# Polling so com o painel aberto: ler recursos a cada segundo com o popup
# fechado seria um processo jogado fora.
grep -q 'resTimerOn' "$CFG" \
  && ok "polling de recursos so com o painel aberto" \
  || bad "polling de recursos so com o painel aberto" "sem resTimerOn"

[ -f "$DIR/StatBar.qml" ] \
  && ok "StatBar.qml existe" \
  || bad "StatBar.qml existe" "ausente"

# O filtro da DRM era invertido e descartava a GPU inteira.
if printf '%s' "$saida" | python3 -c '
import json,sys
d=json.load(sys.stdin)
assert d.get("gpu"), "gpu vazia: filtro da DRM descartou tudo"
' 2>/dev/null; then
  ok "GPU detectada pelo filtro da DRM"
else
  bad "GPU detectada pelo filtro da DRM" "gpu vazia"
fi

# --- modulo unico de recursos na barra ---
SISTEMA="$(dirname "$0")/../waybar/scripts/sysinfo.sh"

[ -x "$SISTEMA" ] \
  && ok "sysinfo.sh existe e e executavel" \
  || bad "sysinfo.sh existe e e executavel" "ausente ou sem bit de execucao"

# --once: sem isso o teste ficaria preso no laco infinito.
if "$SISTEMA" --once 2>/dev/null | python3 -c '
import sys, json
d = json.load(sys.stdin)
assert d["text"], "icone vazio"
assert d["class"] in ("normal", "atencao", "critico", "erro"), d["class"]
assert "\r" in d["tooltip"], "o tooltip do waybar separa linhas com \\r, nao \\n"
' 2>/dev/null; then
  ok "sysinfo.sh --once devolve JSON valido"
else
  bad "sysinfo.sh --once devolve JSON valido" "JSON invalido ou campos fora do esperado"
fi

# O glifo precisa sair como caractere, e nao como \uf0e4 escapado: com o
# padrao do json.dumps o texto do modulo virava a sequencia literal.
if "$SISTEMA" --once 2>/dev/null | python3 -c '
import sys, json
d = json.load(sys.stdin)
assert len(d["text"]) == 1 and ord(d["text"]) > 0x2000, "icone nao e um glifo"
' 2>/dev/null; then
  ok "icone sai como caractere (nao escapado)"
else
  bad "icone sai como caractere (nao escapado)" "texto nao e um glifo unico"
fi

CFGW="$(dirname "$0")/../waybar/config.jsonc"

# return-type json: sem ele o waybar mostra o JSON cru na barra.
grep -q '"return-type": "json"' "$CFGW" \
  && ok "custom/sysinfo com return-type json" \
  || bad "custom/sysinfo com return-type json" "sem return-type: a barra mostra o JSON cru"

# "interval" reiniciava o script a cada ciclo; cada leitura leva ~600ms e o
# modulo ficava em branco nesse meio tempo, o que aparecia como piscada.
if awk '/"custom\/sysinfo"/,/}/' "$CFGW" | grep -q '"interval"'; then
  bad "sysinfo sem interval (o script ja e um laco)" "interval reinicia o script e pisca"
else
  ok "sysinfo sem interval (o script ja e um laco)"
fi

# Os tres modulos separados foram substituidos por um icone so.
if grep -qE '^\s*"(cpu|memory|temperature)",?$' "$CFGW"; then
  bad "cpu, memory e temperature fora da lista de modulos" "ainda na lista"
else
  ok "cpu, memory e temperature fora da lista de modulos"
fi

# O relogio e o modulo de recursos abrem popups
grep -q 'open.sh calendar' "$CFGW" && ok "relogio abre o calendario" || bad "relogio abre o calendario" "sem on-click"
grep -q 'open.sh resources' "$CFGW" && ok "sysinfo abre o painel de recursos" || bad "sysinfo abre o painel de recursos" "sem on-click"

# --- posicao no clique ---
# O waybar nao repassa onde foi clicado, so executa o comando. A posicao
# vem do cursor (hyprctl cursorpos) e precisa ser convertida de coordenada
# global para local da tela -- o monitor a esquerda deste setup comeca em
# x negativo, e sem converter o popup iria para a borda errada.
[ -x "$DIR/open.sh" ] \
  && ok "open.sh existe e e executavel" \
  || bad "open.sh existe e e executavel" "ausente ou sem bit de execucao"

grep -q 'cursorpos' "$DIR/open.sh" \
  && ok "open.sh le a posicao do cursor" \
  || bad "open.sh le a posicao do cursor" "nao consulta o cursor"

grep -q 'telaAtual' "$CFG" \
  && ok "converte coordenada global para a tela do popup" \
  || bad "converte coordenada global para a tela do popup" "sem telaAtual"

grep -q 'popX' "$CFG" \
  && ok "popup posicionado no cursor (popX)" \
  || bad "popup posicionado no cursor (popX)" "sem popX"

# Ancorar e posicionar se briga: com horizontalCenter: undefined a ancora
# continuava ditando o x e o popup ia para a borda esquerda.
if grep -q 'anchors.horizontalCenter:.*undefined' "$CFG"; then
  bad "x calculado sem misturar ancora" "ancora e x competem pelo mesmo atributo"
else
  ok "x calculado sem misturar ancora"
fi

# A histerese e o que parou a alternancia de cor. Com so o corte, o idle
# em 70-73 C cruzava o limite a cada leitura.
grep -q 'NIVEL' "$RAIZ/waybar/scripts/sysinfo.sh" \
  && ok "sysinfo guarda o nivel entre ciclos (histerese)" \
  || bad "sysinfo guarda o nivel entre ciclos (histerese)" "sem estado entre ciclos"

# --- subir de nivel exige leituras seguidas ---
# A histerese segura a descida, mas a subida era instantanea: um pico
# isolado de CPU (abrir um programa) virava alerta critico e voltava no
# ciclo seguinte. Isso e o que o usuario via como piscada.
grep -q 'SEGUIR=' "$RAIZ/waybar/scripts/sysinfo.sh" \
  && ok "sysinfo exige leituras seguidas para escalar" \
  || bad "sysinfo exige leituras seguidas para escalar" "sem contagem de leituras"

grep -q 'CONTA_CRIT' "$RAIZ/waybar/scripts/sysinfo.sh" \
  && ok "sysinfo conta leituras acima do corte" \
  || bad "sysinfo conta leituras acima do corte" "sem contador"

# A transicao de cor reiniciava a cada recriacao do rotulo pelo waybar,
# fazendo o icone voltar a cor base a cada ciclo.
if grep -q 'transition: color' "$RAIZ/waybar/style.css"; then
  bad "sem transition no icone de recursos" "a transicao reinicia a cada rotulo recriado"
else
  ok "sem transition no icone de recursos"
fi

# --- a barra do popup nao pode "zera e carregar" ---
# A cada leitura (1s) o Repeater e recriado, entao o delegate nasce com
# width 0. Com "Behavior on width" a barra animava de zero ate o valor --
# "zera a barra e carrega novamente na animacao", a cada segundo.
# A barra PODE animar, desde que o delegate nao seja recriado a cada
# leitura. Com array como model o Repeater recria o delegate e a barra nasce
# em zero -- ai a animacao era o defeito. A ListModel e que garante o
# delegate vivo.
grep -q 'ListModel' "$CFG" \
  && ok "linhas de recurso vem de ListModel" \
  || bad "linhas de recurso vem de ListModel" "model como array recria os delegates"

grep -q 'model: resModel' "$CFG" \
  && ok "Repeater usa o ListModel" \
  || bad "Repeater usa o ListModel" "model nao e o ListModel"

grep -q 'resModel.setProperty' "$CFG" \
  && ok "valores atualizados no lugar, sem recriar a linha" \
  || bad "valores atualizados no lugar, sem recriar a linha" "sem setProperty"

grep -q 'Behavior on width' "$DIR/StatBar.qml" \
  && ok "StatBar anima a largura" \
  || bad "StatBar anima a largura" "sem Behavior on width"

grep -q 'Behavior on color' "$DIR/StatBar.qml" \
  && ok "StatBar anima a cor do estado" \
  || bad "StatBar anima a cor do estado" "sem Behavior on color"

grep -q 'Behavior on color' "$CFG" \
  && ok "chips de temperatura animam a cor" \
  || bad "chips de temperatura animam a cor" "sem Behavior on color"

# Sem argumento o IPC passa 0, que e um x legitimo (borda esquerda). Com
# "x < 0" o 0 caia fora do caso de centralizar e o popup ia para a borda.
if grep -q 'x <= 0' "$CFG"; then
  ok "popX trata 0 como ausente (centraliza)"
else
  bad "popX trata 0 como ausente (centraliza)" "0 cai fora e o popup vai para a borda"
fi

# --- os handlers do IPC precisam aceitar argumento ---
# Viraram "x: int" quando o popup passou a abrir onde foi clicado. QML
# nao aceita anotacao de tipo em parametro default ("Type annotations on
# default parameters are not supported") e o IpcHandler so registra
# funcoes com parametro tipado -- sem o tipo ele some com "Function not
# found". Entao todo chamador precisa passar a posicao.
for f in showVolume showBrightness showCalendar showResources; do
  grep -q "function $f(x: int): void" "$CFG" \
    && ok "IPC $f com x: int" \
    || bad "IPC $f com x: int" "assinatura sem parametro tipado: nao registra"
done

# Nenhum chamador pode ficar sem argumento, e a ordem dos flags do qs
# importa: "qs ipc -c popup" nao e "qs -c popup ipc".
if grep -qE 'qs ipc -c popup' "$RAIZ/waybar/config.jsonc"; then
  bad "waybar chama os popups pelo wrapper" "qs ipc -c popup: flags na ordem errada"
else
  ok "waybar chama os popups pelo wrapper"
fi

vol=$(grep -c 'open.sh volume' "$RAIZ/waybar/config.jsonc")
bri=$(grep -c 'open.sh brightness' "$RAIZ/waybar/config.jsonc")
[ "$vol" -ge 1 ] && ok "volume pelo wrapper (passa a posicao)" || bad "volume pelo wrapper (passa a posicao)" "volume sem wrapper"
[ "$bri" -ge 1 ] && ok "brilho pelo wrapper (passa a posicao)" || bad "brilho pelo wrapper (passa a posicao)" "brilho sem wrapper"

# A barra da GPU e temperatura, nao uso: uso ocioso e poucos por cento e
# nao diz nada de saude, enquanto a temperatura e o numero que importa.
grep -q 'valor: g.celsius' "$CFG" \
  && ok "barra da GPU mostra temperatura, nao uso" \
  || bad "barra da GPU mostra temperatura, nao uso" "barra usa porcentagem de uso"

# --- volume por canal, e nao so "mono" ---
# O pactl nao tem formato unico: sink analogico pode vir em volume.mono e
# um bluetooth vem por canal (front-left/front-right). Ler so "mono"
# devolvia nada e o popup mostrava 0% COM O SOM TOCANDO -- silencioso,
# porque o audio continuava normal.
grep -q 'volume_percent' "$DIR/list-devices.sh" \
  && ok "list-devices le volume por canal, nao so mono" \
  || bad "list-devices le volume por canal, nao so mono" "sem fallback de canal"

# A leitura tem de bater com o pactl, que e a fonte da verdade.
vol_json=$("$DIR/list-devices.sh" 2>/dev/null | python3 -c '
import sys, json
print(" ".join(str(s["volume"]) for s in json.load(sys.stdin)["sinks"]))' 2>/dev/null)
if [ -n "$vol_json" ]; then
  verdade=""
  for s in $(pactl list sinks short 2>/dev/null | awk '{print $2}'); do
    p=$(pactl get-sink-volume "$s" 2>/dev/null | grep -oE '[0-9]+%' | head -1 | tr -d '%')
    verdade="$verdade $p"
  done
  bate=1
  for v in $verdade; do
    echo "$vol_json" | grep -qw "$v" || bate=0
  done
  if [ "$bate" = "1" ] && ! echo "$vol_json" | grep -qw "0"; then
    ok "volume do popup bate com o pactl (nao e 0 com som tocando)"
  else
    bad "volume do popup bate com o pactl" "popup=[$vol_json] pactl=[$verdade]"
  fi
fi

# --- o popup precisa IR para a tela do clique ---
# Sem "screen", a janela fica presa no monitor onde nasceu e o localX (que
# ja e a posicao do cursor DENTRO da tela certa) era aplicado na tela
# errada -- o popup aparecia no meio do monitor errado.
grep -q 'screen: root.telaAtual' "$CFG" \
  && ok "PanelWindow segue a tela do clique" \
  || bad "PanelWindow segue a tela do clique" "sem screen: a janela fica presa numa tela"

# telaAtual tem de estar no root: declarado dentro do PanelWindow, ele nao
# existe no escopo do root e o QML loga "Unable to assign [undefined] to
# QuickshellScreenInfo".
awk '/ShellRoot \{/,/^\tPanelWindow/' "$CFG" | grep -q 'readonly property var telaAtual' \
  && ok "telaAtual resolvida no escopo do root" \
  || bad "telaAtual resolvida no escopo do root" "telaAtual fora do root"


# --- notificacoes: servico nativo ---
# O mako ocupava org.freedesktop.Notifications e nao deixava o quickshell
# registrar. Ele saiu do autostart E foi mascarado no systemd de usuario,
# porque tem fr.emersion.mako.service de ativacao D-Bus: sem o mask, o
# dbus o ressuscitava quando o nome ficava livre.
grep -q 'NotificationServer' "$CFG" \
  && ok "usa o servico de notificacoes nativo" \
  || bad "usa o servico de notificacoes nativo" "sem NotificationServer"

# Em 0.3.2 o sinal chega mas trackedNotifications fica vazio, com ou sem
# keepOnReload. A lista tem de ser nossa, alimentada pelo sinal.
grep -q 'onNotification' "$CFG" \
  && ok "historico montado pelo sinal, nao por trackedNotifications" \
  || bad "historico montado pelo sinal, nao por trackedNotifications"

# O comentario que explica POR QUE nao usar trackedNotifications cita o
# nome; o teste precisa ver uso real, nao mencao em comentario. E a
# quarta vez que isso acontece com este arquivo.
grep -vE '^\s*//' "$CFG" | grep -q 'trackedNotifications' \
  && bad "nao depende de trackedNotifications" "vazio nesta versao do quickshell" \
  || ok "nao depende de trackedNotifications"

grep -q 'modelData.invoke()' "$CFG" \
  && ok "acao da notificacao usa o invoke() do objeto" \
  || bad "acao da notificacao usa o invoke() do objeto" "ainda chamando gdbus"

if grep -q 'mako' "$CFG/../hypr/autostart.lua" 2>/dev/null || grep -q 'exec_cmd("mako")' "$RAIZ/hypr/autostart.lua"; then
  bad "mako fora do autostart" "mako ainda e iniciado"
else
  ok "mako fora do autostart"
fi

# --- toast ---
# Janela SEPARADA da do popup. Se virar um modo a mais, o popup de recursos
# fecha quando chega notificacao, porque as duas janelas disputam `mode`.
[ "$(grep -c 'PanelWindow {' "$CFG")" = "2" ] \
  && ok "toast e uma janela propria, alem da do popup" \
  || bad "toast e uma janela propria, alem da do popup" "$(grep -c 'PanelWindow {' "$CFG") janelas"

grep -q 'root.toasts.concat(\[n\]).slice(-2)' "$CFG" \
  && ok "toast guarda no maximo dois, o mais novo por cima" \
  || bad "toast guarda no maximo dois, o mais novo por cima" "sem limite"

grep -q 'screen: root.telaDoCursor' "$CFG" \
  && ok "toast sai na tela do cursor, nao na tela padrao" \
  || bad "toast sai na tela do cursor, nao na tela padrao" "sem screen"

# hyprctl por notificacao e irrelevante; por quadro seria um processo a mais
# o tempo todo. O teste nao pode procurar o intervalo (o arquivo comenta
# sobre ele), entao confere que a leitura NAO esta num Timer.
grep -q 'hyprctl", "-j", "cursorpos' "$CFG" \
  && ok "le o cursor com hyprctl para achar a tela do toast" \
  || bad "le o cursor com hyprctl para achar a tela do toast" "sem hyprctl cursorpos"

# --- bateria / perfil de energia ---
# O painel precisa do battery.sh e do tlp-apply.sh; um sem o outro deixa
# a tela morta (le sem escrever) ou quebra no clique (escreve sem ler).
[ -x "$RAIZ/quickshell/popup/battery.sh" ] \
  && ok "battery.sh existe e e executavel" \
  || bad "battery.sh existe e e executavel" "ausente ou sem +x"

[ -x "$RAIZ/quickshell/popup/tlp-apply.sh" ] \
  && ok "tlp-apply.sh existe e e executavel" \
  || bad "tlp-apply.sh existe e e executavel" "ausente ou sem +x"

# O JSON do battery.sh tem que valer para o QML ler. Chave por chave:
# um typo aqui vira painel vazio em producao, sem erro visivel.
saida=$("$RAIZ/quickshell/popup/battery.sh" 2>/dev/null)
for chave in carga status fonte perfil epp perfis; do
  echo "$saida" | grep -q "\"$chave\"" \
    && ok "battery.sh devolve a chave $chave" \
    || bad "battery.sh devolve a chave $chave" "ausente no JSON"
done

# O perfil tem de bater com o que o TLP real aplicou. Medido nesta
# maquina: performance=performance/AC, balanced=balanced/BAT,
# power-saver=power-saver/SAV. Se o TLP mudar, o painel some -- que e
# o comportamento honesto (nao mente check em linha nenhuma) em vez de
# marcar a linha errada.
perfil_rel=$("$RAIZ/quickshell/popup/battery.sh" 2>/dev/null \
  | python3 -c 'import sys,json; print(json.load(sys.stdin)["perfil"])')
tlp_rel=$(tlp-stat -s 2>/dev/null | awk -F'= ' '/TLP profile/ {print $2}' | tr -d ' ' | cut -d/ -f1)
[ "$perfil_rel" = "$tlp_rel" ] \
  && ok "battery.sh le o mesmo perfil que o TLP aplicou" \
  || bad "battery.sh le o mesmo perfil que o TLP aplicou" "battery.sh=$perfil_rel tlp=$tlp_rel"

# Nao pode escrever nada na leitura: battery.sh e so leitura. Um `sudo`
# aqui transformaria a abertura do painel em algo que pede senha.
# Ignora comentario: a 5a vez que o teste acusa a propria explicacao. O
# cabecalho do battery.sh MENCIONA o sudo do tlp-apply.sh ao dizer que
# ele nao escreve nada. O que interessa e o que o codigo faz.
if grep -vE '^\s*#' "$RAIZ/quickshell/popup/battery.sh" \
    | grep -qE 'sudo|tee|^[^#]*>\s*/sys'; then
  bad "battery.sh so le, nao escreve" "encontrou escrita ou sudo na leitura"
else
  ok "battery.sh so le, nao escreve"
fi

# A troca de perfil tem de passar pelo NOPASSWD do TLP. O caminho
# TLP_PROFILE=<x> sudo -n tlp start nao funciona: o sudo limpa o
# ambiente e o perfil nunca muda. Se alguem "simplificar" para isso, o
# painel volta a mentir (marca uma linha e o TLP fica em outro perfil).
grep -q 'tlp "\$PERFIL"' "$RAIZ/quickshell/popup/tlp-apply.sh" \
  && ok "aplica com 'tlp <perfil>', nao com TLP_PROFILE (sudo limpa env)" \
  || bad "aplica com 'tlp <perfil>', nao com TLP_PROFILE (sudo limpa env)" "nao achou 'tlp \"\$PERFIL\"'"

# O painel le de volta o que o TLP gravou, em vez de assumir que o
# comando ter saido com 0 significa ter dado certo. O TLP renomeia o
# perfil conforme a fonte (balanced vira balanced/BAT, power-saver vira
# power-saver/SAV).
grep -q 'aplicado' "$RAIZ/quickshell/popup/tlp-apply.sh" \
  && ok "tlp-apply.sh relê o perfil aplicado, nao so o pedido" \
  || bad "tlp-apply.sh relê o perfil aplicado, nao so o pedido" "sem campo aplicado"

# Battery e um modo do popup, entao a janela do popup tem de abrir nele.
grep -q 'function showBattery(x: int): void' "$CFG" \
  && ok "showBattery exposto no IpcHandler" \
  || bad "showBattery exposto no IpcHandler" "sem showBattery"

grep -q 'root.mode === 6' "$CFG" \
  && ok "painel de bateria aparece com mode 6" \
  || bad "painel de bateria aparece com mode 6" "sem mode === 6"

# O botao da barra (custom/tlp) abre o painel em vez de ciclar o perfil.
# Ciclar com tres posicoes manda a pessoa para performance sem pedir, e
# performance gasta bateria -- o oposto do que a pessoa tocou.
grep -q 'open.sh battery' "$RAIZ/waybar/config.jsonc" \
  && ok "botao de TLP abre o painel, nao cicla o perfil" \
  || bad "botao de TLP abre o painel, nao cicla o perfil" "sem open.sh battery"

if grep -q 'tlp.sh toggle' "$RAIZ/waybar/config.jsonc"; then
  bad "on-click do custom/tlp nao usa mais toggle" "ainda ciclando"
else
  ok "on-click do custom/tlp nao usa mais toggle"
fi

# O caminho de aplicar trava durante o sudo (1s). Sem isso, dois cliques
# sobem dois `sudo -n tlp` e o segundo briga com o primeiro.
grep -q 'aplicandoPerfil' "$CFG" \
  && ok "painel trava o clique enquanto o TLP aplica" \
  || bad "painel trava o clique enquanto o TLP aplica" "sem trava durante o sudo"

# Ler antes de abrir: abrir com a coluna vazia e preencher depois faz o
# painel mudar de altura debaixo da mao da pessoa.
grep -q 'root.readBattery();' "$CFG" \
  && ok "le a bateria antes de abrir o painel (nao muda de tamanho depois)" \
  || bad "le a bateria antes de abrir o painel (nao muda de tamanho depois)" "sem leitura antecipada"
