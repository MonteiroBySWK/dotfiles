#!/usr/bin/env bash
# Leitura de recursos para o popup de monitoramento do quickshell.
#
# Script e nao QML porque a leitura do uso de CPU e por diferenca: precisa
# de dois instantes de /proc/stat com um intervalo entre eles. Fazer isso em
# JS nao daria -- nao ha como dormir sem travar a thread da interface.
#
# Saida:
#   {"cpu":{...},"mem":{...},"swap":{...},"gpu":{...},"temp":{...},"cores":[...]}
set -u

exec python3 - <<'PY'
import json
import os
import time


def ler(arquivo):
    try:
        with open(arquivo) as f:
            return f.read()
    except Exception:
        return ""


def cpu_janela():
    """Uso de CPU de um intervalo curto, por diferenca de contadores.
    Ler o valor absoluto nao serve: sao jutos desde o boot."""
    try:
        with open("/proc/stat") as f:
            antes = [int(x) for x in f.readline().split()[1:]]
    except Exception:
        return [], 0.0

    time.sleep(0.25)

    try:
        with open("/proc/stat") as f:
            depois = [int(x) for x in f.readline().split()[1:]]
    except Exception:
        return [], 0.0

    if not antes or not depois or len(antes) < 5 or len(depois) < 5:
        return [], 0.0

    d_idle = (depois[3] + (depois[4] if len(depois) > 4 else 0)) - (antes[3] + (antes[4] if len(antes) > 4 else 0))
    d_total = sum(depois) - sum(antes)
    uso = 0.0 if d_total <= 0 else (1.0 - d_idle / d_total) * 100.0
    return depois, uso


def uso_por_nucleo(antes, depois):
    """Cada nucleo tem seus proprios contadores; o total e a media deles."""
    if not antes or not depois or len(antes) != len(depois):
        return []
    out = []
    for a, d in zip(antes, depois):
        dt = sum(d) - sum(a)
        di = (d[3] + (d[4] if len(d) > 4 else 0)) - (a[3] + (a[4] if len(a) > 4 else 0))
        out.append(0.0 if dt <= 0 else max(0.0, min(100.0, (1.0 - di / dt) * 100.0)))
    return out


def temperatura():
    """hwmon nao tem nome estavel: o indice muda conforme o kernel e os
    sensores. Procura o primeiro que reportede graus, e se sorte."""
    achados = []
    base = "/sys/class/hwmon"
    try:
        for entrada in sorted(os.listdir(base)):
            nome = ""
            try:
                with open(os.path.join(base, entrada, "name")) as f:
                    nome = f.read().strip()
            except Exception:
                continue
            for i in range(1, 9):
                caminho = os.path.join(base, entrada, "temp%d_input" % i)
                valor = ler(caminho).strip()
                if not valor.isdigit():
                    continue
                celsius = int(valor) / 1000.0
                if celsius <= 0 or celsius > 120:
                    continue
                achados.append({"name": nome, "label": (nome or "hwmon"),
                                "celsius": round(celsius, 1)})
    except Exception:
        pass
    vistos, unicos = set(), []
    for t in achados:
        chave = (t["name"], t["celsius"])
        if chave in vistos:
            continue
        vistos.add(chave)
        unicos.append(t)
    return unicos


def hw(arquivo, padrao=""):
    v = ler(arquivo).strip()
    return v or padrao


contadores, cpu_uso = cpu_janela()

info_mem = {}
try:
    total_kb = 0
    dispon_kb = 0
    for linha in ler("/proc/meminfo").splitlines():
        if linha.startswith("MemTotal:"):
            total_kb = int(linha.split()[1])
        elif linha.startswith("MemAvailable:"):
            dispon_kb = int(linha.split()[1])
    swap_total = swap_usado = 0
    for linha in ler("/proc/meminfo").splitlines():
        if linha.startswith("SwapTotal:"):
            swap_total = int(linha.split()[1])
        elif linha.startswith("SwapFree:"):
            swap_usado = swap_total - int(linha.split()[1])
    if total_kb:
        usado_kb = total_kb - dispon_kb
        info_mem = {
            "totalMb": total_kb // 1024,
            "usedMb": usado_kb // 1024,
            "percent": round(usado_kb * 100.0 / total_kb, 1),
        }
    if swap_total:
        info_mem["swapTotalMb"] = swap_total // 1024
        info_mem["swapUsedMb"] = swap_usado // 1024
        info_mem["swapPercent"] = round(swap_usado * 100.0 / swap_total, 1)
except Exception:
    pass

# GPU pela DRM; o painel so aparece se o arquivo existir
gpu = {}
nome_gpu = ""
for cartao in sorted(os.listdir("/sys/class/drm")):
    sufixo = cartao[4:] if cartao.startswith("card") else ""
    # so interessa card0, card1... O filtro anterior comparava a string
    # "card" com o sufixo ("1"), o que era sempre diferente e descartava
    # toda a GPU.
    if not sufixo.isdigit():
        continue
    base = "/sys/class/drm/%s/device" % cartao
    nome_gpu = hw(base + "/product_name") or hw(base + "/label")
    temp = hw(base + "/hwmon/hwmon1/temp1_input")
    if not temp:
        try:
            for h in sorted(os.listdir(base + "/hwmon")):
                temp = hw("%s/hwmon/%s/temp1_input" % (base, h))
                if temp:
                    break
        except Exception:
            pass
    uso_gpu = ""
    try:
        with open(base + "/gpu_busy_percent") as f:
            uso_gpu = f.read().strip()
    except Exception:
        pass
    if nome_gpu or temp or uso_gpu:
        gpu = {"name": nome_gpu or "GPU"}
        if temp.isdigit():
            gpu["celsius"] = round(int(temp) / 1000.0, 1)
        if uso_gpu.isdigit():
            gpu["percent"] = int(uso_gpu)
        break

cpu_nome = ""
for linha in ler("/proc/cpuinfo").splitlines():
    if linha.lower().startswith("model name"):
        cpu_nome = linha.split(":", 1)[1].strip()
        break

print(json.dumps({
    "cpu": {"percent": round(cpu_uso, 1), "name": cpu_nome,
            "cores": os.cpu_count() or len(contadores)},
    "mem": info_mem,
    "gpu": gpu,
    "temp": temperatura(),
}, separators=(",", ":")))
PY