# Design — Skill global `pr-review`

Data: 2026-08-09
Status: aprovado pelo usuário durante brainstorm

## Contexto

O usuário revisa PRs no GitHub (org thera-org) e o fluxo é sempre o mesmo: revisar
a PR, comentar os problemas bloqueantes/arriscados inline, e criar issues para o
que pode ser feito depois, seguindo o padrão do GitHub Project da equipe.

Problemas atuais: a IA fica em tentativa-e-erro nas queries do `gh`/GraphQL e
esquece pontos ao criar issues (assignee/dev responsável, prioridade, parent,
campos do project).

Exemplo real confirmado: issues #360-368 de thera-org/arbitrium foram criadas de
reviews com apenas Status=Ready — sem prioridade, sem assignee, sem parent.

## Estrutura do skill

```
~/.config/opencode/skills/pr-review/
├── SKILL.md          <- o skill (fases, regras, queries testadas)
└── projects.json     <- config: mapa repo -> project
```

- `projects.json`: `{ "thera-org/arbitrium": { "owner": "thera-org", "projectNumber": 8 } }`
- Repo não mapeado -> auto-detect: buscar no org um project com o mesmo nome do repo.
- Auto-detect falhou -> parar e perguntar ao usuário (nunca chutar project).
- Idiomas: comentários e issues em pt-BR. Tom profissional, sem emojis, pontual e objetivo.
- Entradas do skill (via prompt): `review <PR>` e `comment <PR> [--fast-track]`.

## Fase A — `review <PR>` (análise + checkpoint)

1. Buscar via `gh`: título do PR, autor, descrição, arquivos alterados, diff completo,
   commits e issues linkadas.
2. Analisar com os critérios do usuário: anti-padrões, code smells, vulnerabilidades,
   docs desatualizadas vs alterações, inconsistências, dúvidas. Sempre comparando com o
   código real — nunca inventar. Falta de documentação conta como dúvida, não bloqueante.
3. Validar cada achado contra o diff/código; descartar falsos positivos.
4. Reportar no chat em tabela, agrupado por severidade:
   - BLOQUEANTE — impede merge ou quebra comportamento esperado
   - ARRISCADO — não bloqueante (manutenção, correção adversa), mas merece prioridade
   - NAO-BLOQUEANTE — pode ser feito depois
   - DUVIDA — falta de contexto/documentação, comportamento ambíguo
   Cada item: `arquivo:linha | o que | por que | sugestao`.
5. PARAR (fim de turno). A Fase B só roda com comando explícito do usuário.

## Fase B — `comment <PR>` (aplicação)

| Severidade | Modo normal | Modo fast-track |
|---|---|---|
| BLOQUEANTE | comentário inline na linha do problema | issue P0 |
| ARRISCADO | issue P1 | issue P1 |
| NAO-BLOQUEANTE | issue P2 | issue P2 |
| DUVIDA | comentário avulso (sem linha) | comentário avulso (sem linha) |

- Comentários inline: via `gh api repos/{owner}/{repo}/pulls/{n}/comments` com
  `path`, `line` e `commit_id` (head do PR). Um comentário por problema, direto na
  linha. Nunca comentário "pai" com tudo junto.
- Comentários avulsos (dúvidas): na thread geral do PR, formato pergunta.
- Fast-track: nada de comentário inline; tudo vira issue (P0/P1/P2 conforme tabela).

## Mecânica de criação de issues (núcleo anti-esquecimento)

### Nomeclatura
Título da nova issue = título do parent + " | " + descrição curta do problema.
- `>` = submódulo (sub de algo). Ex: `Solicitações > Pagamentos`.
- `|` = novo nível. Ex: `Solicitações > Pagamentos | Ajustar colunas Dias p/ vencer`.

### Parent
1. Derivar o caminho do módulo do problema (ex: `Solicitações > Pagamentos`).
2. Buscar issue ABERTA cujo título case com o caminho, limitada a contêineres
   (Nível = Módulo/Feature), usando o match mais profundo.
3. Se existir parent adequado -> criar como subissue dele (sem perguntar).
4. Se NÃO existir parent adequado -> **perguntar ao usuário** antes de criar
   qualquer contêiner novo (módulo/feature), oferecendo opções como:
   - Criar a hierarquia completa (Módulo -> Feature -> leaf)
   - Criar a leaf avulsa (sem parent)
   - Usar outro caminho/parent indicado pelo usuário
   Nunca criar módulo/feature novo sem confirmação explícita.
5. Quando o usuário confirmar a criação de contêineres:
   - Raiz criada -> Nível = Módulo
   - Contêiner intermediário -> Nível = Feature
   - Leaf -> Nível = Task (melhoria, code smell, dívida, docs) ou Bug (defeito real)

### Checklist obrigatório por issue criada
- Título seguindo a convenção
- Parent correto (subissue vinculada via addSubIssue)
- Adicionada ao project correto
- Status = Ready
- Priority = P0/P1/P2 conforme tabela da Fase B
- Nível = Módulo/Feature/Task/Bug conforme o nível na hierarquia
- Assignee (dev responsável) = autor da PR

### Queries embutidas (verificadas na org thera-org)
Fluxo GraphQL completo no SKILL.md, sem tentativa-e-erro em runtime:
1. Lookup dos field IDs do project (Status, Priority, Nível) e option IDs dos
   single-selects.
2. `createIssue` para criar a issue.
3. `addSubIssue` para vincular o parent (quando houver).
4. `addProjectV2ItemById` para adicionar ao project.
5. `updateProjectV2ItemFieldValue` para Status/Priority/Nível.
6. Assignee: autor do PR (via login do autor obtido em `gh pr view`).

## Regras de comportamento e verificação

- **Dedup**: antes de criar, buscar issue existente com o mesmo título (aberta ou
  fechada); se existir, não duplicar — mencionar a existente na resposta.
- **Verificação pós-criação**: confirmar via API que título/parent/priority/nível/
  status/assignee foram aplicados; reportar links ao final.
- **Falhas**: sem auth `gh` ou sem permissão -> parar e informar; nunca contornar
  com trabalho parcial.
- **Fase B nunca automática** após a Fase A.

## Observação (fora do escopo do skill)

Sugestão ao usuário: no GitHub Projects, criar uma view com filtro
`Nível` = Task/Bug para que a board mostre apenas as leaves; os Módulos/Features
ficam como contêineres. O skill busca parent filtrando por Nível = Módulo/Feature,
então a view não afeta a lógica.
