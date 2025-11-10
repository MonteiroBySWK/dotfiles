# Firebase Integration - Dashboard Thera

Este documento descreve a integração completa do Firebase no Dashboard Thera, incluindo estrutura de dados, repositórios, autenticação e configuração.

## 📁 Estrutura do Projeto

```
src/
├── lib/
│   └── firebase.ts                 # Configuração do Firebase
├── repositories/
│   ├── base.repository.ts          # Repositório base genérico
│   ├── user.repository.ts          # Repositório de usuários
│   ├── project.repository.ts       # Repositório de projetos
│   ├── task.repository.ts          # Repositório de tarefas
│   ├── client.repository.ts        # Repositório de clientes
│   ├── notification.repository.ts  # Repositório de notificações
│   ├── ticket.repository.ts        # Repositório de tickets
│   └── index.ts                   # Exports e instâncias
├── services/
│   └── auth.service.ts            # Serviço de autenticação
├── hooks/
│   └── useFirebase.ts             # Hooks customizados
├── scripts/
│   └── init-firebase-data.ts      # Script de dados de exemplo
└── types/
    └── index.ts                   # Tipos TypeScript expandidos
```

## 🔧 Configuração

### 1. Variáveis de Ambiente

Copie `.env.example` para `.env.local` e configure:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-your_measurement_id
```

### 2. Firebase Emulators (Desenvolvimento)

Para desenvolvimento local, use os emulators do Firebase:

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Fazer login
firebase login

# Inicializar projeto
firebase init

# Iniciar emulators
firebase emulators:start
```

Emulators configurados:
- **Firestore**: localhost:8080
- **Auth**: localhost:9099
- **Storage**: localhost:9199
- **Functions**: localhost:5001
- **UI**: localhost:4000

## 🗄️ Estrutura de Dados

### Coleções Principais

#### `users`
- **Propósito**: Dados dos usuários do sistema
- **Índices**: `companyId`, `role`, `teamIds`, `status`
- **Segurança**: Usuários podem ler/editar próprios dados, admins têm acesso total

#### `projects`
- **Propósito**: Projetos e seus dados
- **Índices**: `status`, `managerId`, `clientId`
- **Segurança**: Membros da equipe podem ler, managers podem editar

#### `tasks`
- **Propósito**: Tarefas dos projetos
- **Índices**: `status`, `assigneeId`, `projectId`, `dueDate`
- **Segurança**: Assignees e watchers podem ler/editar

#### `clients`
- **Propósito**: Dados dos clientes
- **Índices**: `status`, `type`
- **Segurança**: Apenas managers e admins

#### `tickets`
- **Propósito**: Tickets de suporte
- **Índices**: `status`, `assigneeId`, `priority`
- **Segurança**: Assignees e reporters podem editar

#### `notifications`
- **Propósito**: Notificações do sistema
- **Índices**: `userId`, `isRead`, `type`
- **Segurança**: Apenas o próprio usuário

## 🔄 Repositórios

### BaseRepository

Classe genérica que fornece operações CRUD básicas:

```typescript
class BaseRepository<T> {
  // Operações básicas
  async getAll(options?: QueryOptions): Promise<T[]>
  async getPaginated(pageSize: number, options?: QueryOptions): Promise<PaginationResult<T>>
  async getById(id: string): Promise<T | null>
  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<string>
  async update(id: string, data: Partial<T>): Promise<void>
  async delete(id: string): Promise<void>
  
  // Utilitários
  async count(options?: QueryOptions): Promise<number>
  async exists(id: string): Promise<boolean>
  
  // Real-time
  onSnapshot(callback: (data: T[]) => void, options?: QueryOptions): Unsubscribe
  onDocumentSnapshot(id: string, callback: (data: T | null) => void): Unsubscribe
}
```

### Repositórios Específicos

Cada entidade tem métodos específicos:

```typescript
// UserRepository
userRepository.getByEmail(email: string)
userRepository.getByRole(role: string)
userRepository.updatePreferences(userId: string, preferences: Partial<UserPreferences>)

// ProjectRepository
projectRepository.getByStatus(status: Project['status'])
projectRepository.addTeamMember(projectId: string, member: ProjectMember)
projectRepository.updateProgress(projectId: string, progress: number)

// TaskRepository
taskRepository.getByAssignee(assigneeId: string)
taskRepository.updateStatus(taskId: string, status: Task['status'])
taskRepository.addComment(taskId: string, comment: TaskComment)
```

## 🔐 Autenticação

### AuthService

Serviço completo de autenticação:

```typescript
// Registro
const { user, firebaseUser } = await authService.register({
  email: 'user@example.com',
  password: 'password',
  name: 'Nome do Usuário',
  role: 'developer'
})

// Login
const { user, firebaseUser } = await authService.login({
  email: 'user@example.com',
  password: 'password'
})

// Logout
await authService.logout()

// Reset de senha
await authService.resetPassword('user@example.com')

// Verificar permissões
const hasPermission = await authService.hasPermission('projects.manage')
const hasRole = await authService.hasRole('admin')
```

## 🎣 Hooks Customizados

### Hooks Básicos

```typescript
// Operações CRUD
const { getAll, create, update, remove, loading, error } = useUsers()

// Dados em tempo real
const { data: users, loading } = useRealtimeUsers({
  where: [{ field: 'status', operator: '==', value: 'active' }]
})

// Documento específico
const { data: user } = useUser(userId)
```

### Hooks Específicos

```typescript
// Usuários
const users = useUsers()
const { data: activeUsers } = useRealtimeUsers({
  where: [{ field: 'status', operator: '==', value: 'active' }]
})

// Projetos
const projects = useProjects()
const { data: myProjects } = useRealtimeProjects({
  where: [{ field: 'managerId', operator: '==', value: userId }]
})

// Tarefas
const tasks = useTasks()
const { data: myTasks } = useRealtimeTasks({
  where: [{ field: 'assigneeId', operator: '==', value: userId }]
})
```

## 🔒 Regras de Segurança

### Estrutura das Regras

```javascript
// Usuários - podem editar próprios dados, admins têm acesso total
match /users/{userId} {
  allow read: if isOwner(userId) || hasAnyRole(['admin', 'manager']);
  allow update: if isOwner(userId) && !modifyingRoleOrPermissions();
}

// Projetos - membros da equipe podem ler, managers podem editar
match /projects/{projectId} {
  allow read: if isTeamMember() || hasAnyRole(['admin', 'manager']);
  allow write: if isProjectManager() || hasRole('admin');
}

// Tarefas - assignees e watchers podem editar
match /tasks/{taskId} {
  allow read: if isAssigneeOrWatcher() || hasAnyRole(['admin', 'manager']);
  allow write: if isAssigneeOrReporter() || hasAnyRole(['admin', 'manager']);
}
```

## 📊 Dados de Exemplo

### Inicialização

Execute o script para criar dados de exemplo:

```bash
npm run init-firebase-data
```

O script cria:
- **4 usuários** (admin, manager, designer, developer)
- **2 clientes** (empresas exemplo)
- **2 projetos** (Website Redesign, App Mobile)
- **2 tarefas** com diferentes status
- **2 notificações** para testar o sistema

### Estrutura dos Dados

#### Usuários
- Admin Sistema (admin@thera.com) - Admin
- João Silva (joao@thera.com) - Manager
- Maria Santos (maria@thera.com) - Designer
- Carlos Lima (carlos@thera.com) - Developer

#### Projetos
- Website Redesign (65% completo, alta prioridade)
- App Mobile (15% completo, planejamento)

## 🚀 Uso nos Componentes

### Exemplo Básico

```typescript
import { useRealtimeTasks, useTasks } from '@/hooks/useFirebase'
import { Task } from '@/types'

function TaskList() {
  // Dados em tempo real
  const { data: tasks, loading } = useRealtimeTasks({
    where: [{ field: 'status', operator: '!=', value: 'completed' }],
    orderBy: [{ field: 'dueDate', direction: 'asc' }]
  })

  // Operações CRUD
  const { update } = useTasks()

  const handleCompleteTask = async (taskId: string) => {
    await update(taskId, { 
      status: 'completed',
      completedAt: new Date()
    })
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div>
      {tasks.map(task => (
        <TaskCard 
          key={task.id} 
          task={task} 
          onComplete={() => handleCompleteTask(task.id)}
        />
      ))}
    </div>
  )
}
```

### Exemplo com Paginação

```typescript
function PaginatedUserList() {
  const [users, setUsers] = useState<User[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [lastDoc, setLastDoc] = useState<any>(null)
  
  const { getPaginated } = useUsers()

  const loadMore = async () => {
    const result = await getPaginated(10, {
      startAfter: lastDoc,
      orderBy: [{ field: 'name', direction: 'asc' }]
    })

    setUsers(prev => [...prev, ...result.data])
    setLastDoc(result.lastDoc)
    setHasMore(result.hasMore)
  }

  return (
    <div>
      {users.map(user => <UserCard key={user.id} user={user} />)}
      {hasMore && <button onClick={loadMore}>Carregar Mais</button>}
    </div>
  )
}
```

## 🧪 Testes

### Configuração de Testes

Para testes, use os emulators:

```typescript
// setup-tests.ts
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'
import { connectAuthEmulator, getAuth } from 'firebase/auth'

beforeAll(() => {
  // Conectar aos emulators
  connectFirestoreEmulator(getFirestore(), 'localhost', 8080)
  connectAuthEmulator(getAuth(), 'http://localhost:9099')
})
```

## 📈 Performance

### Índices Otimizados

Todos os índices necessários estão configurados em `firestore.indexes.json` para:
- Consultas por status, data, usuário
- Ordenação otimizada
- Consultas compostas frequentes

### Paginação

Use sempre paginação para listas grandes:

```typescript
const { getPaginated } = useRepository('task')
const result = await getPaginated(20, {
  orderBy: [{ field: 'createdAt', direction: 'desc' }]
})
```

### Cache de Dados

O Firestore já inclui cache automático. Para controle adicional:

```typescript
// Cache offline habilitado por padrão
// Dados ficam disponíveis mesmo offline
```

## 🔄 Deploy

### Regras de Produção

```bash
# Deploy das regras
firebase deploy --only firestore:rules

# Deploy dos índices
firebase deploy --only firestore:indexes

# Deploy completo
firebase deploy
```

### Variáveis de Ambiente

Configure as variáveis no seu provedor de hosting:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=production_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=production_project_id
# ... outras variáveis
```

## 🛠️ Troubleshooting

### Problemas Comuns

1. **Emulators não iniciam**: Verifique se as portas estão livres
2. **Regras de segurança**: Teste no Firebase Console
3. **Índices em falta**: Firestore sugere índices automaticamente
4. **Tipos TypeScript**: Mantenha os tipos atualizados com a estrutura

### Debug

```typescript
// Habilitar logs detalhados
import { setLogLevel } from 'firebase/firestore'
setLogLevel('debug')
```

## 📚 Recursos Adicionais

- [Documentação Firebase](https://firebase.google.com/docs)
- [Firestore Best Practices](https://firebase.google.com/docs/firestore/best-practices)
- [Security Rules Guide](https://firebase.google.com/docs/firestore/security/get-started)
- [TypeScript + Firebase](https://firebase.google.com/docs/web/typescript)