# Design — Skill global `issues-audit`

Data: 2026-08-09
Status: aprovado pelo usuário durante brainstorm

## Contexto

A equipe gerencia issues no GitHub Project com uma convenção própria (Módulo →
SubMódulo → Feature → Task/Bug; `>` = "sub de", `|` = novo nível; título do filho =
título do pai + " | " + descrição). Na prática o padrão é violado com frequência
(issues órfãs, campos não preenchidos, títulos fora da convenção). O usuário quer
uma varredura automatizada que aponte problemas e melhorias.

Skill irmão: `pr-review` (mesmo fluxo de config e mutações verificadas).

## Estrutura do skill

```
~/.config/opencode/skills/issues-audit/SKILL.md
```

- Config: REUSA `~/.config/opencode/skills/pr-review/projects.json` (fonte única;
  não versionado; schema em `projects.example.json`). Se ausente, criar a partir do
  exemplo seguindo as mesmas regras de auto-detect do pr-review.
- Idiomas: pt-BR. Tom profissional, sem emojis, pontual e objetivo.
- Entradas: `audit <repo>` (relatório, checkpoint) e `audit <repo> --fix`
  (correções com confirmação). Flag `--all` inclui issues fechadas na varredura.

## Fase report (padrão)

1. Determinar repo/project via config (mesmas regras do pr-review).
2. Buscar via GraphQL paginada: issues abertas do repo (ou todas com --all) com
   projectItems (Status/Priority/Nível) e parent/subIssues.
3. Executar os checks em 4 categorias:
   - **Nomeclatura**: leaf (Nível Task/Bug) sem " | " no título; última parte do
     título que não começa com verbo no infinitivo; ">" após o primeiro " | "
     (separador fora do caminho do módulo); segmentos de título sem capitalização.
   - **Hierarquia**: Task/Bug órfã (sem parent) — problema; contêiner sem filhos —
     informativo; título do filho que não começa com título do pai + " | " —
     problema; Nível inconsistente com a profundidade — soft/informativo.
   - **Campos**: Priority ausente, Nível ausente, Status ausente, Assignee ausente
     (em leaves abertas) — problema.
   - **Duplicatas/estado**: títulos duplicados (normalizados) — problema; parent
     fechado com filhos abertos — problema; filho fechado com parent aberto —
     informativo.
4. Relatório agrupado por categoria: `#N | título | problema | sugestão` + seção
   SUGESTOES (melhorias, ex: view da board filtrando Nível = Task/Bug).
5. Checkpoint: PARAR. Nunca corrige sem `--fix`.

## Fase --fix (com confirmação)

- Por categoria: apresentar a lista de alterações propostas -> aguardar confirmação
  do usuário -> aplicar.
- Mutações verificadas (mesmas do pr-review + updateIssue):
  - `updateIssue` (id, title, assigneeIds, state) para título/assignee/reabrir/fechar.
  - `updateProjectV2ItemFieldValue` para Status/Priority/Nível (single-select).
  - `addSubIssue` para vincular parent.
  - `addAssigneesToAssignable` fallback para assignee.
- Ações destrutivas (fechar/reabrir issue, mover issue de project): confirmação
  item a item, nunca em lote.

## Regras de falha

Idênticas ao pr-review: sem auth/permissão -> PARAR e informar; erro de GraphQL ->
reportar erro literal e reexecutar com IDs conferidos; resumo final das ações.
