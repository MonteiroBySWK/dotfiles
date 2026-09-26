#!/usr/bin/env bash
# go-key: mostra/alterna a credential ativa do provider opencode-go.
# Uso: go-key.sh status | list | switch <label>
set -euo pipefail
DB="${OPENCODE_DB:-$HOME/.local/share/opencode/opencode.db}"

cmd="${1:-status}"
case "$cmd" in
  status)
    # label|active — active=1 é a que está valendo
    sqlite3 "$DB" "SELECT label, active FROM credential WHERE integration_id='opencode-go';"
    ;;
  list)
    opencode auth list | grep -i "opencode go" || true
    ;;
  switch)
    label="${2:-}"
    if [ -z "$label" ]; then
      echo "uso: go-key.sh switch <label>" >&2
      exit 1
    fi
    opencode auth switch opencode-go "$label"
    sqlite3 "$DB" "SELECT label, active FROM credential WHERE integration_id='opencode-go';"
    ;;
  *)
    echo "uso: go-key.sh status | list | switch <label>" >&2
    exit 1
    ;;
esac
