# Firebase Integration with Zustand Stores

## 📋 Visão Geral

Este projeto implementa uma arquitetura completa de integração Firebase com gerenciamento de estado usando Zustand. A arquitetura segue o padrão Repository → Service → Store, proporcionando uma separação clara de responsabilidades e facilidade de manutenção.

## 🏗️ Arquitetura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Components    │───▶│   Zustand       │───▶│   Services      │───▶│  Repositories   │
│   (UI Layer)    │    │   Stores        │    │ (Business Logic)│    │  (Data Layer)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
                                                                              │
                                                                              ▼
                                                                   ┌─────────────────┐
                                                                   │   Firebase      │
                                                                   │   Firestore     │
                                                                   └─────────────────┘
```

## 📁 Estrutura de Pastas

```
src/
├── lib/
│   ├── firebase.ts              # Configuração Firebase
│   └── firebase/
│       └── config.ts           # Configurações específicas
├── repositories/
│   ├── base.repository.ts      # Repository base com métodos CRUD
│   ├── user.repository.ts      # Repository de usuários
│   ├── project.repository.ts   # Repository de projetos
│   ├── task.repository.ts      # Repository de tarefas
│   ├── client.repository.ts    # Repository de clientes
│   ├── notification.repository.ts # Repository de notificações
│   ├── ticket.repository.ts    # Repository de tickets
│   └── index.ts               # Exports dos repositories
├── services/
│   ├── AuthService.ts         # Serviço de autenticação
│   ├── UserService.ts         # Serviço de usuários
│   ├── ProjectService.ts      # Serviço de projetos
│   ├── TaskService.ts         # Serviço de tarefas
│   ├── ClientService.ts       # Serviço de clientes
│   ├── NotificationService.ts # Serviço de notificações
│   └── TicketService.ts       # Serviço de tickets
└── stores/
    ├── authStore.ts           # Store de autenticação
    ├── userStore.ts           # Store de usuários
    ├── projectStore.ts        # Store de projetos
    ├── taskStore.ts           # Store de tarefas
    ├── clientStore.ts         # Store de clientes
    ├── notificationStore.ts   # Store de notificações
    ├── ticketStore.ts         # Store de tickets
    └── index.ts              # Exports dos stores
```

## 🔧 Configuração Firebase

### Arquivo `lib/firebase.ts`
- Inicialização do Firebase App
- Configuração dos serviços (Firestore, Auth, Storage, Functions)
- Conexão automática com emulators em desenvolvimento
- Tratamento de erros de conexão

### Variáveis de Ambiente
```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

## 📚 Camada de Repositories

### BaseRepository
Fornece funcionalidades básicas para todos os repositories:
- ✅ CRUD completo (create, read, update, delete)
- ✅ Consultas avançadas com filtros, ordenação e paginação
- ✅ Subscriptions em tempo real (onSnapshot)
- ✅ Contagem de documentos
- ✅ Verificação de existência
- ✅ Consultas por campos específicos

### Repositories Específicos
Cada entidade possui seu próprio repository que estende o BaseRepository:
- **UserRepository**: Consultas por email, role, status
- **ProjectRepository**: Consultas por cliente, manager, status
- **TaskRepository**: Consultas por projeto, assignee, status
- **ClientRepository**: Consultas por tipo, status
- **NotificationRepository**: Consultas por usuário, tipo, leitura
- **TicketRepository**: Consultas por assignee, reporter, categoria

## ⚙️ Camada de Services

### Responsabilidades
- Lógica de negócio
- Validação de dados
- Transformação de dados
- Coordenação entre múltiplos repositories
- Cálculos e estatísticas

### Services Implementados

#### AuthService
- Login/logout com email e senha
- Login com Google
- Registro de novos usuários
- Reset de password
- Gerenciamento de sessão

#### UserService
- CRUD de usuários
- Ativação/desativação
- Busca e filtros
- Estatísticas de usuários

#### ProjectService
- CRUD de projetos
- Gerenciamento de equipe
- Controle de progresso e status
- Orçamento e datas
- Estatísticas de projetos

#### TaskService
- CRUD de tarefas
- Sistema de comentários
- Checklist items
- Estimativas e horas reais
- Dependências e watchers

#### ClientService
- CRUD de clientes
- Associação com projetos
- Classificação por tipo
- Histórico de interações

#### NotificationService
- Sistema de notificações
- Diferentes tipos (info, success, warning, error)
- Notificações para múltiplos usuários
- Marcação de leitura
- Limpeza automática

#### TicketService
- Sistema de tickets/chamados
- Categorização (bug, feature, support)
- Priorização
- Atribuição e transferência
- Histórico de status

## 🗄️ Camada de Stores (Zustand)

### Características
- Estado global da aplicação
- Persistência automática (quando necessário)
- DevTools integration
- Tipagem completa com TypeScript

### Padrão dos Stores

Cada store segue a mesma estrutura:

```typescript
interface EntityState {
  // Data
  entities: Entity[]
  currentEntity: Entity | null
  stats: EntityStats | null
  loading: boolean
  error: string | null
  searchResults: Entity[]
  searchLoading: boolean
  
  // Actions
  fetchEntities: () => Promise<void>
  fetchEntityById: (id: string) => Promise<Entity | null>
  createEntity: (data: Omit<Entity, 'id'>) => Promise<string>
  updateEntity: (id: string, data: Partial<Entity>) => Promise<void>
  deleteEntity: (id: string) => Promise<void>
  searchEntities: (query: string) => Promise<void>
  
  // Utils
  setCurrentEntity: (entity: Entity | null) => void
  clearError: () => void
  clearEntities: () => void
}
```

### AuthStore
- Gerenciamento de autenticação
- Estado do usuário logado
- Persistência de sessão
- Loading states

### UserStore
- Lista de usuários
- Filtros e buscas
- Estatísticas
- Gerenciamento de roles

### ProjectStore
- Projetos e suas informações
- Gerenciamento de equipe
- Progresso e milestones
- Estatísticas de projetos

### TaskStore
- Tarefas e subtarefas
- Sistema de comentários
- Checklist progress
- Filtros por status/priority

### ClientStore
- Clientes e empresas
- Projetos associados
- Histórico de interações
- Classificações

### NotificationStore
- Notificações do usuário
- Contadores não lidas
- Marcação de leitura
- Filtros por tipo

### TicketStore
- Sistema de tickets
- Atribuições
- Estados e prioridades
- Categorização

## 🔍 Como Usar

### 1. Em Componentes React

```typescript
import { useProjectStore } from '@/stores'

function ProjectList() {
  const { 
    projects, 
    loading, 
    error, 
    fetchProjects,
    createProject 
  } = useProjectStore()
  
  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])
  
  const handleCreateProject = async (data) => {
    try {
      await createProject(data)
      // Projeto criado com sucesso
    } catch (error) {
      // Tratar erro
    }
  }
  
  if (loading) return <Loading />
  if (error) return <Error message={error} />
  
  return (
    <div>
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}
```

### 2. Busca e Filtros

```typescript
function TaskFilters() {
  const { 
    fetchTasksByStatus, 
    fetchTasksByPriority,
    searchTasks,
    clearSearch 
  } = useTaskStore()
  
  return (
    <div>
      <button onClick={() => fetchTasksByStatus('todo')}>
        Tarefas To-Do
      </button>
      <button onClick={() => fetchTasksByPriority('high')}>
        Alta Prioridade
      </button>
      <input 
        onChange={(e) => searchTasks(e.target.value)}
        placeholder="Buscar tarefas..."
      />
    </div>
  )
}
```

### 3. Tempo Real

```typescript
function RealTimeNotifications() {
  const { notifications, fetchUserNotifications } = useNotificationStore()
  const { user } = useAuthStore()
  
  useEffect(() => {
    if (user?.id) {
      // Busca inicial
      fetchUserNotifications(user.id)
      
      // Configura listener em tempo real via service
      const unsubscribe = notificationService.subscribeToUserNotifications(
        user.id,
        (newNotifications) => {
          // Store será atualizado automaticamente
        }
      )
      
      return unsubscribe
    }
  }, [user?.id])
  
  return (
    <div>
      {notifications.map(notification => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  )
}
```

## 🚀 Benefícios da Arquitetura

### 1. Separação de Responsabilidades
- **Repositories**: Apenas acesso a dados
- **Services**: Lógica de negócio pura
- **Stores**: Estado global e sincronização com UI

### 2. Testabilidade
- Cada camada pode ser testada independentemente
- Mocking facilitado pela separação
- Testes unitários e de integração

### 3. Manutenibilidade
- Código organizado e modular
- Fácil localização de bugs
- Mudanças isoladas por responsabilidade

### 4. Escalabilidade
- Fácil adição de novas entidades
- Padrões consistentes
- Reutilização de código

### 5. Performance
- Cache automático nos stores
- Atualizações otimizadas
- Lazy loading quando necessário

## 🔧 Desenvolvimento

### Adicionar Nova Entidade

1. **Criar o tipo** em `src/types/index.ts`
2. **Criar repository** em `src/repositories/`
3. **Criar service** em `src/services/`
4. **Criar store** em `src/stores/`
5. **Exportar** nos arquivos `index.ts`

### Debugging

Os stores incluem integração com Redux DevTools para facilitar o debugging:

```typescript
// Ativar DevTools
const store = create<State>()(
  devtools(
    (set, get) => ({ ... }),
    { name: 'store-name' }
  )
)
```

## 📊 Monitoramento

### Logs de Firebase
- Configurados para desenvolvimento e produção
- Captura de erros automática
- Métricas de performance

### Estado da Aplicação
- Todas as operações são trackadas nos stores
- Estados de loading e erro consistentes
- Histórico de ações no DevTools

## 🔒 Segurança

### Firestore Rules
Configuradas em `firestore.rules` para:
- Autenticação obrigatória
- Autorização baseada em roles
- Validação de dados

### Validação
- Validação no frontend (stores/services)
- Validação no backend (Firestore rules)
- Sanitização de dados

## 📈 Performance

### Otimizações Implementadas
- Lazy loading de dados
- Cache nos stores
- Paginação automática
- Queries otimizadas

### Best Practices
- Uso de índices compostos
- Limitação de resultados
- Cleanup de listeners
- Debounce em buscas

---

Esta arquitetura proporciona uma base sólida e escalável para o desenvolvimento de aplicações complexas com Firebase e React/Next.js.