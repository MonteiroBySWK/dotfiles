# 🏗️ Estrutura Organizada do Projeto REVIS

## 📂 Visão Geral

```
revis/
├── 📱 app/                      # Next.js App Router (Pages)
│   ├── favicon.ico
│   ├── globals.css             # Estilos globais + tokens REVIS
│   ├── layout.tsx              # Layout raiz
│   └── page.tsx                # Dashboard principal
│
├── 💻 src/                      # Código fonte da aplicação
│   ├── components/             # Componentes React
│   │   ├── ui/                # Shadcn/ui components (13)
│   │   ├── layout/            # Layout components (3)
│   │   ├── dashboard/         # Dashboard components (1)
│   │   ├── inventory/         # [Pronto para implementar]
│   │   ├── production/        # [Pronto para implementar]
│   │   └── orders/            # [Pronto para implementar]
│   │
│   ├── lib/                   # Bibliotecas e utilitários
│   │   ├── firebase/          # Configuração Firebase
│   │   ├── business-rules.ts  # 15+ regras de negócio
│   │   └── utils.ts           # Utilitários (cn, etc)
│   │
│   ├── types/                 # Definições TypeScript
│   │   └── index.ts          # 20+ interfaces
│   │
│   └── hooks/                 # React Hooks customizados
│                              # [Pronto para implementar]
│
├── 📚 docs/                    # Documentação técnica
│   ├── README.md              # Índice da documentação
│   ├── CHECKLIST.md           # Tracking de desenvolvimento
│   ├── COMANDOS.md            # Referência de comandos
│   ├── ESTRUTURA_IMPLEMENTADA.md
│   └── PROXIMOS_PASSOS.md     # Roadmap
│
├── 🌐 public/                  # Assets estáticos
│   └── *.svg                  # Ícones e imagens
│
├── 📄 Arquivos de Configuração
│   ├── .env.example           # Exemplo de variáveis
│   ├── .gitignore             # Git ignore
│   ├── .gitattributes         # Git attributes
│   ├── components.json        # Shadcn/ui config
│   ├── tsconfig.json          # TypeScript config
│   ├── next.config.ts         # Next.js config
│   ├── eslint.config.mjs      # ESLint config
│   ├── postcss.config.mjs     # PostCSS config
│   ├── package.json           # Dependências
│   ├── CHANGELOG.md           # Histórico de versões
│   └── README.md              # Documentação principal
```

## 📊 Métricas da Estrutura

### Código Fonte
- **Componentes**: 17 arquivos
  - UI: 13 componentes Shadcn/ui
  - Layout: 3 componentes
  - Dashboard: 1 componente
- **Tipos**: 20+ interfaces TypeScript
- **Regras de Negócio**: 15+ funções implementadas
- **Páginas**: 1 (Dashboard)

### Documentação
- **Arquivos**: 5 documentos
  - README.md (índice)
  - CHECKLIST.md (tracking)
  - COMANDOS.md (referência)
  - ESTRUTURA_IMPLEMENTADA.md
  - PROXIMOS_PASSOS.md (roadmap)

### Configuração
- **TypeScript**: Strict mode, paths configurados
- **TailwindCSS**: v4 com paleta REVIS
- **Firebase**: Configurado (Firestore, Auth, Storage, Functions)
- **Shadcn/ui**: 13 componentes instalados

## 🎯 Organização por Contexto

### 1. Interface do Usuário (`src/components/`)
```
components/
├── ui/              # Componentes base reutilizáveis
├── layout/          # Layout e navegação
├── dashboard/       # Visualizações e métricas
├── inventory/       # Gestão de estoque [TODO]
├── production/      # Controle de produção [TODO]
└── orders/          # Pedidos [TODO]
```

### 2. Lógica de Negócio (`src/lib/`)
```
lib/
├── firebase/
│   └── config.ts           # Setup Firebase
└── business-rules.ts       # Regras implementadas:
                           # - Distribuição produção (REQ-17)
                           # - Cálculo consumo (REQ-13)
                           # - Controle perdas (REQ-06)
                           # - FIFO (REQ-16)
                           # - Validade (REQ-15)
                           # - Estoque baixo (REQ-04)
```

### 3. Modelagem de Dados (`src/types/`)
```
types/
└── index.ts               # Interfaces:
                          # - Ingrediente
                          # - Produto
                          # - LoteProducao
                          # - Pedido
                          # - Evento
                          # - Venda
                          # - Alerta
                          # - Usuario
                          # + 10+ tipos auxiliares
```

### 4. Páginas (`app/`)
```
app/
├── layout.tsx            # Layout raiz com providers
├── page.tsx              # Dashboard principal
└── globals.css           # Estilos globais + tokens
```

## 🔗 Sistema de Imports

Todo o código usa o path alias `@/` que aponta para `src/`:

```typescript
// Componentes
import { Button } from '@/components/ui/button';
import { HeaderMainPage } from '@/components/layout/HeaderMainPage';

// Utilitários
import { cn } from '@/lib/utils';
import { calcularDistribuicao } from '@/lib/business-rules';

// Tipos
import { Ingrediente, Produto } from '@/types';
```

## 📝 Convenções de Nomenclatura

### Componentes
- **PascalCase**: `HeaderMainPage.tsx`, `CardStatistic.tsx`
- **Prefixo por contexto**: `Table*`, `Form*`, `Modal*`, `Card*`

### Arquivos
- **kebab-case**: `business-rules.ts`, `firebase/config.ts`
- **Extensão**: `.tsx` para componentes, `.ts` para lógica

### Tipos
- **PascalCase**: `Ingrediente`, `LoteProducao`
- **Enums**: `StatusPedido`, `TipoMovimentacao`

## 🎨 Paleta de Cores (Tokens CSS)

```css
/* app/globals.css */
--color-primary: #37D4E6      /* Azul REVIS */
--color-accent: #F37C87       /* Rosa */
--color-success: #E84E1B      /* Laranja */
--color-warning: #F6E14E      /* Amarelo */
--color-background-brand: #8C64EB  /* Roxo */
--color-surface: #F9FAFB      /* Cinza claro */
--color-text: #1F2937         /* Cinza escuro */
```

## ✅ Benefícios da Nova Estrutura

### ✨ Clareza
- ✅ Código separado da documentação
- ✅ Contextos bem definidos
- ✅ Fácil navegação

### 🔍 Manutenibilidade
- ✅ Um lugar para cada coisa
- ✅ Imports consistentes com `@/`
- ✅ Fácil localizar arquivos

### 📈 Escalabilidade
- ✅ Estrutura preparada para crescer
- ✅ Pastas contextualizadas prontas para novos componentes
- ✅ Separação clara de responsabilidades

### 🤝 Colaboração
- ✅ Estrutura padrão da comunidade
- ✅ Documentação organizada
- ✅ Fácil onboarding de novos desenvolvedores

## 🚀 Próximos Passos

Com a estrutura organizada, o desenvolvimento pode focar em:

1. **Implementar Autenticação** (`src/lib/auth.ts`)
2. **Criar hooks Firebase** (`src/hooks/`)
3. **Desenvolver telas** (`src/components/inventory/`, etc.)
4. **Adicionar páginas** (`app/estoque/`, `app/pedidos/`, etc.)

---

**Estrutura organizada em**: 09/11/2025  
**Status**: ✅ Pronta para desenvolvimento
