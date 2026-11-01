---
description: Sincroniza/deploya o Arbitrium no homelab (local <-> homelab)
---

Leia `~/.config/opencode/instructions/projects/HOMELAB_WORKFLOW.md` e execute o fluxo para: $ARGUMENTS

Se `$ARGUMENTS` estiver vazio, mostre o status do stack e do túnel e pergunte se é deploy (local -> homelab) ou hotfix de volta (homelab -> local).

Regras: nunca `docker compose down -v`; nunca copiar working tree suja (use commit + bundle); não colocar `COMPANY_*` no `.env`; o homelab é runtime, o local é a fonte de verdade.
