# Skill Global `issues-audit` — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar o skill global `issues-audit` em `~/.config/opencode/skills/issues-audit/SKILL.md` que varre issues de um repo contra o padrão da equipe (nomeclatura, hierarquia, campos, duplicatas), reporta em categorias com checkpoint e corrige sob confirmação (`--fix`).

**Architecture:** Skill de prompt único (SKILL.md). Reusa o `projects.json` do pr-review (fonte única de config) e as mesmas mutações GraphQL já verificadas de ponta a ponta (teste real #395). Varredura via GraphQL paginada com projectItems + parent/subIssues.

**Tech Stack:** gh CLI 2.x, GitHub GraphQL API, OpenCode skill (frontmatter YAML + Markdown).

**Spec:** `opencode/docs/superpowers/specs/2026-08-09-issues-audit-skill-design.md` (commitado).

---

### Task 1: Estrutura + frontmatter + contexto + config

**Files:**
- Create: `~/.config/opencode/skills/issues-audit/SKILL.md`

- [ ] **Step 1: Escrever frontmatter e seções iniciais**

Criar `~/.config/opencode/skills/issues-audit/SKILL.md`:

````markdown
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
````

- [ ] **Step 2: Validar frontmatter**

Run: `python3 -c "import yaml; yaml.safe_load(open('/home/monteiro/.config/opencode/skills/issues-audit/SKILL.md').read().split('---')[1]); print('ok')"`
Expected: `ok`

- [ ] **Step 3: Commit**

```bash
cd ~/.config
git add opencode/skills/issues-audit/SKILL.md
git commit -m "feat: skill issues-audit - frontmatter, contexto e config"
```

---

### Task 2: Fase report — varredura, checks e formato de relatório

**Files:**
- Modify: `~/.config/opencode/skills/issues-audit/SKILL.md` (append)

- [ ] **Step 1: Adicionar seção de varredura**

Append:

````markdown
## Fase report — audit <repo>

### Passos

1. Determinar repo/project (seção Configuração).
2. Buscar issues (paginar com `after: "$endCursor"` até esgotar):

```graphql
query {
  repository(owner: "OWNER", name: "REPO") {
    issues(first: 100, states: OPEN) {
      nodes {
        number
        title
        closed
        projectItems(first: 3) {
          nodes {
            fieldValues(first: 15) {
              nodes {
                ... on ProjectV2ItemFieldSingleSelectValue {
                  name
                  field { ... on ProjectV2FieldCommon { name } }
                }
              }
            }
          }
        }
        parent { number title closed }
        subIssues(first: 5) { nodes { number title } }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
}
```

   Para `--all`, usar `states: [OPEN, CLOSED]`.

3. Aplicar os checks (4 categorias):

**Nomeclatura** (leaf = Nível Task/Bug):
- Leaf sem " | " no título → problema (deveria ser `pai | descrição`)
- Última parte do título não começa com verbo no infinitivo → problema suave
- ">" aparecendo após o primeiro " | " → problema (separador fora do caminho do módulo)
- Segmentos de título sem capitalização inicial → problema suave

**Hierarquia**:
- Task/Bug sem parent → problema (leaf órfã)
- Contêiner (Nível Módulo/Feature) sem subissues → informativo (vazio)
- Título do filho que não começa com título do pai + " | " → problema (mismatch)
- Nível inconsistente com profundidade (ex: Nível=Módulo em título com 2+ níveis
  além do caminho de módulo) → informativo (dado histórico inconsistente)

**Campos** (em leaves abertas):
- Priority ausente → problema
- Nível ausente → problema
- Status ausente → problema
- Assignee ausente → problema (dev responsável)

**Duplicatas/estado**:
- Títulos iguais após normalização (trim + minúsculas) → problema
- Parent fechado com filhos abertos → problema
- Filho fechado com parent aberto → informativo

4. Reportar no chat agrupado por categoria:

```
## NOMENCLATURA
#123 | Título | problema | sugestão
...
## HIERARQUIA
...
## CAMPOS
...
## DUPLICATAS/ESTADO
...
## SUGESTOES
- melhorias (ex: view da board com filtro Nível = Task/Bug)
```

Sem emojis. Se a categoria não tiver problemas, omitir a seção (ou "OK").

### Checkpoint obrigatório

Fim do relatório: PARAR o turno. NUNCA aplicar correção sem `--fix`.
````

- [ ] **Step 2: Validar a query de varredura (read-only) na org real**

Run a query para thera-org/arbitrium com as mesmas seleções (owner/name reais) e
conferir: retorna issues com `parent`/`subIssues`/`closed` e `fieldValues` com
Status/Priority/Nível.
Expected: JSON com os campos presentes.

- [ ] **Step 3: Commit**

```bash
cd ~/.config
git add opencode/skills/issues-audit/SKILL.md
git commit -m "feat: skill issues-audit - fase report (varredura e checks)"
```

---

### Task 3: Fase --fix — correções com confirmação

**Files:**
- Modify: `~/.config/opencode/skills/issues-audit/SKILL.md` (append)

- [ ] **Step 1: Adicionar a seção --fix**

Append:

````markdown
## Fase --fix — audit <repo> --fix

Após gerar o relatório, para CADA categoria com problemas:

1. Apresentar a lista de alterações propostas (issue, campo atual → campo novo).
2. Aguardar confirmação do usuário (uma confirmação por categoria).
3. Aplicar e verificar via API cada alteração.

### Mutações (comandos verificados — não improvisar)

Lookup de IDs (project, fields, options) e interpretação: ver seção
"Mutações (comandos verificados)" do skill pr-review — os IDs do project são os
mesmos para os dois skills.

**Título / assignee / estado** (updateIssue):

```graphql
mutation {
  updateIssue(input: { id: "ISSUE_ID", title: "NOVO_TITULO" }) {
    issue { number title }
  }
}
```

- `ISSUE_ID`: `gh api repos/OWNER/REPO/issues/N --jq .node_id`
- assignee: `assigneeIds: ["ID_AUTOR"]` (id via `gh api repos/OWNER/REPO/issues/N --jq '.assignees[0].id'` do autor)
- estado: `state: CLOSED` ou `state: OPEN` (somente com confirmação item a item)

**Status/Priority/Nível** (updateProjectV2ItemFieldValue):

```graphql
mutation {
  updateProjectV2ItemFieldValue(input: {
    projectId: "PROJECT_ID"
    itemId: "ITEM_ID"
    fieldId: "FIELD_ID"
    value: { singleSelectOptionId: "OPTION_ID" }
  }) { projectV2Item { id } }
}
```

- `ITEM_ID`: query `issue(number: N) { projectItems(first: 5) { nodes { id } } }`
- field/option IDs: lookup do pr-review (Status/Priority/Nível + options)

**Parent** (addSubIssue):

```graphql
mutation {
  addSubIssue(input: { issueId: "PARENT_ID", subIssueId: "ISSUE_ID" }) {
    issue { number }
  }
}
```

**Assignee fallback**: `addAssigneesToAssignable(input: { assignableId: "ISSUE_ID", assigneeIds: ["AUTHOR_ID"] })`.

### Regras do --fix

- Ações destrutivas (fechar/reabrir, mover de project): confirmação ITEM A ITEM,
  nunca em lote.
- Renomear título: sempre derivar do parent real (`pai + " | " + descrição`).
- Se a correção proposta mudar a hierarquia (criar contêiner), seguir a regra de
  parent do pr-review: perguntar antes de criar módulo/feature novo.
- Ao final: resumo das alterações aplicadas (issue, campo, de → para) + verificação
  via API de cada uma.

## Regras de falha

- Sem auth `gh` ou sem permissão: PARAR e informar. Nunca contornar.
- Erro de GraphQL: reportar o erro literal; conferir IDs no lookup; reexecutar.
- Fase report nunca corrige; --fix nunca roda sem o relatório ter sido mostrado.

## Fim do skill
````

- [ ] **Step 2: Commit**

```bash
cd ~/.config
git add opencode/skills/issues-audit/SKILL.md
git commit -m "feat: skill issues-audit - fase fix com confirmacao"
```

---

### Task 4: Validação integrada — dry-run do audit em arbitrium

**Files:**
- Read-only: `~/.config/opencode/skills/issues-audit/SKILL.md`

- [ ] **Step 1: Rodar o fluxo report completo em thera-org/arbitrium (sem alterar nada)**

Executar: config (ler projects.json), varredura (query paginada — todas as abertas),
aplicar os 4 grupos de checks e montar o relatório no formato do skill.
Mostrar ao usuário o relatório para conferência.

- [ ] **Step 2: Confirmar que nada foi alterado**

Verificar: `gh api repos/thera-org/arbitrium/issues/395 --jq .title` (teste fechado
da sessão anterior) inalterado; nenhuma mutation executada.

- [ ] **Step 3: Commit final (ajustes, se houver)**

```bash
cd ~/.config
git add -A opencode/skills/issues-audit/ opencode/docs/superpowers/
git commit -m "chore: skill issues-audit - ajustes pos validacao" 2>/dev/null || true
```
