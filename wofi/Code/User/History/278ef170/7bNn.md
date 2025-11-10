# 🛠️ Comandos Úteis - Sistema REVIS

## 📦 Gerenciamento de Pacotes

### Instalar dependências
```bash
npm install
```

### Adicionar nova dependência
```bash
npm install <pacote>
```

### Adicionar dependência de desenvolvimento
```bash
npm install -D <pacote>
```

### Atualizar dependências
```bash
npm update
```

## 🎨 Shadcn/ui

### Adicionar componente
```bash
npx shadcn@latest add <componente>
```

### Componentes disponíveis
```bash
npx shadcn@latest add --help
```

### Exemplos de componentes úteis
```bash
# Formulários
npx shadcn@latest add form textarea checkbox radio-group switch

# Navegação
npx shadcn@latest add tabs breadcrumb pagination

# Feedback
npx shadcn@latest add alert progress toast sonner

# Data Display
npx shadcn@latest add accordion calendar chart tooltip

# Modais e Overlays
npx shadcn@latest add sheet alert-dialog popover

# Inputs avançados
npx shadcn@latest add date-picker combobox command
```

## 🚀 Desenvolvimento

### Iniciar servidor de desenvolvimento
```bash
npm run dev
```

### Build de produção
```bash
npm run build
```

### Executar build de produção
```bash
npm start
```

### Lint
```bash
npm run lint
```

### Lint com correção automática
```bash
npm run lint -- --fix
```

## 🔥 Firebase

### Instalar Firebase CLI
```bash
npm install -g firebase-tools
```

### Login no Firebase
```bash
firebase login
```

### Inicializar Firebase no projeto
```bash
firebase init
```

### Deploy de Functions
```bash
firebase deploy --only functions
```

### Deploy de Firestore Rules
```bash
firebase deploy --only firestore:rules
```

### Deploy de Storage Rules
```bash
firebase deploy --only storage
```

### Deploy completo
```bash
firebase deploy
```

### Emuladores locais (desenvolvimento)
```bash
firebase emulators:start
```

### Logs das Functions
```bash
firebase functions:log
```

## 📊 Git

### Status
```bash
git status
```

### Adicionar arquivos
```bash
git add .
```

### Commit
```bash
git commit -m "feat: descrição da funcionalidade"
```

### Padrão de commits (Conventional Commits)
```bash
git commit -m "feat: adiciona nova funcionalidade"
git commit -m "fix: corrige bug na produção"
git commit -m "docs: atualiza documentação"
git commit -m "style: formata código"
git commit -m "refactor: refatora componente X"
git commit -m "test: adiciona testes para Y"
git commit -m "chore: atualiza dependências"
```

### Push
```bash
git push origin main
```

### Criar branch
```bash
git checkout -b feature/nome-da-feature
```

### Trocar de branch
```bash
git checkout main
```

### Merge
```bash
git merge feature/nome-da-feature
```

## 🧪 Testes (quando implementados)

### Executar todos os testes
```bash
npm test
```

### Executar testes em watch mode
```bash
npm test -- --watch
```

### Coverage
```bash
npm test -- --coverage
```

## 📝 Geração de Código

### Criar nova página
```bash
# Exemplo: criar página de estoque
mkdir -p app/estoque
touch app/estoque/page.tsx
```

### Criar novo componente
```bash
# Exemplo: criar componente de tabela
touch src/components/inventory/TableIngredients.tsx
```

### Criar novo hook
```bash
# Exemplo: criar hook de ingredientes
touch src/hooks/useIngredientes.ts
```

### Criar nova função de negócio
```bash
# Adicionar ao arquivo existente
code src/lib/business-rules.ts
```

## 🔍 Debug

### Verificar erros de TypeScript
```bash
npx tsc --noEmit
```

### Verificar erros de lint
```bash
npm run lint
```

### Analisar bundle size
```bash
npm run build
# Em seguida:
npx @next/bundle-analyzer
```

## 🗄️ Firestore

### Backup do Firestore
```bash
gcloud firestore export gs://[BUCKET_NAME]
```

### Restaurar Firestore
```bash
gcloud firestore import gs://[BUCKET_NAME]/[EXPORT_PREFIX]
```

### Deletar collection (usar com CUIDADO!)
```bash
# Via Firebase Console > Firestore > Delete collection
```

## 📱 PWA (quando implementado)

### Gerar ícones PWA
```bash
npx pwa-asset-generator logo.svg public/icons
```

### Testar service worker
```bash
npm run build
npm start
# Abrir DevTools > Application > Service Workers
```

## 🚢 Deploy (Vercel)

### Instalar Vercel CLI
```bash
npm i -g vercel
```

### Deploy
```bash
vercel
```

### Deploy de produção
```bash
vercel --prod
```

### Ver logs
```bash
vercel logs
```

## 🧹 Limpeza

### Limpar cache do Next.js
```bash
rm -rf .next
```

### Limpar node_modules
```bash
rm -rf node_modules
npm install
```

### Limpar tudo e reinstalar
```bash
rm -rf .next node_modules
npm install
```

## 📊 Performance

### Analisar performance
```bash
npm run build
# Verificar métricas no output
```

### Lighthouse CI (quando configurado)
```bash
npx lhci autorun
```

## 🔐 Variáveis de Ambiente

### Desenvolvimento
```bash
cp .env.example .env.local
```

### Verificar variáveis
```bash
cat .env.local
```

### Editar variáveis
```bash
code .env.local
```

## 📚 Documentação

### Gerar documentação TypeScript (quando configurado)
```bash
npx typedoc
```

### Storybook (quando configurado)
```bash
npm run storybook
```

## 🆘 Troubleshooting

### Erro de cache
```bash
rm -rf .next
npm run dev
```

### Erro de módulos
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erro de TypeScript
```bash
rm -rf .next
npx tsc --noEmit
```

### Erro de Firebase
```bash
# Verificar .env.local
# Verificar Firebase Console
# Verificar regras de segurança
```

### Porta em uso
```bash
# Matar processo na porta 3000
kill -9 $(lsof -t -i:3000)
```

## 📖 Recursos Úteis

### Documentação
- Next.js: https://nextjs.org/docs
- React: https://react.dev
- TypeScript: https://www.typescriptlang.org/docs
- TailwindCSS: https://tailwindcss.com/docs
- Shadcn/ui: https://ui.shadcn.com
- Firebase: https://firebase.google.com/docs
- Lucide Icons: https://lucide.dev

### Comunidade
- Next.js Discord: https://discord.gg/nextjs
- React Discord: https://discord.gg/react
- Firebase Discord: https://discord.gg/firebase

---

**Dica**: Adicione este arquivo aos seus favoritos para acesso rápido aos comandos!
