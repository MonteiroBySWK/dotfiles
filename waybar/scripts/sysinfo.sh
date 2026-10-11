#!/usr/bin/env bash
# Modulo unico de recursos para o waybar.
#
# Substitui os modulos separados de cpu, memory e temperature por um icone
# so. O icone fica cinza em repouso, amarelo quando algo passa do
# aceitavel e vermelho quando algo e critico. O detalhe fica no tooltip e
# no popup de recursos.
#
# Por que roda em laco, e nao com "interval": cada leitura leva ~600ms --
# o uso de CPU e por diferenca de /proc/stat, com 250ms entre as duas
# leituras. Com "interval" o waybar mata e reinicia o script a cada
# ciclo, e o modulo fica em branco enquanto isso.
#
#   sysinfo.sh          laco continuo, uma linha JSON por ciclo (padrao)
#   sysinfo.sh --once   uma leitura e sai (usado pelos testes)
#
# A histerese precisa de estado entre ciclos, e o estado vive no laco do
# bash: o python recebe o nivel atual e devolve o novo.
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

medir() {
	# O JSON das leituras vai por variavel de ambiente, e nao por pipe: com
	# "$script" | python3 - <<'PY' o heredoc vence o pipe e o python le o
	# proprio codigo em vez dos dados -- que e o que devolvia class=erro.
	RES_JSON="$("$RECURSOS" 2>/dev/null)" NIVEL="$1" python3 - <<'PY'
import json
import os
import sys

ICON = os.environ.get("ICON", "")

try:
    d = json.loads(os.environ.get("RES_JSON") or "{}")
except Exception:
    # ensure_ascii=False: com o padrao, o glifo ia sair como a sequencia
    # \uf0e4 dentro do JSON em vez do caractere, e a barra mostrava isso.
    print("erro\t" + json.dumps({"text": ICON, "class": "erro"}, ensure_ascii=False))
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
# problema, e media dilui isso. acpitz e k10temp reportam o mesmo valor
# nesta maquina, mas conta duas vezes nao muda o maximo.
temp_max = max(temps) if temps else 0

# Nivel BRUTO: o que os valores de agora sugerem, sem memoria do
# historico. Quem decide se ja vale mudar de cor e o laco do bash, com
# contagem de leituras seguidas.
#
# any() para entrar: basta UM recurso passar do corte. all() seria pedir
# CPU, RAM, temperatura e GPU ruins ao mesmo tempo, o que praticamente
# nunca acontece -- e o icone ficava cinza sempre.
ENTRA_ATENCAO = (cpu >= 75, mem >= 85, temp_max >= 80, (gpu_pct or 0) >= 85)
ENTRA_CRITICO = (cpu >= 90, mem >= 90, temp_max >= 88, (gpu_pct or 0) >= 95)
FOLGA_ATENCAO = (cpu < 70, mem < 80, temp_max < 76, (gpu_pct or 0) < 80)
FOLGA_CRITICO = (cpu < 85, mem < 85, temp_max < 84, (gpu_pct or 0) < 90)

anterior = os.environ.get("NIVEL", "normal")

if any(ENTRA_CRITICO):
    nivel = "critico"
elif any(ENTRA_ATENCAO):
    nivel = "atencao"
elif anterior == "critico" and not all(FOLGA_CRITICO):
    # Ainda quente demais para desescalar, mesmo sem estourar o corte.
    nivel = "critico"
elif anterior == "atencao" and not all(FOLGA_ATENCAO):
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
# A saida e "nivel<TAB>json": o laco do bash le o nivel para a histerese.
print(nivel + "\t" + json.dumps({
    "text": ICON,
    "class": nivel,
    "tooltip": "\r".join(partes),
}, ensure_ascii=False))
PY
}

if [ "${1:-}" = "--once" ]; then
	medir "${NIVEL:-normal}" | cut -f2-
	exit 0
fi

# Um pico isolado de CPU -- abrir um programa, compilar algo -- vira alerta
# critico e volta no ciclo seguinte. Com histerese isso ja estava
# controlado na_descida_ mas nao na_subida_: subir era instantaneo. A
# leitura de pico isolado nao e problema; o problema e piscar.
#
# Entao: subir de nivel exige SEGUIR leituras acima do corte. Descer e
# imediato, com folga. E leitura e uma linha por ciclo, entao "seguir"
# significa consecutive.
SEGUIR=2
NIVEL="normal"
CONTA_ATEN=0
CONTA_CRIT=0

while true; do
	linha="$(medir "$NIVEL")"
	BRUTO="${linha%%	*}"

	case "$BRUTO" in
		critico) CONTA_CRIT=$((CONTA_CRIT + 1)); CONTA_ATEN=0 ;;
		atencao) CONTA_ATEN=$((CONTA_ATEN + 1)); CONTA_CRIT=0 ;;
		*)      CONTA_ATEN=0; CONTA_CRIT=0 ;;
	esac

	case "$NIVEL" in
		normal)
			[ "$CONTA_CRIT" -ge "$SEGUIR" ] && NIVEL="critico"
			[ "$NIVEL" = normal ] && [ "$CONTA_ATEN" -ge "$SEGUIR" ] && NIVEL="atencao"
			;;
		atencao)
			[ "$CONTA_CRIT" -ge 1 ] && NIVEL="critico"
			[ "$BRUTO" = normal ] && [ "$CONTA_ATEN" -eq 0 ] && NIVEL="normal"
			;;
		critico)
			[ "$BRUTO" = normal ] && [ "$CONTA_CRIT" -eq 0 ] && NIVEL="normal"
			[ "$BRUTO" = atencao ] && [ "$CONTA_CRIT" -eq 0 ] && NIVEL="atencao"
			;;
	esac

	printf '%s\n' "${linha#*	}"
	sleep "$INTERVALO"
done