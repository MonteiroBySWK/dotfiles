---
name: pr-review
description: Revisa pull requests do GitHub com gh cli em duas fases — review (análise estruturada com checkpoint) e comment (comentários inline nos bloqueantes + criação de issues no padrão do projeto, com prioridade, parent, nível e assignee corretos, incluindo modo fast-track). Use para revisar PRs, comentar problemas na linha exata e criar issues de follow-up sem tentativa-e-erro de query.
---

# pr-review — Revisão de PRs

## Contexto

Fluxo da equipe: revisão de PRs no GitHub com issues gerenciadas no GitHub Project
(org thera-org). Convenção de issues: hierarquia por títulos e subissues.

- `>` significa "sub de" (caminho do módulo). Ex: `Solicitações > Pagamentos`.
- `|` significa novo nível. Ex: `Solicitações > Pagamentos | Ajustar colunas`.
- Hierarquia: Módulo → SubMódulo → Feature → Task/Bug (leaf pode ter subissues Task/Bug).
- Campos do project: Status (Ready/In progress/In review/Done), Priority (P0/P1/P2),
  Nível (Módulo/Feature/Task/Bug), Size, Sprint, Estimate.
- Idioma: pt-BR. Tom profissional, sem emojis, pontual e objetivo.

## Configuração (obrigatório — ler antes de qualquer comando)

1. Ler `~/.config/opencode/skills/pr-review/projects.json` (mapeia `owner/repo` → project).
2. Determinar o repo atual (git remote origin) e o PR a revisar.
3. Se o repo está mapeado, usar o project do config.
4. Se não está: auto-detect via `gh project list --owner <org>` buscando project com o
   mesmo nome do repo.
5. Se não encontrar: PARAR e perguntar ao usuário qual project usar. Nunca chutar.

## Entradas

- `review <PR>` — Fase A: análise estruturada, relatório no chat, checkpoint.
- `comment <PR>` — Fase B: aplicar comentários e criar issues (modo normal).
- `comment <PR> --fast-track` — Fase B: tudo vira issue (sem comentários inline).
