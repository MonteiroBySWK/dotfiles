# neolab

> Monorepo simples com API backend em NestJS e frontend em Next.js.

## Visão geral

Este repositório contém dois projetos principais:

- `back/` — API backend construída com NestJS (TypeScript).
- `front/` — Aplicação frontend construída com Next.js (React + TypeScript).

O objetivo deste README é orientar como configurar, desenvolver, testar e empacotar cada parte localmente.

## Estrutura do repositório

```
neolab/
├─ back/      # Backend (NestJS)
├─ front/     # Frontend (Next.js)
```

## Requisitos

- Node.js (recomenda-se Node 18+)
- npm (ou yarn/pnpm, conforme sua preferência)
- Git

Observação: os projetos têm suas dependências e scripts próprios (`back/package.json` e `front/package.json`).

## Instalação

Instale as dependências para cada subprojeto separadamente.

No terminal (exemplo com npm):

```bash
# Backend
cd back
npm install

# Em outro terminal, Frontend
cd ../front
npm install
```

Se preferir yarn ou pnpm, troque `npm install` por `yarn` ou `pnpm install`.

## Rodando em desenvolvimento

Backend (NestJS):

```bash
cd back
npm run start:dev    # roda em modo dev com watch
```

Frontend (Next.js):

```bash
cd front
npm run dev          # roda Next em modo de desenvolvimento (hot-reload)
```

Abra o frontend (por padrão em http://localhost:3000) e a API no porto configurado (padrões do NestJS/Next.js se não foram alterados).

## Build e execução em produção

Backend:

```bash
cd back
npm install --production
npm run build        # compila TypeScript para /dist
npm run start:prod   # inicia a build compilada
```

Frontend:

```bash
cd front
npm install --production
npm run build
npm run start        # serve a build do Next.js
```

## Testes

Backend (Jest):

```bash
cd back
npm run test         # testes unitários
npm run test:e2e     # testes end-to-end (usa ./test/jest-e2e.json)
```

Frontend: adicione testes conforme necessário (não há configuração de testes por padrão neste `front/package.json`).

## Lint e formatação

Backend:

```bash
cd back
npm run lint
npm run format
```

Frontend:

```bash
cd front
npm run lint
```

## Notas de desenvolvimento

- O backend usa NestJS 11.x. Os scripts padrões incluem `start:dev`, `build` e testes com Jest.
- O frontend usa Next 16.x e React 19.
- Ajuste variáveis de ambiente (por exemplo porta da API, URL de backend no frontend) conforme necessário no seu ambiente de desenvolvimento.

## Contribuindo

1. Abra uma issue descrevendo o que será feito.
2. Crie uma branch com um nome descritivo.
3. Faça commits pequenos e claros.
4. Envie um pull request para `main` com descrição e passos para testar.

## Licença

Verifique o arquivo `LICENSE` no repositório (se existir) ou consulte os mantenedores para informação sobre a licença.

---

Se quiser, eu posso também:

- Adicionar um `README` específico dentro de `back/` e `front/` com mais detalhes técnicos.
- Criar scripts Docker básicos para desenvolvimento/produção.
- Incluir instruções de CI (GitHub Actions) para lint, build e testes.

Diga o que prefere que eu adicione a seguir.
