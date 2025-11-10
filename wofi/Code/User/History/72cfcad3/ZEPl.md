# Dashboard Thera - Sistema de Gestão Empresarial Avançado

[![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-12.3.0-orange?logo=firebase)](https://firebase.google.com/)

> **Sistema completo de gestão empresarial** com dashboard moderno, arquitetura de componentes reutilizáveis e experiência de usuário otimizada para produtividade máxima.

Um sistema completo de gestão de projetos empresariais desenvolvido com Next.js, TypeScript, Firebase e Zustand.

![Dashboard Preview](./public/dashboard-preview.png)

## 🚀 Funcionalidades

### 🔐 Sistema de Autenticação
- **Login com Email/Senha**: Autenticação tradicional com Firebase Auth
- **Login com Google**: Integração com OAuth do Google
- **Cadastro de Usuários**: Criação de contas com nome personalizado
- **Recuperação de Senha**: Reset de senha via email
- **Gerenciamento de Perfil**: Atualização de nome e foto do usuário

### 📊 Dashboard Principal
- **Visão Geral**: Métricas de projetos, tarefas e prazos
- **Cards Estatísticos**: Projetos ativos, tarefas pendentes, prazos próximos
- **Lista de Projetos**: Visualização de todos os projetos com status
- **Navegação Rápida**: Acesso direto às ferramentas de cada projeto

### 🎯 Gerenciamento de Projetos
- **Estrutura Dinâmica**: Rotas dinâmicas `/dashboard/projects/[projectId]`
- **CRUD Completo**: Criar, editar, deletar projetos e tarefas
- **Estados de Projeto**: Planejamento, Em Andamento, Concluído, Pausado
- **Prioridades**: Low, Medium, High, Critical
- **Equipes e Orçamentos**: Controle de recursos e custos

### 🛠️ Ferramentas de Projeto

#### 📋 Kanban Board
- **Colunas Personalizáveis**: Todo, In Progress, Done
- **Drag & Drop**: Movimentação intuitiva de tarefas
- **Cards Detalhados**: Títulos, descrições, prioridades, responsáveis
- **Filtros Avançados**: Por status, prioridade, responsável

#### 📅 Gráfico de Gantt
- **Timeline Visual**: Visualização temporal dos projetos
- **Dependências**: Relações entre tarefas
- **Marcos (Milestones)**: Pontos importantes do projeto
- **Controles de Zoom**: Visualização por dias, semanas, meses

#### 📝 Backlog Management
- **User Stories**: Histórias de usuário estruturadas
- **Sprints**: Organização em sprints de desenvolvimento
- **Estimativas**: Pontuação de story points
- **Priorização**: Reordenação por valor de negócio

#### 📋 Gestão de Requisitos
- **Tipos de Requisito**: Funcional, Não-funcional, Negócio, Técnico
- **Rastreabilidade**: Acompanhamento do desenvolvimento
- **Validação**: Status de aprovação e testes
- **Documentação**: Descrições detalhadas e critérios

### ⚙️ Configurações do Sistema
- **Perfil do Usuário**: Edição de dados pessoais
- **Notificações**: Controle de alertas e emails
- **Aparência**: Tema claro/escuro
- **Segurança**: Configurações de privacidade
- **Integrações**: APIs e webhooks externos

## 🏗️ Arquitetura Técnica

### Frontend
- **Framework**: Next.js 15 com App Router
- **Linguagem**: TypeScript para type safety
- **Estilização**: Tailwind CSS + shadcn/ui
- **Ícones**: Lucide React
- **Formulários**: React Hook Form + Zod validation

### Sistema de Componentes
- **Componentes Reutilizáveis**: Arquitetura modular baseada em composição
- **StatCard**: Componente principal para KPIs e métricas (redução de 70% de código)
- **Responsive Design**: Sistema responsivo com breakpoints consistentes
- **TypeScript**: Type safety completo com interfaces bem definidas

#### 🧩 Componentes Principais

**StatCard** - Componente para estatísticas e KPIs:
```typescript
interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  change?: string;
  icon?: LucideIcon;
  iconColor?: string;
}
```

**Componentes Base**:
- `StatusBadge`: Badges para status com cores semânticas
- `ResponsiveGrid`: Grid responsivo padronizado
- `StatsGrid`: Container para grupos de StatCards
- `ActionDropdown`: Dropdown de ações contextuais
- `FormDialog`: Modais para formulários

### Estado Global
- **Store Management**: Zustand com persist middleware
- **Stores Separados**:
  - `authStore`: Autenticação e usuário
  - `projectStore`: Projetos e tarefas
  - `appStore`: Configurações da aplicação

### Backend & Database
- **Autenticação**: Firebase Authentication
- **Banco de Dados**: Firestore (NoSQL)
- **Storage**: Firebase Storage para arquivos
- **Hosting**: Vercel (recomendado)

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
