#!/usr/bin/env bash
# Modulo unico de recursos para o waybar.
#
# Substitui os modulos separados de cpu, memory e temperature por um icone
# so. O icone fica cinza em repouso, amarelo quando algo passa do
# aceitavel e vermelho quando algo e critico. O detalhe fica no tooltip e
# no popup de recursos.
#
# Por que roda em laco, e nao com "interval": cada leitura leva ~600ms --
# o uso de CPU e por diferenca de /proc/stat, com 250ms de intervalo entre
# as duas leituras. Com "interval" o waybar mata e reinicia o script a cada
# ciclo, e o modulo fica em branco enquanto isso -- o icone piscava. Em laco
# o script apenas imprime a proxima linha e o waybar troca o texto sem
# interromper nada.
#
#   sysinfo.sh          laco continuo, uma linha JSON por ciclo (padrao)
#   sysinfo.sh --once   uma leitura e sai (usado pelos testes)
set -u

INTERVALO="${SYSINFO_INTERVAL:-5}"
AQUI="$(cd "$(dirname "$0")" && pwd)"
RECURSOS="$AQUI/../../quickshell/popup/list-resources.sh"

if [ ! -x "$RECURSOS" ]; then
	# Sem leitura, mostra o icone cinza. Melhor que esconder o modulo:
	# sumir repete um erro silencioso.
	printf '{"text":"\xf0\x9f\x94\xa4","class":"erro"}\n'
	exit 0
fi

export ICON=$'\uf0e4'   # fa-tachometer

emitir() {
	# O JSON vai por variavel de ambiente, e nao por pipe: com
	# "$script" | python3 - <<'PY' o heredoc vence o pipe e o python le o
	# proprio codigo em vez dos dados -- que e o que devolvia class=erro.
	RES_JSON="$("$RECURSOS" 2>/dev/null)" python3 - <<'PY'
import json
import os
import sys

ICON = os.environ.get("ICON", "")

try:
    d = json.loads(os.environ.get("RES_JSON") or "{}")
except Exception:
    # ensure_ascii=False: com o padrao, o glifo ia sair como a sequencia
    # \uf0e4 dentro do JSON em vez do caractere, e a barra mostrava isso.
    print(json.dumps({"text": ICON, "class": "erro"}, ensure_ascii=False))
    raise SystemExit

cpu_info = d.get("cpu") or {}
cpu = cpu_info.get("percent") or 0
mem_info = d.get("mem") or {}
mem = mem_info.get("percent") or 0
swap = mem_info.get("swapPercent") or 0
gpu = d.get("gpu") or {}
gpu_pct = gpu.get("percent")
gpu_temp = gpu.get("celsius")
temps = [t.get("celsius", 0) for t in (d.get("temp") or [])]

# A temperatura mais quente, e nao a media: um unico ponto quente ja e
# problema, e media dilui isso.
temp_max = max(temps) if temps else 0

# Mesmos cortes do StatBar.qml, para a barra e o popup concordarem.
if cpu >= 90 or mem >= 90 or temp_max >= 85 or (gpu_pct or 0) >= 95:
    nivel = "critico"
elif cpu >= 75 or mem >= 85 or temp_max >= 75 or (gpu_pct or 0) >= 85:
    nivel = "atencao"
else:
    nivel = "normal"

cores = cpu_info.get("cores") or 0
partes = ["CPU %.0f%% (%d nucleos)" % (cpu, cores), "Memoria %.0f%%" % mem]
if swap:
    partes.append("Swap %.0f%%" % swap)
if gpu_pct is not None:
    partes.append("GPU %.0f%%" % gpu_pct)
if gpu_temp is not None:
    partes.append("GPU %.0f °C" % gpu_temp)
if temp_max:
    partes.append("Pico %.0f °C" % temp_max)

# O tooltip do waybar separa linhas com \r, nao com \n.
print(json.dumps({
    "text": ICON,
    "class": nivel,
    "tooltip": "\r".join(partes),
}, ensure_ascii=False), flush=True)
PY
}

if [ "${1:-}" = "--once" ]; then
	emitir
	exit 0
fi

# Laco: uma linha por ciclo. while read do waybar consome linha a linha.
while true; do
	emitir
	sleep "$INTERVALO"
done