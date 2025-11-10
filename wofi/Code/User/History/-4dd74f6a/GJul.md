# Gerenciamento de Estado

## Zustand - Store Principal

### Configuração Base

```tsx
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface StoreState {
  // estado
}

interface StoreActions {
  // ações
}

type Store = StoreState & StoreActions

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      // implementação
    }),
    {
      name: 'store-name',
      partialize: (state) => ({ 
        // apenas campos necessários para persistir
      })
    }
  )
)
```

## Stores Implementadas

### AuthStore (`/src/stores/authStore.ts`)
Gerencia autenticação e sessão do usuário:

```tsx
interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

interface AuthActions {
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  clearError: () => void
}
```

**Funcionalidades:**
- Autenticação com email/senha
- Login com Google
- Recuperação de senha
- Persistência de sessão
- Estados de loading e erro

**Uso:**
```tsx
const { user, loading, signIn, signOut } = useAuthStore()

const handleLogin = async () => {
  await signIn(email, password)
}
```

### ProjectStore (`/src/stores/projectStore.ts`)
Gerencia projetos e suas operações:

```tsx
interface ProjectState {
  projects: Project[]
  currentProject: Project | null
  loading: boolean
}

interface ProjectActions {
  addProject: (project: Omit<Project, 'id'>) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
  setCurrentProject: (project: Project) => void
}
```

**Funcionalidades:**
- CRUD completo de projetos
- Projeto atual ativo
- Filtros e busca
- Estados de progresso

**Uso:**
```tsx
const { projects, addProject, currentProject } = useProjectStore()

const createProject = (data) => {
  addProject({
    name: data.name,
    description: data.description,
    status: 'planning'
  })
}
```

### MemberStore (`/src/stores/memberStore.ts`)
Gerencia membros da equipe:

```tsx
interface MemberState {
  members: Member[]
  departments: string[]
  loading: boolean
}

interface MemberActions {
  addMember: (member: Omit<Member, 'id'>) => void
  updateMember: (id: string, updates: Partial<Member>) => void
  deleteMember: (id: string) => void
  getMembersByDepartment: (department: string) => Member[]
}
```

**Funcionalidades:**
- Gestão de membros
- Departamentos e cargos
- Avaliações de performance
- Skills e competências

**Uso:**
```tsx
const { members, addMember, getMembersByDepartment } = useMemberStore()

const devTeam = getMembersByDepartment('Desenvolvimento')
```

### AppStore (`/src/stores/appStore.ts`)
Configurações gerais da aplicação:

```tsx
interface AppState {
  theme: 'light' | 'dark' | 'system'
  sidebarCollapsed: boolean
  notifications: Notification[]
  preferences: UserPreferences
}

interface AppActions {
  setTheme: (theme: Theme) => void
  toggleSidebar: () => void
  addNotification: (notification: Notification) => void
  updatePreferences: (preferences: Partial<UserPreferences>) => void
}
```

**Funcionalidades:**
- Tema da aplicação
- Estado da sidebar
- Notificações globais
- Preferências do usuário

## Padrões de Uso

### Seletores Otimizados
```tsx
// ✅ Seleciona apenas o necessário
const projects = useProjectStore(state => state.projects)

// ✅ Usando useShallow para objetos
const { projects, loading } = useProjectStore(
  useShallow(state => ({ 
    projects: state.projects,
    loading: state.loading 
  }))
)

// ❌ Evitar - seleciona todo o store
const store = useProjectStore()
```

### Actions Assíncronas
```tsx
const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  loading: false,
  
  fetchProjects: async () => {
    set({ loading: true })
    try {
      const projects = await api.getProjects()
      set({ projects, loading: false })
    } catch (error) {
      set({ loading: false, error: error.message })
    }
  },
  
  addProject: async (projectData) => {
    set({ loading: true })
    try {
      const newProject = await api.createProject(projectData)
      set(state => ({ 
        projects: [...state.projects, newProject],
        loading: false 
      }))
    } catch (error) {
      set({ loading: false, error: error.message })
    }
  }
}))
```

### Estado Derivado
```tsx
const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  
  // Computed values
  get activeProjects() {
    return get().projects.filter(p => p.status === 'active')
  },
  
  get completedProjects() {
    return get().projects.filter(p => p.status === 'completed')
  },
  
  get projectStats() {
    const projects = get().projects
    return {
      total: projects.length,
      active: projects.filter(p => p.status === 'active').length,
      completed: projects.filter(p => p.status === 'completed').length
    }
  }
}))
```

### Middleware de Persistência
```tsx
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // store implementation
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        // não persiste loading, error
      }),
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persistedState, version) => {
        // migrations se necessário
        return persistedState
      }
    }
  )
)
```

## Context API - Casos Específicos

### ToastContext (`/src/components/custom/feedback.tsx`)
Para notificações que precisam ser globais mas temporárias:

```tsx
interface ToastContextType {
  notifications: Notification[]
  addNotification: (notification: Notification) => void
  removeNotification: (id: string) => void
}

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ 
  children 
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  
  const addNotification = useCallback((notification) => {
    const id = Math.random().toString(36).substr(2, 9)
    setNotifications(prev => [...prev, { ...notification, id }])
  }, [])
  
  return (
    <ToastContext.Provider value={{ notifications, addNotification }}>
      {children}
      <ToastContainer notifications={notifications} />
    </ToastContext.Provider>
  )
}
```

## Boas Práticas

### 1. Separação de Responsabilidades
```tsx
// ✅ Store focado em uma responsabilidade
const useUserStore = create(...)  // apenas usuários
const useProjectStore = create(...) // apenas projetos

// ❌ Store muito amplo
const useAppStore = create(...) // tudo misturado
```

### 2. Actions Claras e Específicas
```tsx
// ✅ Actions específicas
updateProjectStatus: (id: string, status: Status) => void
updateProjectName: (id: string, name: string) => void

// ❌ Action muito genérica
updateProject: (id: string, data: any) => void
```

### 3. Estado Imutável
```tsx
// ✅ Imutabilidade com spread
set(state => ({
  projects: state.projects.map(p => 
    p.id === id ? { ...p, ...updates } : p
  )
}))

// ❌ Mutação direta
set(state => {
  const project = state.projects.find(p => p.id === id)
  project.name = newName // mutação
  return state
})
```

### 4. Loading States
```tsx
const useAsyncAction = () => {
  const [loading, setLoading] = useState(false)
  
  const execute = async (action: () => Promise<void>) => {
    setLoading(true)
    try {
      await action()
    } finally {
      setLoading(false)
    }
  }
  
  return { loading, execute }
}
```

### 5. Error Handling
```tsx
interface StoreState {
  data: Data[]
  loading: boolean
  error: string | null
}

const handleAsync = async (asyncFn: () => Promise<any>) => {
  set({ loading: true, error: null })
  try {
    const result = await asyncFn()
    set({ loading: false })
    return result
  } catch (error) {
    set({ 
      loading: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    })
    throw error
  }
}
```

## DevTools

### Zustand DevTools
```tsx
import { devtools } from 'zustand/middleware'

export const useStore = create<Store>()(
  devtools(
    persist(
      (set, get) => ({
        // store implementation
      }),
      { name: 'store-name' }
    ),
    { name: 'Store' }
  )
)
```

### Debug Helper
```tsx
const useStoreLogger = (storeName: string, store: any) => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.group(`🔄 ${storeName} Store Update`)
      console.log('State:', store)
      console.groupEnd()
    }
  }, [store, storeName])
}
```
