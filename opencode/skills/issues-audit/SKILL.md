---
name: issues-audit
description: Audita issues de um repositório contra o padrão da equipe (nomeclatura de títulos, hierarquia de subissues, campos do project) — varre, reporta problemas e melhorias por categoria, e corrige sob confirmação (--fix). Use para verificar a saúde do backlog e padronizar issues.
---

# issues-audit — Auditoria do padrão de issues

## Contexto

Convenção da equipe (mesma do skill pr-review):

- `>` significa "sub de" (caminho do módulo). Ex: `Solicitações > Pagamentos`.
- `|` significa novo nível. Ex: `Solicitações > Pagamentos | Ajustar colunas`.
- Hierarquia: Módulo → SubMódulo → Feature → Task/Bug (leaf pode ter subissues).
- Título do filho = título do pai + " | " + descrição (verbo no infinitivo).
- Campos do project: Status (Ready/In progress/In review/Done), Priority (P0/P1/P2),
  Nível (Módulo/Feature/Task/Bug), Size, Sprint, Estimate.
- Idioma: pt-BR. Tom profissional, sem emojis, pontual e objetivo.

## Configuração (obrigatório — ler antes de qualquer comando)

1. Ler `~/.config/opencode/skills/pr-review/projects.json` (config compartilhada com
   o pr-review; NÃO versionada; schema em `projects.example.json`).
2. Se o arquivo não existir, criar a partir do exemplo.
3. Repo não mapeado: auto-detect via `gh project list --owner <org>` (project com o
   mesmo nome do repo).
4. Se não encontrar: PARAR e perguntar ao usuário qual project usar. Nunca chutar.

## Entradas

- `audit <repo>` — relatório de problemas/melhorias, checkpoint.
- `audit <repo> --all` — inclui issues fechadas na varredura.
- `audit <repo> --fix` — relatório + correções com confirmação por categoria.
