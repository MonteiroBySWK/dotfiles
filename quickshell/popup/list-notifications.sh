#!/usr/bin/env bash
# Lista as notificacoes do mako em JSON, para o painel do quickshell.
#
# Por que o mako e nao o servico nativo do quickshell: o mako ja e o dono
# de org.freedesktop.Notifications nesta maquina, e ele faz o OSD de volume
# e brilho. Se o quickshell registrasse o servico nativo daria conflito e o
# mako perderia o OSD. Entao o quickshell aqui e um CLIENTE do mako.
#
# Uso do Gio e nao do gdbus de linha de comando: a saida do gdbus e GVariant
# impresso como texto (parecido com Python, com <...> em volta de cada
# valor), e parsear isso com regex e fragil. O Gio ja traz o valor tipado.
#
#   list-notifications.sh            historico completo
#   list-notifications.sh --ativas   so o que esta em tela
set -u

METODO="ListHistory"
[ "${1:-}" = "--ativas" ] && METODO="ListNotifications"

exec python3 - "$METODO" <<'PY'
import json
import sys

try:
    import gi
    gi.require_version("Gio", "2.0")
    from gi.repository import Gio
except Exception as e:
    print(json.dumps({"notificacoes": [], "erro": "sem Gio: %s" % e}))
    raise SystemExit

metodo = sys.argv[1]

try:
    proxy = Gio.DBusProxy.new_for_bus_sync(
        Gio.BusType.SESSION,
        Gio.DBusProxyFlags.NONE,
        None,
        "org.freedesktop.Notifications",
        "/fr/emersion/Mako",
        "fr.emersion.Mako",
        None,
    )
except Exception as e:
    # Sem mako no ar a lista vazia e um estado legitimo, nao um erro.
    print(json.dumps({"notificacoes": [], "erro": "mako inacessivel: %s" % e}))
    raise SystemExit

try:
    replied = proxy.call_sync(metodo, None, Gio.DBusCallFlags.NONE, 2000, None)
    dados = replied.unpack()[0]
except Exception as e:
    print(json.dumps({"notificacoes": [], "erro": "%s: %s" % (metodo, e)}))
    raise SystemExit

saida = []
for n in dados or []:
    def campo(chave, padrao=""):
        v = n.get(chave, padrao)
        if v is None:
            return padrao
        return v if isinstance(v, str) else str(v)

    saida.append({
        "id": int(n.get("id", 0) or 0),
        "appName": campo("app-name"),
        "appIcon": campo("app-icon"),
        "resumo": campo("summary"),
        "corpo": campo("body"),
        "urgencia": int(n.get("urgency", 0) or 0),
        # O mako entrega as acoes como {"default": "Mostrar"}.
        "acoes": [{"id": str(k), "texto": str(v)}
                  for k, v in (n.get("actions") or {}).items()],
    })

print(json.dumps({"notificacoes": saida}, ensure_ascii=False))
PY