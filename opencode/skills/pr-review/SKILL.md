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
