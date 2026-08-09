# Skill Global `pr-review` — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar o skill global `pr-review` em `~/.config/opencode/skills/pr-review/` com duas fases — `review <PR>` (análise estruturada com checkpoint) e `comment <PR> [--fast-track]` (comentários inline + criação de issues no padrão do GitHub Project da equipe, com todos os campos preenchidos).

**Architecture:** Skill de prompt (SKILL.md) + config JSON (`projects.json`). O skill instrui o agente a executar comandos `gh`/GraphQL verificados (lookup de field IDs, `createIssue` com `parentIssueId`/`projectV2Ids`/`assigneeIds`, `updateProjectV2ItemFieldValue`, REST de comentários inline) sem tentativa-e-erro em runtime. Fase A termina em checkpoint obrigatório (nunca comenta/cria sem comando explícito).

**Tech Stack:** gh CLI 2.x, GitHub GraphQL API (mutações Projects v2 / subissues), GitHub REST (comentários inline de PR), OpenCode skill (frontmatter YAML + Markdown), JSON.

**Spec:** `opencode/docs/superpowers/specs/2026-08-09-pr-review-skill-design.md` (commitado).

---

## Dados verificados (já validados contra a org real — base para os comandos do skill)

- Project arbitrium: node ID `PVT_kwDODD2IfM4BRbmZ` (org thera-org, project number 8).
- Repo arbitrium: node ID `R_kgDOQhT-zA` (obter sempre via `gh api repos/{owner}/{repo} --jq .node_id`).
- Campos do project arbitrium: Status (Ready/In progress/In review/Done), Priority (P0/P1/P2), Nível (Módulo/Feature/Task/Bug), Size, Sprint, Estimate, datas.
- `CreateIssueInput` (introspection): `repositoryId` (ID!), `title` (String!), `body`, `assigneeIds` (LIST), `projectV2Ids` (LIST), `parentIssueId` (ID), `milestoneId`, `labelIds`.
- `AddSubIssueInput`: `issueId` (ID!), `subIssueId`, `subIssueUrl`, `replaceParent`.
- `AddProjectV2ItemByIdInput`: `projectId` (ID!), `contentId` (ID!).
- `UpdateProjectV2ItemFieldValueInput`: `projectId`, `itemId`, `fieldId` (todos ID!), `value` (ProjectV2FieldValue!).
- `ProjectV2FieldValue` aceita: `text`, `number`, `date`, `singleSelectOptionId` (String), `multiSelectOptionIds`, `iterationId`.
- `AddAssigneesToAssignableInput`: `assignableId` (ID!), `assigneeIds` (LIST).
- Autor da PR: `gh pr view N --json author --jq .author.id` retorna o GraphQL ID (ex: `U_kgDOB7UF8g`).
- Head commit para comentário inline: `gh pr view N --json headRefOid --jq .headRefOid`.
- PRs abertos em arbitrium (para validação final): #374 "Feature/arb 373 obras filter", #389, #387, #379, #376, #353, #349.

## File Structure

| Arquivo | Responsabilidade |
|---|---|
| `~/.config/opencode/skills/pr-review/SKILL.md` | O skill: frontmatter, fases, regras, comandos verificados, checklist |
| `~/.config/opencode/skills/pr-review/projects.json` | Mapa `owner/repo` → `{owner, projectNumber}`; seed com arbitrium |
| `~/.config/opencode/docs/superpowers/plans/2026-08-09-pr-review-skill.md` | Este plano (commitado) |
| `~/.config/opencode/docs/superpowers/specs/2026-08-09-pr-review-skill-design.md` | Spec aprovado (já commitado) |

Nota: mudança de 2 arquivos novos fora de codebase — worktree não é necessário.

---

### Task 1: Estrutura do diretório + `projects.json`

**Files:**
- Create: `~/.config/opencode/skills/pr-review/projects.json`

- [ ] **Step 1: Criar diretório e arquivo de config**

```bash
mkdir -p ~/.config/opencode/skills/pr-review
```

Escrever `~/.config/opencode/skills/pr-review/projects.json` com exatamente:

```json
{
  "thera-org/arbitrium": {
    "owner": "thera-org",
    "projectNumber": 8
  }
}
```

- [ ] **Step 2: Validar JSON**

Run: `python3 -m json.tool ~/.config/opencode/skills/pr-review/projects.json`
Expected: o JSON impresso sem erros.

- [ ] **Step 3: Commit**

```bash
cd ~/.config
git add opencode/skills/pr-review/projects.json
git commit -m "feat: skill pr-review - config projects.json seed"
```

---

### Task 2: SKILL.md — frontmatter, escopo e resolução de config

**Files:**
- Create: `~/.config/opencode/skills/pr-review/SKILL.md`

- [ ] **Step 1: Escrever frontmatter + seção de contexto**

Escrever em `~/.config/opencode/skills/pr-review/SKILL.md`:

````markdown
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
````

- [ ] **Step 2: Validar frontmatter YAML**

Run: `python3 -c "import yaml; yaml.safe_load(open('/home/monteiro/.config/opencode/skills/pr-review/SKILL.md').read().split('---')[1]); print('frontmatter ok')"`
Expected: `frontmatter ok` (se PyYAML ausente, validar visualmente: nome/description em 1 linha, sem quebra).

- [ ] **Step 3: Commit**

```bash
cd ~/.config
git add opencode/skills/pr-review/SKILL.md
git commit -m "feat: skill pr-review - frontmatter, contexto e config"
```

---

### Task 3: Fase A — comandos de leitura e relatório

**Files:**
- Modify: `~/.config/opencode/skills/pr-review/SKILL.md` (append)

- [ ] **Step 1: Adicionar a seção Fase A ao SKILL.md**

Append ao SKILL.md:

````markdown
## Fase A — review <PR>

### Passos

1. Coletar dados do PR (substituir N, OWNER/REPO pelos reais):

```bash
PR_NUM=N
REPO=owner/repo
gh pr view $PR_NUM -R $REPO --json number,title,author,url,body,files,headRefOid,commits,isDraft
gh pr diff $PR_NUM -R $REPO
gh pr view $PR_NUM -R $REPO --json files --jq '.files[] | {path, additions, deletions}'
```

2. Analisar o diff/arquivos com os critérios:
   - Anti-padrões e code smells (duplicação, complexidade, convenções do projeto)
   - Vulnerabilidades e riscos de segurança
   - Docs desatualizadas vs alterações de código (mudança de comportamento/schema/API
     sem atualizar doc correspondente)
   - Inconsistências (padrões divergentes dentro da própria PR ou vs base)
   - Dúvidas: falta de contexto/documentação, comportamento ambíguo, intenção incerta
   - Regras: NUNCA inventar. Todo achado deve ser reproduzível no diff/código real.
     Buscar entender a intenção da mudança antes de julgar. Falta de documentação é
     DÚVIDA, não bloqueante.
   - Descartar falsos positivos: se não dá para confirmar no código, não reportar.

3. Reportar no chat em tabela, agrupada por severidade (sem emojis):

| Severidade | Critério |
|---|---|
| BLOQUEANTE | Impede merge ou quebra comportamento esperado (risco de produção) |
| ARRISCADO | Não bloqueante, mas merece prioridade (manutenção, correção adversa) |
| NAO-BLOQUEANTE | Pode ser feito depois (melhoria, dívida técnica, docs) |
| DUVIDA | Pergunta ao autor/usuário sobre intenção ou contexto |

Cada item: `arquivo:linha | o quê | por quê | sugestão`. Itens sem linha (arquitetura,
escopo) ficam com o caminho do arquivo ou `PR`.

### Checkpoint obrigatório

Fim da Fase A: PARAR o turno e aguardar o usuário ler o relatório e decidir.
NUNCA comentar na PR ou criar issues sem comando explícito de Fase B.
````

- [ ] **Step 2: Validar os comandos de leitura contra um PR real (read-only, sem postar nada)**

Run:
```bash
gh pr view 374 -R thera-org/arbitrium --json number,title,author,headRefOid --jq '{number, title, author: .author.login, headRefOid}'
gh pr diff 374 -R thera-org/arbitrium | head -40
```
Expected: título/author/headRefOid do PR 374 e as primeiras linhas do diff. Se o PR 374
estiver fechado, usar outro número aberto da lista (389, 387, 379, 376, 353, 349).

- [ ] **Step 3: Commit**

```bash
cd ~/.config
git add opencode/skills/pr-review/SKILL.md
git commit -m "feat: skill pr-review - fase A (leitura e relatorio)"
```

---

### Task 4: Fase B — comentários inline e avulsos

**Files:**
- Modify: `~/.config/opencode/skills/pr-review/SKILL.md` (append)

- [ ] **Step 1: Adicionar a seção Fase B (parte de comentários) ao SKILL.md**

Append:

````markdown
## Fase B — comment <PR>

### Mapeamento severidade → ação

| Severidade | Modo normal | Modo fast-track (--fast-track) |
|---|---|---|
| BLOQUEANTE | comentário inline na linha | issue P0 |
| ARRISCADO | issue P1 | issue P1 |
| NAO-BLOQUEANTE | issue P2 | issue P2 |
| DUVIDA | comentário avulso (sem linha) | comentário avulso (sem linha) |

### Comentários inline (BLOQUEANTE, modo normal)

Um comentário por problema, direto na linha do problema. NUNCA um comentário "pai"
com vários problemas. Para cada comentário:

```bash
REPO=owner/repo; PR_NUM=N
# 1. obter o commit do head (uma vez por PR)
COMMIT=$(gh pr view $PR_NUM -R $REPO --json headRefOid --jq .headRefOid)
# 2. postar na linha exata (path relativo ao repo, line = número da linha nova do diff)
gh api repos/$REPO/pulls/$PR_NUM/comments \
  -f body='**Problema:** ...' \
  -f path='src/arquivo.ts' \
  -f line=42 \
  -f commit_id="$COMMIT"
```

Regras do corpo do comentário: começar com a severidade e o problema, citar o código,
explicar o porquê, sugerir correção. pt-BR. Exemplo:
`BLOQUEANTE — o cast em ... quebra ... quando ...; sugerido: ...`.

### Comentários avulsos (DUVIDA)

```bash
gh pr comment $PR_NUM -R $REPO --body "DUVIDA — pergunta ..."
```

Formato de pergunta, sem supor resposta. Cada dúvida em comentário separado.
````

- [ ] **Step 2: Validar a construção do payload inline (sem postar nada)**

Run:
```bash
gh pr view 374 -R thera-org/arbitrium --json headRefOid --jq .headRefOid
gh pr diff 374 -R thera-org/arbitrium --name-only | head -5
```
Expected: SHA do head + lista de arquivos do diff (o SHA e um path real serão usados
como exemplo de payload válido na validação final; não postar comentários de teste).

- [ ] **Step 3: Commit**

```bash
cd ~/.config
git add opencode/skills/pr-review/SKILL.md
git commit -m "feat: skill pr-review - fase B comentarios inline e avulsos"
```

---

### Task 5: Mecânica de issues — título, parent, dedup, checklist

**Files:**
- Modify: `~/.config/opencode/skills/pr-review/SKILL.md` (append)

- [ ] **Step 1: Adicionar a seção de criação de issues (regras) ao SKILL.md**

Append:

````markdown
### Criação de issues (ARRISCADO, NAO-BLOQUEANTE e fast-track)

#### Título (convenção)

Título da nova issue = título do parent + " | " + descrição curta do problema.
- Descrição curta: verbo no infinitivo, sem ponto final. Ex: `Ajustar colunas Dias p/ vencer`.
- NUNCA criar título sem derivar do parent (se não houver parent, ver "Parent" abaixo).

#### Parent (regra de busca)

1. Derivar o caminho do módulo do problema (parte do título antes do último " | ").
2. Buscar issues ABERTAS do repo cujo título comece com o caminho do módulo E que
   sejam contêineres (campo Nível = Módulo ou Feature). Usar a query:

```graphql
query {
  repository(owner: "OWNER", name: "REPO") {
    issues(first: 100, states: OPEN) {
      nodes {
        number
        title
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
      }
      pageInfo { hasNextPage endCursor }
    }
  }
}
```

   (paginar com `after: "$endCursor"` até esgotar ou achar match).
3. Escolher o match mais profundo (título = caminho do módulo exato, ou o mais longo
   que case com o prefixo).
4. Se existir parent adequado → usar, sem perguntar.
5. Se NÃO existir parent adequado → PERGUNTAR ao usuário antes de criar qualquer
   contêiner novo (módulo/feature). Opções a oferecer:
   - Criar hierarquia completa (Módulo → Feature → leaf)
   - Criar a leaf avulsa (sem parent)
   - Usar outro parent/caminho indicado pelo usuário
   Nunca criar módulo/feature novo sem confirmação explícita.
6. Nível dos contêineres criados: raiz = Módulo, intermediário = Feature.
7. Leaf: Nível = Bug se for defeito real (comportamento errado, crash, vazamento,
   erro visível ao usuário); senão Nível = Task (melhoria, code smell, dívida, docs).

#### Dedup (antes de criar)

Buscar issue existente com o mesmo título (aberta ou fechada):

```bash
gh search issues --repo owner/repo "TÍTULO-EXATO" --limit 5
```

Se existir: NÃO criar duplicata. Informar o número/link da existente na resposta.
Se houver várias semelhantes mas não idênticas, verificar se a nova é a mesma
intenção antes de decidir; na dúvida, perguntar ao usuário.

#### Checklist obrigatório por issue criada (NUNCA pular)

Após criar CADA issue, confirmar via API que:
- [ ] Título segue a convenção (parent + " | " + descrição)
- [ ] Parent correto (subissue vinculada) — quando aplicável
- [ ] Adicionada ao project correto (do config)
- [ ] Status = Ready
- [ ] Priority = P0/P1/P2 conforme o mapeamento da Fase B
- [ ] Nível = Módulo/Feature/Task/Bug conforme o nível na hierarquia
- [ ] Assignee (dev responsável) = autor da PR

Se qualquer item falhar, corrigir antes de prosseguir. Reportar ao final:
`Issue #N criada: <título> — <url>` para cada uma.
````

- [ ] **Step 2: Validar a query de busca de parent (read-only)**

Run a query da Task 5 (Step 1) para othera-org/arbitrium (com `"arbitrium"` e
`"thera-org"` no lugar de REPO/OWNER) e conferir que retorna issues com o campo Nível
no `fieldValues`.
Expected: lista de issues com `projectItems[0].fieldValues` contendo `{name: "Ready"/..., field: {name: "Status"}}` e `{name: "Módulo"/..., field: {name: "Nível"}}`.

- [ ] **Step 3: Commit**

```bash
cd ~/.config
git add opencode/skills/pr-review/SKILL.md
git commit -m "feat: skill pr-review - mecanica de issues (titulo, parent, dedup, checklist)"
```

---

### Task 6: Mutações GraphQL verificadas (criação de issues)

**Files:**
- Modify: `~/.config/opencode/skills/pr-review/SKILL.md` (append)

- [ ] **Step 1: Adicionar a seção de mutações ao SKILL.md**

Append:

````markdown
### Mutações (comandos verificados — não improvisar)

#### 1. IDs necessários (lookup, uma vez por project/repo)

```bash
REPO=owner/repo
# node id do repo
REPO_ID=$(gh api repos/$REPO --jq .node_id)
# node id do project + field IDs e option IDs (single-selects)
gh api graphql -f query='query { organization(login: "ORG") { projectV2(number: N) { id fields(first: 40) { nodes { ... on ProjectV2FieldCommon { name dataType } ... on ProjectV2SingleSelectField { name dataType options { id name } } } } } } }'
```

Interpretar a saída: para Status/Priority/Nível, anotar `id` do campo (ex: `PVTSSF_...`)
e o `id` de cada option (ex: option "Ready", "P0", "Módulo"). Project node id tem
prefixo `PVT_`; repo node id tem prefixo `R_kg`.

#### 2. Criar a issue (uma mutation faz: criar + parent + project + assignee)

```graphql
mutation {
  createIssue(input: {
    repositoryId: "REPO_ID"
    title: "TITULO"
    body: "CORPO"
    parentIssueId: "PARENT_ISSUE_ID"   # omitir se avulsa
    projectV2Ids: ["PROJECT_ID"]
    assigneeIds: ["AUTHOR_GRAPHQL_ID"] # id do autor da PR
  }) {
    issue { id number url title }
  }
}
```

Via CLI (montar o JSON do input e usar --input):

```bash
gh api graphql --input /tmp/create-issue.json
```

- `PARENT_ISSUE_ID`: obter via `gh api repos/$REPO/issues/N --jq .node_id` da issue parent.
- `AUTHOR_GRAPHQL_ID`: `gh pr view $PR_NUM -R $REPO --json author --jq .author.id`.
- CORPO: contexto do problema (o que, onde, por quê, referência ao PR `#N`).

#### 3. Setar Status, Priority e Nível (após criar; precisa do item id do project)

Item id da issue criada (no project):

```graphql
query {
  repository(owner: "OWNER", name: "REPO") {
    issue(number: N) {
      projectItems(first: 5) { nodes { id project { title } } }
    }
  }
}
```

Para cada campo single-select, uma mutation:

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

Campos a setar (obrigatório): Status="Ready", Priority=P0/P1/P2 (conforme mapeamento),
Nível (Módulo/Feature/Task/Bug conforme regra).

#### 4. Fallbacks (somente se o passo 2 não aceitar parent/project/assignee)

- Parent tardio: `addSubIssue(input: { issueId: "PARENT_ID", subIssueId: "ISSUE_ID" })`.
- Project tardio: `addProjectV2ItemById(input: { projectId: "PROJECT_ID", contentId: "ISSUE_ID" })`.
- Assignee tardio: `addAssigneesToAssignable(input: { assignableId: "ISSUE_ID", assigneeIds: ["AUTHOR_ID"] })`.

#### 5. Verificação pós-criação (por issue)

Confirmar título/parent/fields via a query da Task 5 (Step 1) + `parent { number }` +
`gh api repos/$REPO/issues/N --jq '.assignees[].login'`. Se algo divergir do checklist,
corrigir com as mutações acima antes de seguir.
````

- [ ] **Step 2: Validar os passos 1 e 3 (lookups read-only) na org real**

Run:
```bash
gh api repos/thera-org/arbitrium --jq .node_id
gh pr view 374 -R thera-org/arbitrium --json author --jq .author.id
gh api graphql -f query='query { organization(login: "thera-org") { projectV2(number: 8) { id fields(first: 40) { nodes { ... on ProjectV2FieldCommon { name dataType } ... on ProjectV2SingleSelectField { name dataType options { id name } } } } } } }'
```
Expected: `R_kgDOQhT-zA`, um `U_kg...` (id do Gabriel-c0Nsp ou do autor), e a lista de
fields com `id`s (`PVT_...`, `PVTSSF_...`) e options com ids.

- [ ] **Step 3: Validar a mutation de criação em sandbox (GATE — perguntar ao usuário)**

Perguntar ao usuário onde testar a mutation de verdade (criação não pode ser desfeita
via API — issues só fecham). Opções a oferecer:
1. Repo de teste + project de teste criados para isso (ideal, sem poluição).
2. Criar 1 issue de teste em arbitrium e fechá-la em seguida (polui o histórico).
3. Pular teste real (schema já verificado por introspection; risco aceito).

Se opção 1 ou 2: executar createIssue + updateProjectV2ItemFieldValue (Status/Priority/
Nível) + addSubIssue se houver parent, conferir via API cada campo, e reportar o
resultado ao usuário. Se opção 3: registrar que a validação ficou schema-only.

- [ ] **Step 4: Commit**

```bash
cd ~/.config
git add opencode/skills/pr-review/SKILL.md
git commit -m "feat: skill pr-review - mutacoes graphql verificadas"
```

---

### Task 7: Regras de falha e encerramento

**Files:**
- Modify: `~/.config/opencode/skills/pr-review/SKILL.md` (append)

- [ ] **Step 1: Adicionar seção final ao SKILL.md**

Append:

````markdown
## Regras de falha e encerramento

- Sem auth `gh` (`gh auth status` falhando) ou sem permissão em repo/project: PARAR e
  informar o usuário. Nunca contornar com trabalho parcial.
- Falha em uma mutation (erro de GraphQL): reportar o erro literal, NÃO tentar
  "adivinhar" outra forma; conferir os IDs no passo de lookup e reexecutar.
- Ao final da Fase B, resumir: comentários postados (links), issues criadas (número,
  título, url, prioridade, nível, assignee) e issues existentes reaproveitadas (dedup).
- Fase B só roda com comando explícito (`comment <PR>`). Fase A nunca comenta nem cria.
- Dica (fora do skill): no GitHub Projects, criar view com filtro Nível = Task/Bug
  para a board mostrar apenas as leaves.

## Fim do skill
````

- [ ] **Step 2: Commit**

```bash
cd ~/.config
git add opencode/skills/pr-review/SKILL.md
git commit -m "feat: skill pr-review - regras de falha e encerramento"
```

---

### Task 8: Validação integrada (dry-run em PR real)

**Files:**
- Read-only: `~/.config/opencode/skills/pr-review/SKILL.md`

- [ ] **Step 1: Rodar a Fase A do skill em um PR real (sem postar nada)**

Executar o fluxo da Fase A para o PR 374 (ou outro aberto) de thera-org/arbitrium:
coletar dados, montar o relatório no formato da tabela (BLOQUEANTE/ARRISCADO/
NAO-BLOQUEANTE/DUVIDA) e PARAR. Mostrar o relatório ao usuário para conferir o formato.

- [ ] **Step 2: Validar que o skill não comenta/cria sem comando explícito**

Confirmar no dry-run: nenhum comentário postado, nenhuma issue criada.
Verificar via: `gh api repos/thera-org/arbitrium/pulls/374/comments --jq 'length'` e
`gh api repos/thera-org/arbitrium/issues/374/comments --jq 'length'` (comparar antes/depois).

- [ ] **Step 3: Registrar resultado e fechar**

Reportar ao usuário: resumo do dry-run, limitações conhecidas (validação de mutation
schema-only, se for o caso), e o comando de uso: `use o skill pr-review: review da PR 374`.

- [ ] **Step 4: Commit final (se houver ajustes)**

```bash
cd ~/.config
git add -A opencode/skills/pr-review/
git commit -m "chore: skill pr-review - ajustes pos validacao" 2>/dev/null || true
```
