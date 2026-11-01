# Homelab — sync e deploy do Arbitrium

Arquivo pessoal (não vai para o repositório do Arbitrium). Complementa `HOMELAB.md`.

## Layout canônico

- **Local (editor/agente):** `/home/monteiro/dev/codes/thera/arbitrium`
- **Homelab (runtime):** `ssh homelab`
  - `~/arbitrium/src/` — clone git, branch `develop`
  - `~/arbitrium/compose.homelab.yml` — compose próprio, sem Traefik/`edge`
  - `~/arbitrium/.env` — segredos/config, `chmod 600`, nunca versionado
  - `~/arbitrium/localstack-init/` — cria o bucket S3
  - `~/arbitrium/arbitrium-develop-full.bundle` — bundle de bootstrap (pode apagar)

### Portas

No homelab, tudo bind em `127.0.0.1`:

| Serviço | Homelab | Container |
|---|---|---|
| API | `18080` | `8080` |
| Web | `13000` | `8080` |
| Postgres | `5435` | `5432` |
| LocalStack | `4566` | `4566` |

Túnel local:

```bash
# setsid é importante: o shell do agente mata o grupo de processos ao terminar.
setsid ssh -f -N -L 8080:127.0.0.1:18080 -L 3000:127.0.0.1:13000 homelab \
  </dev/null >/tmp/opencode/arbitrium-tunnel.log 2>&1
# conferir: pgrep -af 'ssh -f -N -L 8080:127.0.0.1:18080'
# derrubar:  kill <pid>
```

- Web: <http://localhost:3000> (se a 3000 local estiver ocupada, use `-L 3001:127.0.0.1:13000` e acesse <http://localhost:3001>; o `.env` do homelab já inclui 3001 no CORS)
- API: <http://localhost:8080/api>
- Login dev do homelab: `admin@arbitrium.com` / `dev123456` (senha resetada no banco do homelab; é dev, não produção)

## Regra de ouro

- Código nasce e é commitado no **local**. O homelab é **runtime**.
- Sync sempre por **commit + bundle**; nunca copiar working tree suja.
- Hotfix no homelab é permitido, mas tem que ser commitado no repo de lá e trazido por bundle. Não deixar alteração solta.

## De cá para lá (local → homelab)

No local:

```bash
BRANCH=develop
BUNDLE=/tmp/opencode/arbitrium-$(echo "$BRANCH" | tr '/' '-').bundle
git status -sb                 # working tree limpa
git bundle create "$BUNDLE" "$BRANCH"
scp "$BUNDLE" homelab:~/arbitrium/incoming.bundle
```

No homelab:

```bash
BRANCH=develop
cd ~/arbitrium/src
git fetch ~/arbitrium/incoming.bundle "$BRANCH":refs/remotes/incoming/"$BRANCH"
git checkout "$BRANCH" 2>/dev/null || git checkout -b "$BRANCH" refs/remotes/incoming/"$BRANCH"
git merge --ff-only refs/remotes/incoming/"$BRANCH"   # nunca usar --force
```

Build/restart do que mudou:

```bash
cd ~/arbitrium
docker compose -f compose.homelab.yml build api web
docker compose -f compose.homelab.yml up -d
```

Verificação:

```bash
curl -fsS http://127.0.0.1:18080/api/actuator/health
curl -fsS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:13000/
# do local, via túnel:
curl -fsS http://127.0.0.1:8080/api/actuator/health
```

## De lá para cá (homelab → local)

No homelab:

```bash
cd ~/arbitrium/src
BRANCH=hotfix/homelab-$(date +%F)
git checkout -b "$BRANCH"
git add -A
git commit -m "hotfix(homelab): descrever o ajuste"
BUNDLE=~/arbitrium/back-$(echo "$BRANCH" | tr '/' '-').bundle
git bundle create "$BUNDLE" "$BRANCH"
```

No local:

```bash
BRANCH=hotfix/homelab-2026-10-29
BUNDLE=/tmp/opencode/back-$(echo "$BRANCH" | tr '/' '-').bundle
scp "homelab:~/arbitrium/back-$(echo "$BRANCH" | tr '/' '-').bundle" "$BUNDLE"
git fetch "$BUNDLE" "$BRANCH":refs/remotes/homelab/"$BRANCH"
git checkout -b "$BRANCH" refs/remotes/homelab/"$BRANCH"
# revisar, testar e então cherry-pick/merge na branch de trabalho
```

Apagar os bundles dos dois lados depois.

## Config e segredos

- `.env` fica **só** no homelab, `chmod 600`. Nunca no git.
- Alterou `.env`: `docker compose -f compose.homelab.yml up -d --force-recreate <serviço>`.
- `POSTGRES_USER`, `POSTGRES_DB` e `POSTGRES_PASSWORD` só são aplicados na **primeira** inicialização do volume. Depois disso, mudar no `.env` não altera o banco; para senha, usar `ALTER USER`; para user/db, recriar o volume (com backup).
- `COMPANY_*` continuam vazias de propósito. PDFs de empreiteiro (contrato/medição/recibo) retornam 400 até a #1251 (system settings/painel admin). **Não** colocar dados da empresa no `.env`.
- `RESEND_ENABLED=false`: sem e-mail real. Firebase/push e export de tracing/métricas estão desligados.

## Operação

```bash
cd ~/arbitrium
docker compose -f compose.homelab.yml ps
docker compose -f compose.homelab.yml logs -f --tail=100 api
docker compose -f compose.homelab.yml restart api
docker compose -f compose.homelab.yml down          # para sem apagar dados
# NUNCA: docker compose ... down -v                 # apaga Postgres/LocalStack
```

Backup do banco:

```bash
docker exec arbitrium-db pg_dump -U arbitrium -d arbitrium -Fc \
  > ~/arbitrium/backup-$(date +%F).dump
```

Rollback de código: `git checkout <commit-anterior>` em `~/arbitrium/src` e rebuild. Migrations são forward-only; se a migration for destrutiva, restaurar o dump.

## Primeiro boot e diagnóstico

- A API leva **~4–5 min** no primeiro start (Hibernate Envers). O healthcheck fica `unhealthy` e depois vira `healthy`; não reiniciar no meio.
- Se der OOM, subir o `mem_limit` da API de `1g` para `1.5g` no `compose.homelab.yml`.
- A API roda Flyway no profile `dev`; não precisa de serviço de migration separado.
- O build do web tem `VITE_API_URL=http://localhost:8080/api` (túnel). Se mudar a porta local, rebuildar o web com o novo build arg.
- O LocalStack cria o bucket `arbitrium-files` via `localstack-init/init-s3.sh`.

## Futuro (opcional)

Para eliminar os bundles, adicionar uma **deploy key read-only** do homelab no GitHub e configurar `origin`; aí o fluxo vira `git pull`/`git push` normal. Não fazer sem confirmação.
