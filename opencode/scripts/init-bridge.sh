#!/usr/bin/env bash
# init-bridge.sh — ponte opencode ↔ Claude Code por repo. Idempotente: nunca sobrescreve sem backup .bak.
set -euo pipefail

REPO="${1:-$(pwd)}"
TEMPLATE="/home/monteiro/.config/opencode/docs/sync-bridge/handoff-template.md"

if [ ! -d "$REPO/.git" ]; then
  echo "ERRO: $REPO não é repo git (.git ausente). Abortando." >&2
  exit 1
fi
if [ ! -f "$TEMPLATE" ]; then
  echo "ERRO: template ausente: $TEMPLATE" >&2
  exit 1
fi

backup_if_exists() {
  local f="$1"
  if [ -f "$f" ]; then
    echo "SKIP (existe, backup em $f.bak): $f"
    cp -f "$f" "$f.bak"
    return 0
  fi
  return 1
}

mkdir -p "$REPO/.ai"

# 1. AGENTS.md do projeto (só se ausente)
if ! backup_if_exists "$REPO/AGENTS.md"; then
cat > "$REPO/AGENTS.md" <<'EOF'
# AGENTS.md — canônico do projeto, importa global via referência

Global: `/home/monteiro/.config/opencode/AGENTS.md` (regras estáveis, NÃO duplicar aqui).

## Projeto

- Stack:
- Como rodar:
- Como testar:
- Convenções:
EOF
  echo "CREATED: $REPO/AGENTS.md"
fi

# 2. CLAUDE.md shim (só se ausente)
if ! backup_if_exists "$REPO/CLAUDE.md"; then
cat > "$REPO/CLAUDE.md" <<'EOF'
@AGENTS.md

Deltas Claude-only (regras que só valem no Claude Code; o resto vive no AGENTS.md do projeto):
- (nenhum por enquanto)
EOF
  echo "CREATED: $REPO/CLAUDE.md"
fi

# 3. .ai/handoff.md (sempre a partir do template se ausente; se existe, backup + manter)
if [ -f "$REPO/.ai/handoff.md" ]; then
  cp -f "$REPO/.ai/handoff.md" "$REPO/.ai/handoff.md.bak"
  echo "SKIP (existe, backup em .ai/handoff.md.bak): $REPO/.ai/handoff.md"
else
  cp -f "$TEMPLATE" "$REPO/.ai/handoff.md"
  echo "CREATED: $REPO/.ai/handoff.md (do template)"
fi

# 4. .mcp.json (só se ausente; sintaxe Claude mcpServers, placeholders)
if ! backup_if_exists "$REPO/.mcp.json"; then
cat > "$REPO/.mcp.json" <<'EOF'
{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    },
    "example-local": {
      "command": "npx",
      "args": ["-y", "<seu-pacote-mcp>", "--port", "PORTA"]
    }
  }
}
EOF
  echo "CREATED: $REPO/.mcp.json"
fi

echo "OK: bridge pronta em $REPO (nada sobrescrito sem .bak)."
