# Build e Deployment

## Desenvolvimento local

- Instale as dependências:

```bash
npm install
```

- Execute o servidor de desenvolvimento:

```bash
npm run dev
```

## Build de produção

- Para gerar o build:

```bash
npm run build
```

- Para iniciar o servidor de produção:

```bash
npm start
```

## Observações

- O projeto utiliza o App Router; páginas estáticas podem ser pré-renderizadas dependendo do uso.
- O pipeline de build é o padrão do Next.js (Turbopack) e pode ser implantado na Vercel ou plataformas similares.
- Mantenha as configurações do renderizador WebGL conservadoras ao implantar para públicos com alto tráfego mobile (limite o `dpr`, desative antialias quando possível).
