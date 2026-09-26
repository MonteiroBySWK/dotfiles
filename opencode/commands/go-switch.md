---
description: Alterna a API key ativa do OpenCode Go
---

Troque a conta ativa do provider `opencode-go` para $ARGUMENTS.

Regras:
1. Se $ARGUMENTS estiver vazio, mostre a saída de `~/.config/opencode/scripts/go-key.sh status` e pergunte qual ativar. Não adivinhe.
2. Se $ARGUMENTS tiver um label (ex. `/go-switch go-2`), execute `~/.config/opencode/scripts/go-key.sh switch "$ARGUMENTS"` no shell.
3. Confirme com a saída do próprio script (linha com `|1` é a ativa) e diga qual ficou valendo.
4. Lembre que sessões novas usam a key ativa; sessão atual pode precisar de `/models` ou reinício.
