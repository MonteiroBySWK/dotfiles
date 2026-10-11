#!/usr/bin/env bash
# Lista sinks e sources em JSON, para o popup do quickshell.
#
# Existe como script e nao como tres Process no QML porque o popup precisa
# de tres leituras -- sinks, sources e qual e o default -- e cada uma
# custaria um processo. Aqui e uma so, e o QML parseia o JSON.
#
# Saida:
#   {"sinks":[...],"sources":[...],"micInUse":true}
#
# Cada item: {"name","label","volume","muted","default","running"}
#
# Campos learned na saida real do pactl desta maquina, nao na documentacao:
#   - o volume vem em volume.mono.value_percent, como string "40%" -- e nao
#     em volume.value, que nesta versao do pactl volta null
#   - nao existe is_default no JSON; o default sai de `pactl get-default-sink`
#     comparado com o nome
#   - description traz o nome amigavel ("Fuxi-H3"), name traz o tecnico
set -u

exec python3 - <<'PY'
import json
import subprocess


def run(*cmd):
    try:
        p = subprocess.run(cmd, capture_output=True, text=True, timeout=3)
        return p.stdout.strip()
    except Exception:
        return ""


def default_of(kind):
    d = run("pactl", "get-default-" + kind)
    return d.splitlines()[0].strip() if d else ""


def items(kind):
    # Atencao: a listagem e plural ("list sinks"/"list sources") mas o
    # default e singular ("get-default-sink"). Errar isso devolve [] sem
    # erro nenhum, que foi o que aconteceu na primeira versao.
    raw = run("pactl", "-f", "json", "list", kind + "s")
    try:
        data = json.loads(raw or "[]")
    except Exception:
        return []
    if not isinstance(data, list):
        return []

    dflt = default_of(kind)
    out = []
    for s in data:
        name = s.get("name") or ""
        if not name:
            continue
        # .monitor sao os equivalentes de saida das entradas; nao sao
        # microfones que o usuario escolhe, entao ficam de fora. O Singular
        # porque kind e "source", nao "sources".
        if kind.startswith("source") and name.endswith(".monitor"):
            continue

        # Nesta versao do pactl o description ausente volta como a string
        # "(null)", e nao como null. Sem este teste o aparelho aparecia
        # com "(null)" escrito na interface.
        # Ordem do nome: description (o que a pessoa ve no sistema),
        # depois node.nick ("ALC256 Analog"), e so entao o nome tecnico --
        # "alsa_output.pci-0000_05_00.6.analog-stereo" nao e um rotulo.
        props = s.get("properties") or {}
        label = s.get("description")
        if not label or label == "(null)":
            label = props.get("node.nick")
        if not label or label == "(null)":
            label = name

        vol = ((s.get("volume") or {}).get("mono") or {}).get("value_percent") or "0%"
        try:
            volume = int(str(vol).strip().rstrip("%"))
        except ValueError:
            volume = 0

        out.append({
            "name": name,
            # description e o nome que a pessoa reconhece; o name e o tecnico.
            "label": label,
            # Necessario porque pactl tem um subcomando por tipo: o popup
            # nao pode escrever "set-sink-volume" num microfone.
            "kind": "source" if kind.startswith("source") else "sink",
            "volume": max(0, min(120, volume)),
            "muted": bool(s.get("mute")),
            "default": name == dflt,
            "running": s.get("state") == "RUNNING",
        })
    return out


sinks = items("sink")
sources = items("source")

print(json.dumps({
    "sinks": sinks,
    "sources": sources,
    # O macOS so mostra o microfone com o ponto laranja quando ele esta em
    # uso. Aqui: mesma regra -- a linha do mic so aparece se algum source
    # estiver RUNNING.
    "micInUse": any(s["running"] for s in sources),
}, separators=(",", ":")))
PY