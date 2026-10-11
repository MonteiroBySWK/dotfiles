#!/usr/bin/env bash
# Aplica um perfil do TLP. Chamado pelo QML quando a pessoa clica numa
# linha do painel de bateria.
#
# Uso: tlp-apply.sh <performance|balanced|power-saver>
#
# Como funciona sem prompt de senha:
#
# o painel roda dentro do quickshell, um processo do usuario, e sysfs e
# de root. A saida esta no sudoers como "(root) NOPASSWD: /usr/bin/tlp",
# sem restricao de argumento -- no sudoers, regra sem args casa com
# qualquer argumento. Entao `sudo -n tlp <perfil>` passa direto. Medido:
# rc=0 e o perfil troca de verdade.
#
# Descartado: TLP_PROFILE=<p> sudo -n tlp start. Parece o caminho certo e
# nao e -- o sudo limpa o ambiente antes de executar (env_reset), a
# variavel nunca chega no TLP e o perfil fica sempre em performance/AC.
# Medido: os tres valores preservaram performance/AC e o EPP nunca mudou.
#
# Descartado tambem: dar NOPASSWD a um wrapper proprio em
# /usr/local/bin. Funcionaria, mas e uma linha no sudoers que so existe
# por causa deste painel -- e `tlp <perfil>` e exatamente o que o TLP
# oferece para isso.
set -u

PERFIL=${1:-}
case "$PERFIL" in
	performance | balanced | power-saver) ;;
	*)
		printf '{"ok":false,"erro":"perfil invalido"}\n'
		exit 1
		;;
esac

if salida=$(sudo -n tlp "$PERFIL" 2>&1); then
	# Confere o que o TLP de fato aplicou em vez de assumir que o
	# comando ter saido com 0 significa ter dado certo.
	#
	# O TLP renomeia o perfil conforme a fonte de energia: nesta maquina
	# "balanced" vira "balanced/BAT", "power-saver" vira
	# "power-saver/SAV" e "performance" vira "performance/AC". Ler o
	# nome de volta e o que garante que a linha marcada no painel e a
	# linha que esta valendo.
	lido=$(tlp-stat -s 2>/dev/null \
		| awk -F'= ' '/TLP profile/ {print $2}' \
		| tr -d ' ' | cut -d/ -f1)
	epp=$(cat /sys/devices/system/cpu/cpu0/cpufreq/energy_performance_preference 2>/dev/null)

	printf '{"ok":true,"pedido":"%s","aplicado":"%s","epp":"%s"}\n' \
		"$PERFIL" "${lido:-desconhecido}" "${epp:-desconhecido}"
else
	printf '{"ok":false,"erro":"%s"}\n' "${salida//\"/\'}"
	exit 1
fi