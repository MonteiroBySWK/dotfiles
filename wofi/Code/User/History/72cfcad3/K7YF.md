# Dashboard Thera - Sistema de Gestão Empresarial Avançado

[![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-12.3.0-orange?logo=firebase)](https://firebase.google.com/)

> **Sistema completo de gestão empresarial** com dashboard moderno, arquitetura de componentes reutilizáveis e experiência de usuário otimizada para produtividade máxima.

Um sistema completo de gestão de projetos empresariais desenvolvido com Next.js, TypeScript, Firebase e Zustand.

![Dashboard Preview](./public/dashboard-preview.png)

## 🚀 Funcionalidades Principais

### � Dashboard Analítico Avançado
- **Visão Geral Executiva**: Métricas em tempo real com KPIs personalizáveis usando componentes StatCard
- **Gráficos Interativos**: Charts responsivos com bibliotecas Recharts e animações suaves
- **Filtros Inteligentes**: Sistema avançado de filtros por período, categoria, status e usuário
- **Responsividade Total**: Interface adaptativa para desktop, tablet e mobile

### 🎯 Gestão de Projetos Inteligente
- **Kanban Board**: Drag & drop com @dnd-kit para organização visual intuitiva
- **Timeline/Gantt**: Acompanhamento de prazos, dependências e marcos críticos
- **Relatórios Dinâmicos**: Análise de produtividade, performance e ROI por projeto
- **Colaboração em Tempo Real**: Sistema de comentários, notificações e atualizações

### 👥 Gerenciamento de Equipe Completo
- **Perfis Avançados**: Sistema robusto de roles, permissões e hierarquia organizacional
- **Timeline de Atividades**: Histórico detalhado de ações, commits e colaboração
- **Métricas de Performance**: Analytics individuais e por equipe com dashboards personalizados
- **Onboarding Automatizado**: Sistema de integração para novos funcionários

### � Módulo Financeiro Empresarial
- **Gestão de Contratos**: Ciclo completo de contratos, propostas e renovações
- **Faturamento Inteligente**: Emissão automatizada, templates e controle de vencimentos
- **Orçamentos Dinâmicos**: Planejamento financeiro, projeções e controle de custos
- **Pagamentos Centralizados**: Rastreamento de recebimentos, pagamentos e conciliação

### 🎨 Sistema de Design Avançado
- **Componentes Reutilizáveis**: Biblioteca completa com 70% menos código repetitivo
- **Animações Modernas**: Transições suaves com FadeIn, StaggeredList e micro-interações
- **Temas Dinâmicos**: Suporte completo a modo claro/escuro com next-themes
- **Acessibilidade (WCAG)**: Conformidade total com padrões de acessibilidade web

## 🏗️ Arquitetura Técnica

### 🎯 Frontend Moderno
- **Framework**: Next.js 15.5.3 com App Router e Turbopack para performance máxima
- **Linguagem**: TypeScript 5.x com type safety completo e inferência automática
- **Estilização**: Tailwind CSS 4.x + shadcn/ui com design system enterprise
- **Ícones**: Lucide React com biblioteca completa de ícones modernos
- **Formulários**: React Hook Form + Zod validation para validação robusta
- **Animações**: Framer Motion integrado para micro-interações suaves

### 🏗️ Arquitetura de Componentes Enterprise

#### **Sistema de Componentes Reutilizáveis**
- **Arquitetura Modular**: Baseada em composição e atomic design principles
- **Redução de Código**: 70% menos código repetitivo com componentes inteligentes
- **Type Safety**: TypeScript completo com interfaces bem definidas
- **Performance**: Lazy loading e code splitting automático

#### **🧩 Componentes Core**

**StatCard** - Componente principal para KPIs e métricas:
```typescript
interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  change?: string;
  icon?: LucideIcon;
  iconColor?: string;
  variant?: 'default' | 'compact' | 'detailed';
}
```

**Componentes de Loading Avançados**:
- `LoadingSpinner`: Spinner customizável com variantes (default, dots, pulse)
- `LoadingOverlay`: Overlay com backdrop blur para operações assíncronas
- `ProgressBar`: Barras de progresso lineares com cores semânticas
- `CircularProgress`: Progresso circular para dashboards
- `RefreshButton`: Botão de refresh com estado de carregamento

**Componentes de Interface**:
- `StatusBadge`: Badges semânticos com sistema de cores consistente
- `ResponsiveGrid`: Grid system com breakpoints otimizados
- `StatsGrid`: Container especializado para grupos de StatCards
- `ActionDropdown`: Dropdown contextual com ações customizáveis
- `FormDialog`: Modais inteligentes para formulários complexos

**Componentes de Animação**:
- `FadeIn`: Animação de entrada suave com delay configurável
- `StaggeredList`: Lista com animação escalonada de itens
- `SlideIn`: Transições direcionais para navegação

### 📦 Estado Global Avançado
- **Store Management**: Zustand 5.x com middleware de persistência
- **Arquitetura Modular**: Stores separados por domínio
- **Stores Implementados**:
  - `authStore`: Autenticação, sessão e permissões de usuário
  - `projectStore`: Projetos, tarefas e colaboração
  - `appStore`: Configurações globais, preferências e temas
  - `memberStore`: Gestão de equipe e roles

### 🔧 Backend & Infraestrutura
- **Autenticação**: Firebase Authentication 12.3.0 com múltiplos providers
- **Banco de Dados**: Firestore (NoSQL) com regras de segurança avançadas
- **Storage**: Firebase Storage para arquivos e assets
- **Real-time**: WebSocket integration para atualizações em tempo real
- **Hosting**: Vercel com Edge Functions e CDN global
- **Analytics**: Métricas de performance e uso integradas

### Estrutura de Dados

```typescript
// Usuário
interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// Projeto
interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'in-progress' | 'completed' | 'paused';
  team: number;
  progress: number;
  deadline: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  budget: string;
  client: string;
  owner: string; // UID do usuário
}

// Tarefa
interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee?: string;
  dueDate?: string;
}
```

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Conta no Firebase
- Git

### 1. Clone o Repositório
```bash
git clone https://github.com/seu-usuario/dashboards-thera.git
cd dashboards-thera
```

### 2. Instale as Dependências
```bash
npm install
# ou
yarn install
```

### 3. Configure o Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto
3. Ative Authentication (Email/Password + Google)
4. Crie um banco Firestore
5. Copie as configurações do projeto

### 4. Configure as Variáveis de Ambiente
```bash
cp .env.local.example .env.local
```

Edite `.env.local` com suas credenciais do Firebase:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
```

### 5. Execute o Projeto
```bash
npm run dev
# ou
yarn dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

### 6. Build para Produção
```bash
npm run build
npm start
# ou
yarn build
yarn start
```

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js
│   ├── dashboard/         # Páginas do dashboard
│   │   ├── analytics/    # Análises e relatórios
│   │   ├── clients/      # Gestão de clientes
│   │   ├── projects/     # Gerenciamento de projetos
│   │   ├── team/         # Equipe e recursos humanos
│   │   ├── financial/    # Módulo financeiro
│   │   │   ├── contracts/   # Contratos
│   │   │   ├── invoicing/   # Faturamento
│   │   │   ├── budgets/     # Orçamentos
│   │   │   └── payments/    # Pagamentos
│   │   ├── support/      # Suporte e documentação
│   │   │   ├── help/        # Central de ajuda
│   │   │   └── docs/        # Documentação
│   │   └── hr/           # Recursos humanos
│   │       └── onboarding/  # Integração de funcionários
│   ├── login/            # Página de login
│   └── layout.tsx        # Layout raiz com providers
├── components/           # Componentes React
│   ├── common/          # Componentes reutilizáveis
│   │   ├── stat-card.tsx     # Componente principal de KPIs
│   │   ├── status-badge.tsx  # Badges de status
│   │   ├── responsive-grid.tsx # Grid responsivo
│   │   ├── stats-grid.tsx    # Container de estatísticas
│   │   ├── action-dropdown.tsx # Dropdown de ações
│   │   └── form-dialog.tsx   # Modais de formulário
│   ├── ui/              # Componentes base (shadcn/ui)
│   ├── providers/       # Providers e contextos
│   ├── projects/        # Componentes específicos de projetos
│   └── *.tsx           # Componentes gerais
├── stores/             # Stores do Zustand
│   ├── authStore.ts   # Estado de autenticação
│   ├── projectStore.ts # Estado de projetos
│   └── appStore.ts    # Estado da aplicação
├── lib/               # Utilitários e configurações
│   ├── firebase/     # Configuração Firebase
│   └── utils.ts     # Funções auxiliares
└── hooks/            # Custom hooks
```

## 🎨 Design System

### Cores Principais
- **Primary**: Blue (#3B82F6)
- **Secondary**: Purple (#8B5CF6)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)

### Componentes UI
Todos os componentes seguem o padrão shadcn/ui:
- Consistência visual
- Acessibilidade (WCAG)
- Temas claro/escuro
- Responsividade mobile-first

### Arquitetura de Componentes

#### StatCard - Componente Principal de KPIs
- **Uso**: Exibição padronizada de métricas e estatísticas
- **Responsividade**: Automática com breakpoints md/lg
- **Customização**: Suporte a ícones, cores e variações
- **Benefícios**: Redução de 70% do código repetitivo

#### Padrão Responsivo
```css
/* Grid responsivo padrão */
.stats-grid {
  grid-template-columns: 1fr;                    /* mobile */
  md:grid-template-columns: repeat(2, 1fr);      /* tablet */
  lg:grid-template-columns: repeat(4, 1fr);      /* desktop */
}
```

#### Exemplo de Uso do StatCard
```tsx
<StatCard
  title="Total de Clientes"
  value="1,234"
  description="Clientes ativos no sistema"
  change="+12% este mês"
  icon={Users}
  iconColor="text-blue-600"
/>
```

## 🚀 Deploy

### Vercel (Recomendado)
```bash
# Instale a CLI da Vercel
npm i -g vercel

# Deploy
vercel

# Configure as variáveis de ambiente no painel da Vercel
```

### Firebase Hosting
```bash
# Instale a CLI do Firebase
npm install -g firebase-tools

# Faça login
firebase login

# Inicialize o projeto
firebase init hosting

# Deploy
npm run build
firebase deploy
```

## 🧪 Testes

```bash
# Executar testes
npm run test

# Testes com cobertura
npm run test:coverage

# Testes E2E
npm run test:e2e
```

## 📱 PWA e Mobile

O sistema é otimizado para:
- **Responsividade**: Layout adaptativo para mobile/tablet/desktop
- **PWA Ready**: Configurado para ser instalado como app
- **Performance**: Lazy loading e otimizações de bundle
- **SEO**: Meta tags e estrutura semântica

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a MIT License. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte

Para suporte e dúvidas:
- **Email**: suporte@dashboardthera.com
- **Issues**: [GitHub Issues](https://github.com/seu-usuario/dashboards-thera/issues)
- **Documentação**: [Wiki do Projeto](https://github.com/seu-usuario/dashboards-thera/wiki)

---

Desenvolvido com ❤️ por [Seu Nome](https://github.com/seu-usuario)
