---
description: Gera .ai/handoff.md para trocar de sessão opencode para Claude Code
---

Gere `.ai/handoff.md` no repo atual a partir do template canônico em `/home/monteiro/.config/opencode/docs/sync-bridge/handoff-template.md`. Não reinvente a estrutura — copie as seções do template e preencha com o estado real da sessão atual.

Passos:

1. Leia o template em `/home/monteiro/.config/opencode/docs/sync-bridge/handoff-template.md`.
2. Rode `git status --short && git diff --stat` e `git log --oneline -5` no repo atual; cole as saídas literais na seção Estado git (não resuma).
3. Preencha: Contexto/Objetivo (1-2 frases), Decisões (tabela decisão+motivo, só as desta sessão), Feito (arquivos + commits), Quebrado/confirmado errado (o que reverter sem zerar; `Nada quebrado.` se limpo), Próximos passos numerados (acionáveis, com arquivo alvo cada).
4. Escreva o resultado em `<repo>/.ai/handoff.md` (criar `.ai/` se ausente).
5. Responda com o path escrito + resumo em 3 linhas (branch, feitos, próximo passo 1).

Regra de segurança: lembre o usuário de commitar ou `git stash -u` antes de abrir o outro lado; nunca opencode e Claude juntos no mesmo repo.
