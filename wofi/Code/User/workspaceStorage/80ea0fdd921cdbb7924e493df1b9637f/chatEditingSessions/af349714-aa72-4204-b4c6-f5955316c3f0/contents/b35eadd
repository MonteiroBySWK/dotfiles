# 🍹 Sistema REVIS - Gestão de Estoque e Produção

Sistema web moderno para gestão completa de estoque, produção e vendas de bebidas em eventos. Desenvolvido com Next.js 15, React 19, TypeScript e Firebase.

## 📊 Status do Projeto: 85% Concluído

### ✅ Módulos Implementados
- **Autenticação** - Login, controle de acesso por níveis
- **Dashboard** - Visão geral com métricas principais
- **Estoque** - Gestão completa de ingredientes (REQ-01 a REQ-06)
- **Pedidos** - Controle de compras com rastreamento (REQ-07 a REQ-11)
- **Produção** - Planejamento e execução com BOM (REQ-12, REQ-13, REQ-17)
- **Eventos** - Cadastro e acompanhamento de eventos
- **Vendas** - Registro de vendas por evento e ponto de venda
- **Alertas** - Central de notificações (REQ-04, REQ-15)

### ⏳ Pendente
- Relatórios com exportação (REQ-18)
- Sistema FIFO completo (REQ-16)
- Controle de validade (REQ-14, REQ-15)
- Cloud Functions para automações

## 🚀 Stack Tecnológica

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: TailwindCSS 4, Shadcn/ui
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **Ícones**: Lucide React
- **Utilitários**: date-fns, clsx, tailwind-merge, sonner

## 📋 Funcionalidades Principais

### ✅ Gestão de Estoque (ESSENCIAL) - CONCLUÍDO
- Cadastro de insumos com categorias (REQ-01)
- Registro de entrada e movimentações (REQ-02)
- Cálculo automático de consumo (REQ-03)
- Alertas de estoque abaixo do mínimo (REQ-04)
- Histórico completo de movimentações (REQ-05)
- Controle automático de perdas (REQ-06)

### ✅ Controle de Pedidos (ESSENCIAL) - CONCLUÍDO
- Criação de pedidos com múltiplos itens (REQ-07)
- Rastreamento de status (Solicitado → Separação → Entrega → Recebido) (REQ-08)
- Atualização automática do estoque no recebimento (REQ-09)
- Cálculo do valor total (REQ-10)
- Anexação de documentos (REQ-11) - preparado

### ✅ Controle de Produção (ESSENCIAL) - CONCLUÍDO
- Registro de produção diária (REQ-12)
- Cálculo automático de consumo por receita - BOM (REQ-13)
- Distribuição automática de produção por percentuais (REQ-17)
- Validação de estoque disponível
- Registro de execução com baixa automática

### ✅ Eventos - CONCLUÍDO
- Cadastro de eventos com local e período
- Acompanhamento de vendas previstas vs realizadas
- Histórico para previsão de demanda

### ✅ Vendas - CONCLUÍDO
- Registro de vendas por evento e ponto de venda
- Filtros por evento, ponto de venda e período
- Dashboard com totalizadores
- Histórico completo para análises

### ✅ Alertas - CONCLUÍDO
- Central de notificações (REQ-04)
- Alertas de estoque baixo
- Alertas de validade próxima (REQ-15)
- Perdas registradas
- Marcar como lido/não lido

### ⏳ Pendentes
- Controle de validade completo (REQ-14)
- Sistema FIFO automático (REQ-16)
- Relatórios com exportação (REQ-18)

## 🗂️ Estrutura do Projeto

```
revis/
├── app/                          # Next.js App Router (Pages)
│   ├── globals.css              # Estilos globais com tokens REVIS
│   ├── layout.tsx               # Layout raiz
│   ├── page.tsx                 # Dashboard principal
│   ├── estoque/                 # Gestão de estoque ✅
│   ├── pedidos/                 # Controle de pedidos ✅
│   ├── producao/                # Controle de produção ✅
│   ├── eventos/                 # Eventos ✅
│   ├── vendas/                  # Vendas ✅
│   └── alertas/                 # Alertas ✅
│
├── src/                         # Código fonte da aplicação
│   ├── components/              # Componentes React
│   │   ├── ui/                 # Componentes Shadcn/ui (18+ componentes)
│   │   ├── layout/             # Layout components
│   │   │   └── HeaderMainPage.tsx
│   │   ├── dashboard/          # Dashboard components
│   │   ├── estoque/            # Gestão de estoque
│   │   ├── pedidos/            # Controle de pedidos
│   │   ├── producao/           # Controle de produção
│   │   ├── eventos/            # Eventos
│   │   ├── vendas/             # Vendas
│   │   └── alertas/            # Alertas
│   │
│   ├── lib/                    # Bibliotecas e utilitários
│   │   ├── firebase/
│   │   │   └── config.ts       # Configuração Firebase
│   │   ├── business-rules.ts   # Regras de negócio
│   │   └── utils.ts            # Utilitários (cn, etc)
│   │
│   ├── types/                  # Definições TypeScript
│   │   └── index.ts           # Tipos completos do sistema
│   │
│   └── hooks/                  # React Hooks customizados (10+ hooks)
│       ├── useFirestore.ts    # Hook genérico CRUD
│       ├── useIngredientes.ts # Gestão de ingredientes
│       ├── usePedidos.ts      # Controle de pedidos
│       ├── useLotesProducao.ts # Produção
│       ├── useEventos.ts      # Eventos
│       ├── useVendas.ts       # Vendas
│       ├── usePontosVenda.ts  # Pontos de venda
│       └── useAlertas.ts      # Alertas
│
├── scripts/                     # Scripts utilitários
│   └── seed-database.ts        # Script de seed (dados de teste)
│
├── docs/                       # Documentação do projeto
│   ├── PROXIMOS_PASSOS.md     # Roadmap completo
│   ├── REFATORACAO_2025.md    # Histórico de refatorações
│   └── SCRIPT_SEED.md         # Documentação do seed
│
├── .github/instructions/       # Guias para desenvolvimento
│   ├── design.instructions.md # Design system
│   ├── general.instructions.md # Visão geral
│   ├── pratices.instructions.md # Boas práticas
│   └── requirements.instructions.md # Requisitos
│
├── .env.example               # Exemplo de variáveis de ambiente
├── components.json            # Configuração Shadcn/ui
├── tsconfig.json             # Configuração TypeScript
└── README.md                 # Este arquivo
```

## 🎨 Design System

### Paleta de Cores REVIS

| Token | Cor | Uso |
|-------|-----|-----|
| `--color-primary` | #37D4E6 | Ações principais, ícones ativos |
| `--color-secondary` | #FFFFFF | Texto sobre fundos escuros |
| `--color-accent` | #F37C87 | Destaques sutis |
| `--color-warning` | #F6E14E | Avisos e alertas |
| `--color-success` | #E84E1B | Êxito ou feedback positivo |
| `--color-background-brand` | #8C64EB | Cor de fundo principal |
| `--color-surface` | #F9FAFB | Superfícies claras |
| `--color-text` | #1F2937 | Texto padrão |

### Componentes

Todos os componentes seguem os padrões do Shadcn/ui e as diretrizes de acessibilidade WCAG AA.

## 🔧 Configuração

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ative **Authentication** (Email/Password)
3. Crie um banco **Firestore**
4. Copie `.env.example` para `.env.local`
5. Adicione suas credenciais do Firebase

```bash
cp .env.example .env.local
```

Edite `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=sua-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 3. Popular o Banco de Dados

```bash
npm run seed
```

Isso criará dados de exemplo:
- 10 ingredientes
- 3 produtos (Tropicana, Mojito, Caipirinha)
- 3 pedidos
- 5 eventos
- 2 lotes de produção
- 3 pontos de venda
- 7 vendas
- 3 usuários

### 4. Executar em Desenvolvimento

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

## 🔑 Usuários de Teste

Após executar o seed:

| Email | Senha | Nível |
|-------|-------|-------|
| admin@revis.com | admin123 | Administrador |
| producao@revis.com | producao123 | Produção |
| pedidos@revis.com | pedidos123 | Pedidos |

## 📊 Modelagem de Dados (Firestore)

### Collections Principais

#### `ingredientes`
Controle de insumos com histórico de movimentações

#### `produtos`
Drinks prontos com receitas (BOM)

#### `lotesProducao`
Planejamento e execução de produção

#### `pedidos`
Pedidos de compra com rastreamento

#### `eventos`
Eventos para planejamento de produção

#### `vendas`
Registro de vendas por evento

Veja detalhes completos em: `src/types/index.ts`

## 🔐 Segurança

- ✅ Autenticação Firebase (REQ-23)
- ✅ Níveis de acesso por usuário (REQ-25)
- ✅ Log de operações críticas (REQ-24)
- ✅ Criptografia HTTPS (REQ-26)

## 👥 Níveis de Usuário

- **Admin**: Configuração completa do sistema
- **Produção**: Registro de produção e consultas
- **Pedidos**: Criação e acompanhamento de pedidos
- **Visualizador**: Apenas leitura

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- Desktop (1024px+)
- Tablets (768px - 1023px)
- Mobile (320px - 767px)

## 🧪 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build
npm run build        # Build para produção
npm start            # Inicia servidor de produção

# Utilitários
npm run seed         # Popula banco com dados de teste
npm run lint         # Executa linter
```

## 🧪 Testes

```bash
# Executar testes (quando implementados)
npm test
```

## 📝 Regras de Negócio Implementadas

### Distribuição de Produção (REQ-17)
```typescript
calcularDistribuicao(totalDrinks, percentuais)
```

### Cálculo de Consumo (REQ-13)
```typescript
calcularConsumoProducao(itensPlanejados, produtos)
```

### Controle de Perdas (REQ-06)
```typescript
registrarAjusteEstoque(estoqueAnterior, novoValor, motivo)
```

### FIFO (REQ-16)
```typescript
aplicarFIFO(lotes)
```

Veja implementação completa em: `src/lib/business-rules.ts`

## 📚 Documentação

Consulte os arquivos em `.github/instructions/` para diretrizes detalhadas:
- `design.instructions.md` - Padrões de design
- `general.instructions.md` - Visão geral do sistema
- `requirements.instructions.md` - Requisitos funcionais

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é propriedade da REVIS.

## 📞 Suporte

Para dúvidas ou suporte, entre em contato com a equipe de desenvolvimento.

---

**REVIS © 2025** - Sistema de Gestão de Estoque e Produção  
**Versão:** 0.85.0 | **Última atualização:** 09/11/2025

