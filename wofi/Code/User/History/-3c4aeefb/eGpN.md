# Rotas de Tarefas - Dashboard Thera

Este documento descreve as novas rotas de gerenciamento de tarefas implementadas no dashboard.

## Rotas Implementadas

### 1. `/dashboard/tasks/my` - Minhas Tarefas
**Propósito**: Visualização personalizada das tarefas do usuário logado

**Funcionalidades**:
- Dashboard pessoal com estatísticas específicas do usuário
- Filtros avançados (por projeto, status, prioridade, data)
- Calendário lateral com integração de prazos
- Seção de tarefas favoritas/estreladas
- Gráfico de progresso pessoal
- Sistema de busca e ordenação

**Componentes utilizados**:
- `StatCard` para estatísticas
- `Calendar` para visualização de datas
- `DataTable` para listagem
- `FadeIn` e `StaggeredList` para animações

### 2. `/dashboard/tasks/kanban` - Visualização Kanban
**Propósito**: Board Kanban interativo com funcionalidade de drag & drop

**Funcionalidades**:
- Colunas organizadas por status (To Do, In Progress, Review, Done)
- Drag & drop entre colunas usando @dnd-kit
- Cards de tarefa com informações completas
- Menu de contexto para ações rápidas
- Filtros por prioridade e responsável
- Atualização em tempo real do status

**Dependências principais**:
- `@dnd-kit/core` - Core do drag & drop
- `@dnd-kit/sortable` - Funcionalidade de ordenação
- `@dnd-kit/utilities` - Utilitários auxiliares

**Componentes customizados**:
- `KanbanTaskCard` - Cards individuais das tarefas
- `KanbanColumn` - Colunas do board
- `DndContext` - Contexto de drag & drop

### 3. `/dashboard/tasks/timeline` - Timeline de Atividades
**Propósito**: Visualização cronológica das atividades e eventos das tarefas

**Funcionalidades**:
- Timeline visual com eventos organizados por data
- Filtros por tipo de evento e período
- Estatísticas de atividade
- Navegação por datas
- Eventos categorizados (criação, atualização, conclusão, comentários)
- Indicadores visuais por tipo de atividade

**Tipos de eventos suportados**:
- `created` - Tarefa criada
- `updated` - Tarefa atualizada
- `completed` - Tarefa concluída
- `assigned` - Tarefa atribuída
- `commented` - Comentário adicionado
- `status_changed` - Status alterado

## Navegação

### Sidebar (AppSidebar)
As rotas estão integradas no menu principal na seção "Projetos > Tarefas":
- Minhas Tarefas → `/dashboard/tasks/my`
- Kanban → `/dashboard/tasks/kanban`
- Timeline → `/dashboard/tasks/timeline`

### Página Principal de Tarefas
A página `/dashboard/tasks` inclui botões de navegação rápida para alternar entre as diferentes visualizações.

## Estrutura de Arquivos

```
src/app/dashboard/tasks/
├── page.tsx           # Lista principal de tarefas
├── my/
│   └── page.tsx       # Tarefas pessoais do usuário
├── kanban/
│   └── page.tsx       # Board Kanban interativo
└── timeline/
    └── page.tsx       # Timeline de atividades
```

## Recursos Compartilhados

Todas as rotas utilizam:
- **Design System**: Componentes UI consistentes (shadcn/ui)
- **Animações**: FadeIn e StaggeredList para transições suaves
- **Estados**: Zustand para gerenciamento de estado global
- **Autenticação**: useAuthStore para dados do usuário
- **Responsividade**: Layout adaptável para desktop e mobile

## Próximos Passos

1. **Integração com Backend**: Conectar com APIs reais
2. **Notificações**: Sistema de notificações em tempo real
3. **Colaboração**: Recursos de colaboração entre usuários
4. **Exportação**: Funcionalidades de export/import
5. **Métricas Avançadas**: Dashboards analíticos mais detalhados

## Tecnologias Utilizadas

- **Next.js 15.5.3**: Framework React com App Router
- **React 19.1.0**: Biblioteca para interface
- **@dnd-kit**: Drag & drop functionality
- **@tanstack/react-table**: Tabelas interativas
- **Tailwind CSS**: Estilização
- **Lucide React**: Ícones
- **date-fns**: Manipulação de datas