# Homelab — runtime canônico (setup pessoal)

O homelab é a extensão correta do nosso corpo para rodar containers. Ele é o runtime padrão dos meus projetos; a máquina local é apenas editor/agente.

## Regras

- **Não subir nada de longa duração na máquina local**: backend, frontend, Postgres, MinIO/LocalStack, MailHog, observabilidade ou qualquer container de serviço.
- Operar os ambientes por **SSH no homelab** (`ssh homelab`; confirmar o host/alias do projeto).
- Builds, testes de integração, migrations e smoke rodam no **homelab ou no CI** — não na máquina local.
- Se uma instrução antiga do projeto (incluindo `AGENTS.md`/`dev.py`) mandar subir localmente, **não execute**: pare e confirme que é uma exceção explícita.
- Acesso externo via **Tailscale** (pessoal). Cloudflare Tunnel fica só como break-glass (SSH). Não expor Postgres, actuator ou portas de debug publicamente.
- Segredos ficam no homelab (`.env` com permissão restrita) ou no cofre definido; nunca no repositório.
- **Produção não é o homelab**: operações no host de produção seguem o runbook do projeto e exigem confirmação antes de qualquer escrita.
- Se o homelab estiver indisponível, **não cair para o runtime local como fallback**: pare e avise.
- Fluxo concreto de sync/deploy do Arbitrium (bundles, portas, túnel, backup): ver `HOMELAB_WORKFLOW.md`.
