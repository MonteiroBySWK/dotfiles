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
# VOLUME: lido do wpctl, nao do pactl.
#
# O JSON do pactl nao tem um formato so. Medido nesta maquina: um sink
# analogico vem em volume.mono, um bluetooth vem por canal
# (front-left/front-right), e volume.value volta null nos dois. Ler so
# "mono" dava 0% com o som tocando -- foi o bug que ja wolveste aqui.
#
# O wpctl responde com UM numero: "Volume: 0.55". Sem nome de canal, sem
# dB, sem percentil em string, sem duas chaves possiveis. E o mapeamento
# nome -> id vem de `wpctl list audio sinks`, uma chamada so.
#
# O id tambem resolve a escrita. Antes o popup usava pactl para escrever
# porque o wpctl exige numero e a lista trazia nome. Agora a lista traz o
# id, entao leitura e escrita usam a mesma ferramenta.
#
# Fields lidos do pactl, e por que la ainda:
#   - description / node.nick: o nome que a pessoa reconhece. O wpctl
#     mostraria "alsa_output.pci-0000_05_00.6.analog-stereo".
#   - mute: e um bool simples, sem a estrutura quebrada do volume.
#   - state: para saber se o microfone esta em uso.
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


def ids_pipewire(kind):
    """Mapeia nome do no -> id numerico.

    A saida de `wpctl list audio sinks` sao linhas separadas por TAB:
        45< TAB >alsa_output.pci-...< TAB >audio/sink< TAB >*

    O "id" do pactl (o indice de `pactl list sinks`) NAO e este numero:
    o mesmo aparelho aparece como 62 no pactl e 45 no wpctl. Sao duas
    contagens diferentes, e misturar as duas devolve
    "not a valid number".
    """
    out = {}
    raw = run("wpctl", "list", "audio", kind + "s")
    for linha in raw.splitlines():
        partes = linha.split("\t")
        if len(partes) < 3:
            continue
        try:
            ident = int(partes[0])
        except ValueError:
            continue
        out[partes[1]] = ident
    return out


def volume_wpctl(ident):
    """Percentual a partir do id. Um numero, sem nome de canal.

    O wpctl devolve "Volume: 0.55", onde 1.0 e 100%. Acima de 1.0 e o
    ganho extra que o PipeWire aceita, e o painel tambem mostra ate 120.
    """
    if ident is None:
        return 0
    raw = run("wpctl", "get-volume", str(ident))
    if not raw:
        return 0
    bruto = raw.split(":")[-1].strip()
    try:
        return int(round(float(bruto) * 100))
    except ValueError:
        return 0


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
    # O indice do pactl e o id do wpctl sao contagens diferentes. Sem este
    # mapa, o popup escreveria 62 num lugar que so conhece o 45.
    ids = ids_pipewire(kind)
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

        ident = ids.get(name)
        volume = volume_wpctl(ident)

        out.append({
            "name": name,
            # O id do PipeWire. E o que o wpctl aceita nas escritas, e o
            # que dispensa passar nome (que o wpctl nao aceita).
            "id": ident,
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