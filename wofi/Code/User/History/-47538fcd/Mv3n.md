# Varejo Rápido

## Descrição Geral

Sistema de visualização e gerenciamento de dados de vendas desenvolvido com Next.js 15, React 19 e shadcn/ui. O projeto oferece uma interface moderna e responsiva para visualizar, filtrar e gerenciar dados de vendas, com funcionalidades de upload de arquivos .dat, integração com API Java Spring Boot e animações GSAP.

## Características Principais

### 🎨 Interface
- Design moderno usando shadcn/ui exclusivamente
- Interface totalmente responsiva
- Animações suaves com GSAP
- Toast notifications animados com Sonner
- Tema claro/escuro (sistema)

### 📊 Funcionalidades de Dados
- Visualização de dados de vendas em tabela paginada
- Busca em tempo real (não bloqueia digitação)
- Ordenação por múltiplos campos
- Paginação server-side
- Upload e processamento de arquivos .dat
- Preview de dados antes da confirmação

### 🚀 Performance
- Server-side pagination para grandes volumes de dados
- AbortController para cancelar requisições desnecessárias
- Lazy loading e otimizações de renderização
- Animações otimizadas para 60fps

### 🔌 Integração
- API Java Spring Boot no backend (porta 8080)
- Proxy CORS integrado no Next.js
- Processamento de arquivos .dat no frontend
- Sistema de cache e invalidação automática

## Stack Tecnológica

### Frontend
- **Next.js 15.5.4** - Framework React com App Router
- **React 19.1.0** - Biblioteca de interface
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Estilização utilitária
- **shadcn/ui** - Componentes de interface
- **GSAP** - Animações avançadas
- **Sonner** - Toast notifications

### Backend Integration
- **Java Spring Boot** - API REST (localhost:8080)
- **CORS Proxy** - Integração via API Routes do Next.js

### Ferramentas de Desenvolvimento
- **ESLint** - Linting de código
- **PostCSS** - Processamento de CSS
- **TypeScript Config** - Configuração de tipos

## Estrutura de Arquivos

```
varejo_rapido/
├── docs/                           # Documentação do projeto
├── public/                         # Arquivos estáticos
├── src/
│   ├── app/                        # App Router (Next.js 15)
│   │   ├── api/                    # API Routes (Proxy CORS)
│   │   │   ├── confirm-dat/        # Confirmação de upload .dat
│   │   │   ├── upload-dat/         # Upload de arquivos .dat
│   │   │   └── vendas/             # Endpoints de vendas
│   │   │       ├── buscar/         # Busca de vendas
│   │   │       └── paginado/       # Paginação de vendas
│   │   ├── layout.tsx              # Layout raiz com Toaster
│   │   └── page.tsx                # Página principal
│   ├── components/
│   │   ├── custom/                 # Componentes específicos do projeto
│   │   │   ├── dat-file-upload.tsx # Modal de upload .dat
│   │   │   ├── dat-preview-modal.tsx # Modal de preview
│   │   │   ├── sales-table.tsx     # Tabela principal de vendas
│   │   │   └── sales-table-skeleton.tsx # Skeleton loader
│   │   └── ui/                     # Componentes shadcn/ui
│   ├── hooks/                      # Hooks customizados
│   │   ├── use-gsap.ts            # Utilitários de animação GSAP
│   │   ├── use-animated-toast.ts   # Toast notifications animados
│   │   └── use-mobile.ts          # Detecção de dispositivo móvel
│   ├── lib/                        # Utilitários e helpers
│   │   ├── dat-processor.ts        # Processamento de arquivos .dat
│   │   ├── formatters.ts           # Formatação de dados
│   │   └── utils.ts                # Utilitários gerais
│   └── types/                      # Definições de tipos TypeScript
│       ├── sales.ts                # Tipos de dados de vendas
│       └── sorting.ts              # Tipos de ordenação
├── components.json                 # Configuração shadcn/ui
├── eslint.config.mjs              # Configuração ESLint
├── next.config.ts                 # Configuração Next.js
├── package.json                   # Dependências e scripts
├── postcss.config.mjs             # Configuração PostCSS
├── tailwind.config.ts             # Configuração Tailwind
└── tsconfig.json                  # Configuração TypeScript
```

## Fluxo de Dados

### 1. Carregamento Inicial
```
Page Load → SalesTable → fetchSalesData() → API Proxy → Java Backend → Database
```

### 2. Upload de Arquivo
```
User Upload → DatFileUpload → dat-processor → DatPreviewModal → Confirm → API → Database
```

### 3. Busca e Filtros
```
User Input → searchSalesData() → AbortController → API Proxy → Java Backend → Results
```

### 4. Paginação
```
Page Change → fetchSalesData(page, size) → API Proxy → Java Backend → Paginated Results
```

## Principais Componentes

### SalesTable
- Componente principal de visualização de dados
- Paginação server-side com controles
- Busca em tempo real com debounce
- Ordenação client-side para campos aninhados
- Animações GSAP para interações

### DatFileUpload
- Modal de upload com drag & drop
- Validação de arquivos .dat
- Feedback visual com animações
- Integração com processador de arquivos

### DatPreviewModal
- Preview dos dados antes da confirmação
- Resumo estatístico dos dados
- Tabela scrollável com dados formatados
- Animações de entrada e saída

## Configurações e Padrões

### Animações GSAP
- **fadeIn**: Aparição suave de elementos
- **slideInLeft/Right**: Entrada lateral
- **scaleIn**: Crescimento para modais
- **bounce**: Feedback de clique
- **staggerFadeIn**: Animação sequencial de listas

### Tratamento de Erros
- Toast notifications para feedback ao usuário
- Fallbacks gracefuos para falhas de API
- Validação client-side para uploads
- Logs estruturados para desenvolvimento

### Performance
- Paginação server-side para grandes datasets
- AbortController para cancelar requisições
- Debounce na busca para reduzir requisições
- Lazy loading de componentes pesados

## Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # Verificação de código
```

## Próximos Passos

- [ ] Implementar autenticação de usuários
- [ ] Adicionar dashboard com gráficos
- [ ] Exportação de dados (PDF, Excel)
- [ ] Filtros avançados por data/categoria
- [ ] Sistema de notificações em tempo real
- [ ] Testes automatizados (Jest, Cypress)

## Licença

Projeto privado - Todos os direitos reservados.