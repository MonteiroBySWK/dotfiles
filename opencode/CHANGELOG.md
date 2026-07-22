# OpenCode Config Changelog

## 2026-07-22 — Configuration Overhaul

### DCP (Dynamic Context Pruning) — `dcp.jsonc`

**Problemas resolvidos:**
- Contexto fixo em 100k tokens causava compressão prematura no deepseek-v4-flash (128k+)
- `purgeErrors` removia tool calls com erro após 4 turns, perdendo contexto útil
- `deduplication` mesclava chamadas distintas, removendo contexto relevante
- Tags e mensagens do usuário não eram protegidas contra compressão

**Mudanças:**
- `maxContextLimit`: `"85%"` — usa % do contexto real do modelo
- `minContextLimit`: `"45%"` — desliga nudges abaixo disso
- `nudgeFrequency`: 10 — menos intrusivo que default 5
- `protectTags: true` — protege tags XML da compressão
- `protectUserMessages: true` — não comprime mensagens do usuário
- `purgeErrors: disabled` — para de remover histórico de erros
- `deduplication: disabled` — para de mesclar tool calls similares

### OpenCode Core — `opencode.json`

**Problemas resolvidos:**
- Dupla compressão: compaction nativo + DCP comprimiam o mesmo contexto
- `small_model` igual ao modelo grande (desperdício de tokens)
- `tool_output` limitado a 4KB/150 linhas forçava o modelo a adivinhar resultados
- `opencode-notify` quebrava no Wayland/Hyprland (xdotool X11-only)

**Mudanças:**
- `compaction.auto: false` — desliga compressão nativa, só DCP gerencia
- `small_model: opencode/north-mini-code-free` — modelo leve para explorer/librarian
- `tool_output.max_bytes: 65536` — de 4KB para 65KB
- `tool_output.max_lines: 2000` — de 150 para 2000 linhas
- Removido `opencode-notify` da lista de plugins (quebrado no Wayland)

### Anti-Hallucination Rules — `oh-my-opencode-slim/orchestrator_append.md`

**Problemas resolvidos:**
- Modelo inferia APIs sem verificar documentação
- Perguntas em loop acumulavam contexto
- Citações sem evidência (arquivo:linha)

**Adicionado:** 8 regras obrigatórias:
1. Nunca inferir APIs — pesquisar sempre
2. Pesquisar antes de gerar código
3. Citar evidências (arquivo:linha)
4. Perguntas one-shot (uma por turno)
5. Não repetir perguntas já respondidas
6. Ler outputs completos antes de agir
7. Marcar incerteza com `SUSPICIOUS`
8. Usar research tools por padrão

### Graphify — Knowledge Graph

**Adicionado:** `graphifyy v0.9.25`
- Plugin em `.opencode/plugins/graphify.js`
- Skill em `skills/graphify/SKILL.md`
- Seção `## graphify` em `AGENTS.md`
- Grafo inicial construído: 826 nós, 1468 arestas, 66 comunidades
- Uso: `/graphify .` para construir, `graphify query "..."` para consultar

### TUI — Subagent Statusline

**Adicionado:** `@devinoldenburg/opencode-subagent-statusline` em `tui.json`
- Sidebar com status de subagentes: `>` running, `+` done, `!` error
- Footer compacto: `1 running | 1 done | 0 error | 2 total`
- Tempo decorrido por subagente
- `Alt+B` para focar sidebar, `j`/`k` para navegar

### SQLite Database

- WAL checkpoint reduzido de 404MB para 688KB
- Stale database de 0 bytes removido (`~/.config/opencode/opencode.db`)
- DB principal em `~/.local/share/opencode/opencode.db` (4.7GB, integrity ok)
