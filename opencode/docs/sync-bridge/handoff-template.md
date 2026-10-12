# Handoff — template para troca opencode ↔ Claude Code

> Preencher ao trocar de ferramenta no meio de um trabalho. Arquivo vivo em `.ai/handoff.md` na raiz do repo. Curto, factual, sem floreio.

## Contexto / Objetivo

- Repo:
- Branch:
- Objetivo (1-2 frases):
- Origem (opencode | claude):
- Data (UTC):

## Decisões

| Decisão | Motivo |
| ------- | ------ |
|  |  |
|  |  |

## Feito

- Arquivos alterados:
  - `path/to/file` — o quê
- Commits:
  - `abc1234` mensagem

## Quebrado / confirmado errado — o que reverter

- O que está quebrado ou confirmado errado:
- Como reverter (comando exato, ex: `git checkout -- <arq>` / `git revert <sha>`):
- O que NÃO zerar (trabalho válido a preservar):

> Se nada quebrado: escrever `Nada quebrado.`

## Próximos passos

1.
2.
3.

## Estado git

```text
# colar saída de: git status --short && git diff --stat
# colar saída de: git log --oneline -5
```

- Branch:
- Status (colar):
- Diff stat (colar):
- Últimos commits (colar):

## Como retomar

- opencode: `opencode --continue` (retoma última sessão no repo atual)
- claude: `claude --resume` (retoma última sessão; `claude --resume <id>` p/ sessão específica)
- Exportar sessão opencode p/ texto: `opencode export [session]` (sem arg = sessão atual)
- Exportar no Claude: `/export` (gera transcrição; anexar trecho relevante aqui se útil)
- Primeiro passo ao retomar: ler este arquivo + `git status --short` + diff dos arquivos listados em Feito.
