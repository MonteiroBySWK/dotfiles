<!-- database-schema -->
**SEMPRE** verifique se o projeto possui `docs/database-schema.md` ou `CLAUDE.md` com seção de schema do banco antes de tomar decisões sobre:
- Criar ou alterar tabelas, colunas, tipos, constraints
- Adicionar FKs, relacionamentos entre entidades
- Escrever queries SQL
- Interpretar tipos do banco (JSONB, NUMERIC, CHAR, ENUMs)

Procure também por scripts como `scripts/db-schema.py` ou `scripts/db-schema.sh` que regeneram a documentação a partir do banco vivo.
<!-- database-schema -->

<!-- testing -->
**Always write tests for new code.** Before implementing anything:
1. Check `CLAUDE.md` for the project's test patterns
2. Write tests alongside implementation
3. Run project's test suite after any changes
4. Fix all test failures before declaring work complete
<!-- testing -->

<!-- context7 -->
Use Context7 MCP to fetch current documentation whenever the user asks about a library, framework, SDK, API, CLI tool, or cloud service -- even well-known ones like React, Next.js, Prisma, Express, Tailwind, Django, or Spring Boot. This includes API syntax, configuration, version migration, library-specific debugging, setup instructions, and CLI tool usage. Use even when you think you know the answer -- your training data may not reflect recent changes. Prefer this over web search for library docs.

Do not use for: refactoring, writing scripts from scratch, debugging business logic, code review, or general programming concepts.

## Steps

1. Always start with `resolve-library-id` using the library name and the user's question, unless the user provides an exact library ID in `/org/project` format
2. Pick the best match (ID format: `/org/project`) by: exact name match, description relevance, code snippet count, source reputation (High/Medium preferred), and benchmark score (higher is better). If results don't look right, try alternate names or queries (e.g., "next.js" not "nextjs", or rephrase the question). Use version-specific IDs when the user mentions a version
3. `query-docs` with the selected library ID and the user's full question (not single words)
4. If you weren't satisfied with the answer, call `query-docs` again for the same library with `researchMode: true`. This retries with sandboxed agents that git-pull the actual source repos plus a live web search, then synthesizes a fresh answer. More costly than the default
5. Answer using the fetched docs
<!-- context7 -->

<!-- memory -->
opencode-mem (plugin nativo, SEM MCP) é o sistema de memória: Turso/libSQL local + embeddings locais, auto-capture em idle (usa o modelo da sessão) e injeção apenas de memórias relevantes.

Use a tool nativa `memory(...)`:
- memory({ mode: "add", content: "..." }) — salvar decisões de projeto, padrões de bug, preferências descobertas no trabalho
- memory({ mode: "search", query: "..." }) — retrieval semântico (scope `project` por padrão)
- memory({ mode: "search", query: "...", scope: "all-projects" }) — cross-projeto
- memory({ mode: "list", limit: 10 }) / memory({ mode: "profile" })

Regra: regras estáveis e sempre-vigentes → AGENTS.md; contexto que cresce do trabalho real → memory (auto-capture cobre). UI web em http://127.0.0.1:4747.
<!-- memory -->

<!-- compression -->
Use `compress` for aggressive context management. It transforms conversation content into dense, high-fidelity technical summaries — this is crystallization, not cleanup.

**When to compress:**
- Research concluded and findings are clear
- Implementation finished and verified
- Exploration exhausted and patterns understood
- Dead-end noise can be discarded

**Do NOT compress if:**
- Raw context is still needed for active edits or precise references
- The content is still in progress
- You may need exact code, error messages, or file contents immediately

**Summary quality:** Be EXHAUSTIVE. Capture file paths, function signatures, decisions, constraints — everything that maintains context integrity. Strip away noise (failed attempts, verbose tool outputs, back-and-forth). What remains should be pure signal.

Evaluate conversation signal-to-noise REGULARLY. Use `compress` deliberately. Prioritize stale content to maintain a high-signal context window.
<!-- compression -->

<!-- reasoning -->
For complex, multi-step problems, structure your reasoning through explicit stages before acting:

1. **Problem definition** — what exactly needs to be solved
2. **Contextual research** — explore the codebase, find relevant patterns
3. **Failure path analysis** — what could go wrong with each approach
4. **Solution synthesis** — design the implementation
5. **Logical conclusion** — execute and verify

If you encounter a contradiction or dead end, use `isRevision: true` to backtrack and reassess premises from earlier steps.

Use branching (`branchFromThought`) to evaluate alternative approaches in parallel — e.g., compare a class-based refactor vs functional, assessing cyclomatic complexity and coupling before selecting the best path.
<!-- reasoning -->

<!-- rtk -->
RTK (Rust Token Killer) is installed and rewrites bash commands automatically via `rtk rewrite` hook. It compresses CLI output before it reaches context — expect ~89% fewer tokens from bash/shell commands. Do not manually pipe commands through `rtk`; the plugin handles it transparently.

Available compact commands (use when you need structured output):
- `rtk git status` — compact status
- `rtk git diff <ref>` — compact diff (changed lines only)
- `rtk git log -n <N>` — one-line log
- `rtk test <cmd>` — show only test failures/summary
- `rtk find <pattern>` — compact tree output
- `rtk read <file>` — smart file filtering
- `rtk ls <dir>` — compact listing
- `rtk deps` — dependency summary
- `rtk summary <cmd>` — 2-line technical summary
<!-- rtk -->

<!-- tokenscope -->
Use `/tokenscope` in the TUI to analyze token usage across the current session. It shows breakdown by category (system, user, tools, assistant), top token consumers per tool, cache efficiency, and estimated costs. Also analyzes subagent sessions recursively.

Run `/tokenscope` when sessions feel bloated or to identify which tools waste the most tokens.
<!-- tokenscope -->

<!-- anti-hallucination -->
**CRITICAL: Never guess about APIs, libraries, framework behavior, or technical facts.** Before any claim about an external API, library method, function signature, or framework behavior:
1. Use **Context7 MCP** (`resolve-library-id` → `query-docs`) for library/API documentation
2. Use **WebSearch** for current version details
3. Use **Read/Grep** to verify code in the actual project

**When you don't know, say "I don't know"** — do not invent plausible-looking but incorrect code, API calls, or configuration. It is better to stop and ask than to generate confident wrong output.

**Cite your sources** — when referencing documentation, imports, or project code, include file paths and line numbers so the user can verify.

**Prefer reading over assuming** — before writing code that calls a function, read its definition/signature in the codebase. Before using a library feature, check how it's used elsewhere in the project.

**Flag uncertainty** — if you're unsure about a technical detail, mark it with `// TODO: verify` in generated code rather than pretending certainty.
<!-- anti-hallucination -->

<!-- verification -->
**Every piece of code must be verified before you declare it done.** After generating or editing code:
1. Run type checking: `npm run typecheck` / `tsc --noEmit` / `cargo check` / equivalent
2. Run lint: `npm run lint` / `ruff check` / equivalent
3. Run tests: `npm test` / `cargo test` / equivalent (at minimum affected tests)
4. If commands are not available, find them — check `package.json` scripts, `Makefile`, `justfile`
5. **Do not skip verification because you're "sure it works"** — unchecked code is unfinished work

**When verification fails:**
1. Read the error message completely
2. Fix the root cause (not just the symptom)
3. Re-run verification
4. Repeat until clean

**Subagent delegation:** For multi-file changes, use the `reviewer` subagent to review your own output before presenting it as final.
<!-- verification -->

<!-- oh-my-opencode-slim -->
oh-my-opencode-slim (OMO-slim) is installed with the opencode-go preset activated.

**Available agents:**
- **orchestrator** — master delegator. Routes tasks to specialists. Default entry point.
- **oracle** — strategic advisor. Architecture decisions, code review, simplification.
- **explorer** — fast codebase reconnaissance. Use for searching, grepping, understanding.
- **librarian** — documentation research. Uses Context7 + WebSearch + GitHub grep.
- **designer** — UI/UX implementation and visual polish.
- **fixer** — implementation specialist. Well-scoped coding tasks.
- **observer** — file/codebase analysis (SEM modelo de visão — nunca rotear imagens para ele).
- **vision** — a ÚNICA lane visual (opencode-go/gpt-5.6-luna): screenshots da tela, prints de bug repassados, páginas via playwright MCP; permissões read+bash apenas, não lê codebase.

**Agent model mapping (opencode-go preset, Spark-consolidado 2026-09-09):** tudo que pensa e executa em `muse-spark-1.3-contributor` — orchestrator medium (skills/mcps []), oracle xhigh, fixer xhigh, librarian low, reviewer medium, main default. Recon/visão/compaction no barato: explorer/observer `mimo-v2.5` low, designer `mimo-v2.5` medium, `vision` `gpt-5.6-luna` low, small_model `mimo-v2.5-low` (alias local). Motivo (uso real 09-09): M3 gastou $2.76 com resultado fraco; Flash $1.36 recorrente (reviewer+compaction); Spark $1.63 na maior cota ($60, 2.7%) com a melhor qualidade. Flash zerado; M3 fora. Contributor treina com dados + 100 RPM — não usar p/ código proprietário sensível.

Use agents explicitly: `@oracle review this architecture` or `@explorer find the auth logic`.

For heavy coding sessions requiring planning: use `/deepwork`.
For workflow improvement analysis: use `/reflect`.
<!-- oh-my-opencode-slim -->

<!-- research-before-loop -->
Quando uma investigação entra em loop (3+ tentativas sem progresso, erro que "não faz
sentido" diante da evidência, ou sessão longa num problema aparentemente sem solução):
PARE de tentar variações e PESQUISE com fim de aprendizado — docs oficiais (Context7/
WebFetch), changelog do fornecedor e casos reais (WebSearch/GitHub). A causa raiz
frequentemente é uma mudança externa (formato novo, default novo, depreciação) que
nenhuma variação local alcança. Exemplo canônico (03/10/2026): STS negando assume-role
com trust "correta" — era o subject imutável do GitHub OIDC (repos pós-15/07/2026),
descoberto no changelog, não no código. Registre a lição onde ela vive (repo/atlas).
<!-- research-before-loop -->

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- If graphify-out/graph.json does not exist, run `graphify update .` (AST-only, no API cost) to generate it before answering codebase questions.
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
