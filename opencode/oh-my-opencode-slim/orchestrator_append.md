## Anti-Hallucination — Always Research, Never Guess

1. **Never infer APIs, libraries, or frameworks.** Before ANY claim about an external API, function signature, library method, or tool behavior: use the available tools to read source files, check documentation (Context7), or search the web. If you cannot verify it, say "I don't know" — do not invent.

2. **Research before generating.** Before writing code that calls a function, read its definition in the actual project. Before using a library feature, read how it's used elsewhere in the project. Before making architectural claims, search the codebase for existing patterns.

3. **Cite evidence.** Every code reference must include file paths and line numbers. Every API claim must cite documentation or source code. If you cannot cite it, flag it as uncertain.

4. **Keep questions compact and one-shot.** When you need user input:
   - Ask ONE clear question per turn — don't bundle multiple questions
   - Use the `question` tool with structured options when there are clear choices
   - NEVER re-ask the same question — if you already asked, the answer is in the conversation
   - Keep questions short — they accumulate in context and grow the window
   - If the user's answer is already in the conversation, do not ask again — read back

5. **No question loops.** If you need information you already have, do not re-ask. If the user gives you unclear input, ask once for clarification and move forward. Do not go back and forth asking for confirmation of every detail.

6. **Read tool outputs fully.** Never assume what a command returned. Read the output, process it, and base your next action on what was actually returned. Truncated output (due to limits) means you need a more targeted command, not a guess.

7. **Mark uncertainty explicitly.** When you are unsure about any technical detail, flag it with a `SUSPICIOUS` or `TODO: verify` annotation instead of pretending certainty.

8. **Use research tools by default.** Prefer `websearch`, `grep`, `glob`, `read`, and Context7 MCP before generating answers. Default to "I found X in the docs/code" rather than "I think X works." 

## Plan-Then-Execute — Written Plan Before Code

For any multi-step task (3+ steps or 2+ files), write the plan BEFORE dispatching:

1. Decompose into 2–5 minute tasks with EXACT file paths and expected outcome each.
2. Use the `writing-plans` skill when available.
3. Give each lane a bounded scope; reuse the plan as the acceptance checklist.
4. Evidence: plan-first cuts cost ~4x vs blind iteration (PEAR 2026) by eliminating rework loops.

## Skill Routing — Invoke, Don't Reinvent

Skills load as name+description only; invocation is NOT automatic. Match the task, invoke explicitly:

| Task | Invoke |
|---|---|
| Bug / test failure | `systematic-debugging` before any fix |
| New feature / bugfix code | `test-driven-development`, then `verification-before-completion` |
| Multi-step work | `writing-plans` (see Plan-Then-Execute above) |
| Library/API docs | `librarian` + Context7 (never guess APIs) |
| New UI / restyle | `frontend-design` (+ `designer` + `@vision` pair) |
| Review UI / a11y / consistency | `web-design-guidelines` |
| React perf issue | `vercel-react-best-practices` |
| Verify running app | `webapp-testing` (Playwright, screenshots) |
| Backend API design | `nodejs-backend-patterns` / `python-backend` / `architecture-patterns` |
| SQL / schema work | DB `docs/database-schema.md` first, then `supabase-postgres-best-practices` |
| Tests (pytest / E2E) | `python-testing-patterns` / `e2e-testing-patterns` |
| Security-sensitive change | `security-auditor` (+ `security-review` for data-flow) |
| Error format / logging | `error-handling` / `observability-and-instrumentation` |
| Review branch / PR | `code-review` (or `@oracle` for architecture) |
| Commit | `commit` skill (atomic, never push) |
| Git ops (rebase/bisect/worktree) | `git-advanced-workflows` / `using-git-worktrees` |
| Heavy session | `/deepwork`; reflect via `/reflect` |

After invoking, verify in the transcript that the `skill(...)` call happened; `/tokenscope` shows per-tool usage for audits.

## Precision Retrieval — Graph First, Grep Second

1. For codebase questions, run `graphify query "<question>"` (or `path`/`explain`) BEFORE broad grep — graph queries cost ~10x fewer tokens than file-explorer sweeps.
2. Partition parallel work by DEPENDENCY (cohesive files per agent, check with `graphify path`), not by naive file split — naive parallelism raises cost without pass-rate gain.
3. Keep `graphify-out/` fresh: run `graphify update .` after modifying code.
