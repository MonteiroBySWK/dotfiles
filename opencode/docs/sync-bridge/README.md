# Ponte opencode ↔ Claude Code

Ponte via arquivo. Sem MCP compartilhado, sem store unificado.

## 1. Camada instruções

- Canônico global: `/home/monteiro/.config/opencode/AGENTS.md` (175 linhas, NÃO editar).
- Projeto opencode: `<repo>/AGENTS.md` — header "canônico do projeto, importa global via referência" + seção Projeto.
- Projeto Claude: `<repo>/CLAUDE.md` — conteúdo mínimo: `@AGENTS.md` + linha de deltas.
- Global Claude `/home/monteiro/.claude/CLAUDE.md` já importa `@RTK.md` + `@/home/monteiro/.config/opencode/AGENTS.md` (NÃO editar, já certo).
- Regra: regra estável nova vai no AGENTS.md do projeto; shim CLAUDE.md só referencia, nunca duplica.

## 2. Camada memória

- opencode: `opencode-mem` NATIVO (Turso/libSQL local, sem MCP). `opencode.json` tem `mcp.memory enabled:false`.
- Claude: `settings.json` tem `mcpServers.memory` com `npx @modelcontextprotocol/server-memory` ATIVO.
- Backends incompatíveis → NÃO unificar stores. Ponte de memória = `.ai/handoff.md` no repo.
- Paridade de sintaxe MCP:

| opencode (`opencode.json`) | Claude (`settings.json` / `.mcp.json`) |
| -------------------------- | -------------------------------------- |
| `"mcp": { "<nome>": { "type": "local", "command": [...], "enabled": true } }` | `"mcpServers": { "<nome>": { "command": "...", "args": [...] } }` |
| chave `mcp` no singular | chave `mcpServers` no plural |
| `enabled: false` p/ desligar | ausência do bloco = desligado |

## 3. Camada sessão

Regra de segurança: **commit ou `git stash -u` antes de trocar; nunca os dois ao mesmo tempo** (sessões opencode e Claude no mesmo repo em paralelo divergem o working tree).

### Workflow A — opencode → Claude

1. No opencode: `/handoff` (gera `.ai/handoff.md` a partir do template + cola `git status --short && git diff --stat`).
2. `git add .ai/handoff.md && git commit -m "chore: handoff opencode->claude"` (ou stash se WIP sujo).
3. No Claude: leia `.ai/handoff.md`, confira `git status --short`, retome pelos Próximos passos.

### Workflow B — Claude → opencode

1. No Claude: `/handoff` (skill `handoff`, mesma estrutura, mesmo template absoluto).
2. Commit/stash como acima (`chore: handoff claude->opencode`).
3. No opencode: `opencode --continue` + leia `.ai/handoff.md`, confira git, retome.

## Paths reais

- Template: `/home/monteiro/.config/opencode/docs/sync-bridge/handoff-template.md`
- Comando opencode: `/home/monteiro/.config/opencode/commands/handoff.md`
- Skill Claude: `/home/monteiro/.claude/skills/handoff/SKILL.md`
- Init: `/home/monteiro/.config/opencode/scripts/init-bridge.sh [repo-path]`
- Handoff no repo: `<repo>/.ai/handoff.md`
- Retomar: `opencode --continue` / `claude --resume` · exportar: `opencode export [session]` / `/export`
