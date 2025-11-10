import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore'
import { User, Project, Task, Client, Notification } from '@/types'

// Firebase config for initialization
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Sample data
const sampleUsers: Omit<User, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Admin Sistema',
    email: 'admin@thera.com',
    role: 'admin',
    department: 'TI',
    position: 'Administrador do Sistema',
    status: 'active',
    preferences: {
      theme: 'dark',
      language: 'pt-BR',
      timezone: 'America/Sao_Paulo',
      notifications: { email: true, push: true, inApp: true },
      dashboard: { layout: 'default', widgets: [] }
    },
    permissions: ['all'],
    companyId: 'company_1',
    teamIds: ['team_1']
  },
  {
    name: 'João Silva',
    email: 'joao@thera.com',
    role: 'manager',
    department: 'Desenvolvimento',
    position: 'Gerente de Projetos',
    status: 'active',
    preferences: {
      theme: 'light',
      language: 'pt-BR',
      timezone: 'America/Sao_Paulo',
      notifications: { email: true, push: true, inApp: true },
      dashboard: { layout: 'default', widgets: [] }
    },
    permissions: ['projects.manage', 'tasks.manage', 'users.view'],
    companyId: 'company_1',
    teamIds: ['team_1', 'team_2']
  },
  {
    name: 'Maria Santos',
    email: 'maria@thera.com',
    role: 'designer',
    department: 'Design',
    position: 'UI/UX Designer',
    status: 'active',
    preferences: {
      theme: 'system',
      language: 'pt-BR',
      timezone: 'America/Sao_Paulo',
      notifications: { email: true, push: false, inApp: true },
      dashboard: { layout: 'default', widgets: [] }
    },
    permissions: ['tasks.view', 'projects.view'],
    companyId: 'company_1',
    teamIds: ['team_2']
  },
  {
    name: 'Carlos Lima',
    email: 'carlos@thera.com',
    role: 'developer',
    department: 'Desenvolvimento',
    position: 'Desenvolvedor Full Stack',
    status: 'active',
    preferences: {
      theme: 'dark',
      language: 'pt-BR',
      timezone: 'America/Sao_Paulo',
      notifications: { email: true, push: true, inApp: true },
      dashboard: { layout: 'default', widgets: [] }
    },
    permissions: ['tasks.view', 'projects.view'],
    companyId: 'company_1',
    teamIds: ['team_1']
  }
]

const sampleClients: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Empresa Alpha',
    email: 'contato@alpha.com',
    phone: '(11) 98765-4321',
    company: 'Alpha Solutions',
    address: 'Rua das Empresas, 123, São Paulo, SP',
    website: 'https://alpha.com',
    status: 'active',
    type: 'company',
    projects: []
  },
  {
    name: 'Beta Startup',
    email: 'hello@beta.com',
    phone: '(21) 99876-5432',
    company: 'Beta Innovations',
    address: 'Av. Inovação, 456, Rio de Janeiro, RJ',
    website: 'https://beta.com',
    status: 'active',
    type: 'company',
    projects: []
  }
]

const sampleProjects: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Website Redesign',
    description: 'Redesign completo do website corporativo',
    status: 'active',
    progress: 65,
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-03-15'),
    priority: 'high',
    budget: {
      estimated: 50000,
      actual: 32000,
      currency: 'BRL',
      breakdown: {
        development: 30000,
        design: 15000,
        testing: 3000,
        deployment: 2000,
        other: 0
      }
    },
    teamMembers: [
      { userId: 'user_2', role: 'lead', allocation: 100, joinedAt: new Date('2024-01-15') },
      { userId: 'user_3', role: 'designer', allocation: 80, joinedAt: new Date('2024-01-16') },
      { userId: 'user_4', role: 'developer', allocation: 100, joinedAt: new Date('2024-01-17') }
    ],
    managerId: 'user_2',
    category: 'Web Development',
    tags: ['website', 'redesign', 'responsive'],
    milestones: [
      {
        id: 'milestone_1',
        title: 'Design Aprovado',
        description: 'Todas as telas aprovadas pelo cliente',
        dueDate: new Date('2024-02-01'),
        status: 'completed',
        tasks: [],
        completedAt: new Date('2024-01-30')
      },
      {
        id: 'milestone_2',
        title: 'Desenvolvimento Concluído',
        description: 'Funcionalidades implementadas',
        dueDate: new Date('2024-02-28'),
        status: 'in-progress',
        tasks: []
      }
    ],
    attachments: []
  },
  {
    name: 'App Mobile',
    description: 'Aplicativo mobile para iOS e Android',
    status: 'planning',
    progress: 15,
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-06-01'),
    priority: 'medium',
    budget: {
      estimated: 80000,
      actual: 12000,
      currency: 'BRL',
      breakdown: {
        development: 60000,
        design: 15000,
        testing: 3000,
        deployment: 2000,
        other: 0
      }
    },
    teamMembers: [
      { userId: 'user_2', role: 'lead', allocation: 50, joinedAt: new Date('2024-02-01') },
      { userId: 'user_4', role: 'developer', allocation: 100, joinedAt: new Date('2024-02-01') }
    ],
    managerId: 'user_2',
    category: 'Mobile Development',
    tags: ['mobile', 'ios', 'android', 'react-native'],
    milestones: [],
    attachments: []
  }
]

const sampleTasks: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'Criar wireframes da homepage',
    description: 'Desenvolver wireframes detalhados para a nova homepage',
    status: 'completed',
    priority: 'high',
    assigneeId: 'user_3',
    reporterId: 'user_2',
    projectId: 'project_1',
    dueDate: new Date('2024-01-20'),
    estimatedHours: 16,
    actualHours: 14,
    tags: ['design', 'wireframe', 'homepage'],
    labels: [
      { id: 'label_1', name: 'Design', color: '#3B82F6' },
      { id: 'label_2', name: 'Urgente', color: '#EF4444' }
    ],
    comments: [],
    attachments: [],
    checklist: [
      { id: 'check_1', text: 'Analisar referências', completed: true },
      { id: 'check_2', text: 'Criar estrutura base', completed: true },
      { id: 'check_3', text: 'Revisar com cliente', completed: true }
    ],
    dependencies: [],
    watchers: ['user_2'],
    customFields: {},
    completedAt: new Date('2024-01-19')
  },
  {
    title: 'Implementar layout responsivo',
    description: 'Codificar o layout responsivo baseado nos designs aprovados',
    status: 'in-progress',
    priority: 'high',
    assigneeId: 'user_4',
    reporterId: 'user_2',
    projectId: 'project_1',
    dueDate: new Date('2024-02-15'),
    estimatedHours: 32,
    actualHours: 18,
    tags: ['development', 'responsive', 'css'],
    labels: [
      { id: 'label_3', name: 'Desenvolvimento', color: '#10B981' }
    ],
    comments: [
      {
        id: 'comment_1',
        content: 'Já finalizei a versão desktop, iniciando mobile',
        authorId: 'user_4',
        createdAt: new Date('2024-02-10'),
        mentions: ['user_2']
      }
    ],
    attachments: [],
    checklist: [
      { id: 'check_4', text: 'Layout desktop', completed: true },
      { id: 'check_5', text: 'Layout tablet', completed: false },
      { id: 'check_6', text: 'Layout mobile', completed: false }
    ],
    dependencies: [],
    watchers: ['user_2', 'user_3'],
    customFields: {}
  }
]

const sampleNotifications: Omit<Notification, 'id' | 'createdAt'>[] = [
  {
    title: 'Nova tarefa atribuída',
    message: 'Você foi atribuído à tarefa "Implementar layout responsivo"',
    type: 'info',
    userId: 'user_4',
    isRead: false,
    actionUrl: '/dashboard/tasks/task_2'
  },
  {
    title: 'Prazo próximo',
    message: 'A tarefa "Criar wireframes da homepage" vence em 2 dias',
    type: 'warning',
    userId: 'user_3',
    isRead: true,
    actionUrl: '/dashboard/tasks/task_1'
  }
]

// Utility function to convert dates to Firestore timestamps
function prepareDocumentForFirestore(doc: any) {
  const result = { ...doc }
  const now = Timestamp.now()
  
  // Add timestamps
  result.createdAt = now
  result.updatedAt = now
  
  // Convert dates to timestamps
  Object.keys(result).forEach(key => {
    if (result[key] instanceof Date) {
      result[key] = Timestamp.fromDate(result[key])
    } else if (result[key] && typeof result[key] === 'object' && !Array.isArray(result[key])) {
      result[key] = prepareDocumentForFirestore(result[key])
    } else if (Array.isArray(result[key])) {
      result[key] = result[key].map((item: any) => 
        typeof item === 'object' && item !== null ? prepareDocumentForFirestore(item) : item
      )
    }
  })
  
  return result
}

// Initialize data
async function initializeData() {
  console.log('🚀 Iniciando a criação de dados de exemplo...')
  
  try {
    // Create users
    console.log('👥 Criando usuários...')
    const userIds: string[] = []
    for (const user of sampleUsers) {
      const docRef = await addDoc(collection(db, 'users'), prepareDocumentForFirestore(user))
      userIds.push(docRef.id)
      console.log(`   ✅ Usuário criado: ${user.name} (${docRef.id})`)
    }

    // Create clients
    console.log('🏢 Criando clientes...')
    const clientIds: string[] = []
    for (const client of sampleClients) {
      const docRef = await addDoc(collection(db, 'clients'), prepareDocumentForFirestore(client))
      clientIds.push(docRef.id)
      console.log(`   ✅ Cliente criado: ${client.name} (${docRef.id})`)
    }

    // Create projects with real user IDs
    console.log('📁 Criando projetos...')
    const projectIds: string[] = []
    for (let i = 0; i < sampleProjects.length; i++) {
      const project = { ...sampleProjects[i] }
      
      // Update team members with real user IDs
      project.teamMembers = project.teamMembers.map((member, idx) => ({
        ...member,
        userId: userIds[idx + 1] || userIds[0] // Skip admin, use other users
      }))
      
      // Update manager ID
      project.managerId = userIds[1] // João Silva
      
      // Add client ID
      if (clientIds[i]) {
        project.clientId = clientIds[i]
      }

      const docRef = await addDoc(collection(db, 'projects'), prepareDocumentForFirestore(project))
      projectIds.push(docRef.id)
      console.log(`   ✅ Projeto criado: ${project.name} (${docRef.id})`)
    }

    // Create tasks with real IDs
    console.log('✅ Criando tarefas...')
    const taskIds: string[] = []
    for (let i = 0; i < sampleTasks.length; i++) {
      const task = { ...sampleTasks[i] }
      
      // Update with real IDs
      task.assigneeId = userIds[i + 2] // Maria and Carlos
      task.reporterId = userIds[1] // João Silva
      task.projectId = projectIds[0] // Website Redesign
      task.watchers = task.watchers.map(() => userIds[1])

      const docRef = await addDoc(collection(db, 'tasks'), prepareDocumentForFirestore(task))
      taskIds.push(docRef.id)
      console.log(`   ✅ Tarefa criada: ${task.title} (${docRef.id})`)
    }

    // Create notifications with real user IDs
    console.log('🔔 Criando notificações...')
    for (let i = 0; i < sampleNotifications.length; i++) {
      const notification = { ...sampleNotifications[i] }
      notification.userId = userIds[i + 2] // Maria and Carlos
      
      const docRef = await addDoc(collection(db, 'notifications'), prepareDocumentForFirestore(notification))
      console.log(`   ✅ Notificação criada: ${notification.title} (${docRef.id})`)
    }

    console.log('🎉 Dados de exemplo criados com sucesso!')
    console.log(`   📊 ${userIds.length} usuários`)
    console.log(`   🏢 ${clientIds.length} clientes`)
    console.log(`   📁 ${projectIds.length} projetos`)
    console.log(`   ✅ ${taskIds.length} tarefas`)
    console.log(`   🔔 ${sampleNotifications.length} notificações`)

  } catch (error) {
    console.error('❌ Erro ao criar dados de exemplo:', error)
  }
}

// Run if called directly
if (require.main === module) {
  initializeData()
}

export { initializeData }