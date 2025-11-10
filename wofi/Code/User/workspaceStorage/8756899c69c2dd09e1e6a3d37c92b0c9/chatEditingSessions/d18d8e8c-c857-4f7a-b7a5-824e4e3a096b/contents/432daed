"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Calendar,
  Clock,
  User,
  Flag,
  Star
} from "lucide-react"
import { FadeIn } from "@/components/custom/animations"
import { useToast } from "@/components/custom/feedback"
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import {
  useSortable,
  SortableContext as SortableContextProvider,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface KanbanTask {
  id: string
  title: string
  description: string
  assignee: {
    name: string
    avatar?: string
    id: string
  }
  priority: 'low' | 'medium' | 'high' | 'urgent'
  project: string
  dueDate: string
  tags: string[]
  estimatedHours?: number
  starred?: boolean
}

interface KanbanColumn {
  id: string
  title: string
  tasks: KanbanTask[]
  color: string
  limit?: number
}

const mockKanbanData: KanbanColumn[] = [
  {
    id: "todo",
    title: "A Fazer",
    color: "bg-gray-100 border-gray-300",
    tasks: [
      {
        id: "task-1",
        title: "Implementar sistema de notificações",
        description: "Desenvolver sistema completo de notificações push e email",
        assignee: { name: "João Silva", avatar: "/avatars/joao.jpg", id: "1" },
        priority: "high",
        project: "Dashboard Core",
        dueDate: "2025-10-05",
        tags: ["backend", "notifications"],
        estimatedHours: 8,
        starred: true
      },
      {
        id: "task-2",
        title: "Criar documentação da API",
        description: "Documentar endpoints da API REST com exemplos",
        assignee: { name: "Maria Santos", avatar: "/avatars/maria.jpg", id: "2" },
        priority: "medium",
        project: "Documentation",
        dueDate: "2025-10-08",
        tags: ["docs", "api"],
        estimatedHours: 4
      },
      {
        id: "task-3",
        title: "Otimizar queries do banco",
        description: "Melhorar performance das consultas principais",
        assignee: { name: "Carlos Lima", avatar: "/avatars/carlos.jpg", id: "3" },
        priority: "low",
        project: "Performance",
        dueDate: "2025-10-12",
        tags: ["database", "optimization"],
        estimatedHours: 6
      }
    ]
  },
  {
    id: "in-progress",
    title: "Em Progresso",
    color: "bg-blue-100 border-blue-300",
    limit: 3,
    tasks: [
      {
        id: "task-4",
        title: "Refatorar componentes de loading",
        description: "Melhorar componentes de estado de carregamento",
        assignee: { name: "Ana Costa", avatar: "/avatars/ana.jpg", id: "4" },
        priority: "high",
        project: "UI Components",
        dueDate: "2025-09-28",
        tags: ["frontend", "components"],
        estimatedHours: 5
      },
      {
        id: "task-5",
        title: "Implementar autenticação 2FA",
        description: "Adicionar autenticação de dois fatores",
        assignee: { name: "Pedro Santos", avatar: "/avatars/pedro.jpg", id: "5" },
        priority: "urgent",
        project: "Security",
        dueDate: "2025-09-25",
        tags: ["security", "auth"],
        estimatedHours: 12,
        starred: true
      }
    ]
  },
  {
    id: "review",
    title: "Em Revisão",
    color: "bg-yellow-100 border-yellow-300",
    tasks: [
      {
        id: "task-6",
        title: "Code review: Sistema de tags",
        description: "Revisar implementação do sistema de tags",
        assignee: { name: "Lucas Ferreira", avatar: "/avatars/lucas.jpg", id: "6" },
        priority: "medium",
        project: "Core Features",
        dueDate: "2025-09-26",
        tags: ["review", "tags"],
        estimatedHours: 2
      }
    ]
  },
  {
    id: "done",
    title: "Concluído",
    color: "bg-green-100 border-green-300",
    tasks: [
      {
        id: "task-7",
        title: "Setup inicial do projeto",
        description: "Configuração base do Next.js e dependências",
        assignee: { name: "Roberto Tech", avatar: "/avatars/roberto.jpg", id: "7" },
        priority: "high",
        project: "Setup",
        dueDate: "2025-09-20",
        tags: ["setup", "config"],
        estimatedHours: 4
      },
      {
        id: "task-8",
        title: "Design system base",
        description: "Implementação dos componentes base do design system",
        assignee: { name: "Fernanda Design", avatar: "/avatars/fernanda.jpg", id: "8" },
        priority: "medium",
        project: "Design System",
        dueDate: "2025-09-22",
        tags: ["design", "components"],
        estimatedHours: 8
      }
    ]
  }
]

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent': return 'bg-red-500'
    case 'high': return 'bg-orange-500'
    case 'medium': return 'bg-yellow-500'
    case 'low': return 'bg-green-500'
    default: return 'bg-gray-500'
  }
}

const getPriorityLabel = (priority: string) => {
  switch (priority) {
    case 'urgent': return 'Urgente'
    case 'high': return 'Alta'
    case 'medium': return 'Média'
    case 'low': return 'Baixa'
    default: return priority
  }
}

// Componente para item de tarefa arrastável
function KanbanTaskCard({ task }: { task: KanbanTask }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const isOverdue = new Date(task.dueDate) < new Date()

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow ${
        isDragging ? 'shadow-lg' : ''
      } ${isOverdue ? 'border-red-200 bg-red-50' : ''}`}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header com título e ações */}
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-2 flex-1">
              {task.starred && (
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mt-0.5 flex-shrink-0" />
              )}
              <h4 className="font-medium text-sm leading-tight">{task.title}</h4>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Editar</DropdownMenuItem>
                <DropdownMenuItem>Duplicar</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">Excluir</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Descrição */}
          {task.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Informações da tarefa */}
          <div className="space-y-2">
            {/* Prioridade e Projeto */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                <span className="text-muted-foreground">{getPriorityLabel(task.priority)}</span>
              </div>
              <Badge variant="outline" className="text-xs px-1 py-0">
                {task.project}
              </Badge>
            </div>

            {/* Data de vencimento */}
            <div className="flex items-center space-x-1 text-xs">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span className={`${isOverdue ? 'text-red-600 font-medium' : 'text-muted-foreground'}`}>
                {new Date(task.dueDate).toLocaleDateString('pt-BR')}
              </span>
              {task.estimatedHours && (
                <>
                  <Clock className="h-3 w-3 text-muted-foreground ml-2" />
                  <span className="text-muted-foreground">{task.estimatedHours}h</span>
                </>
              )}
            </div>

            {/* Tags */}
            {task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {task.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs px-1 py-0">
                    {tag}
                  </Badge>
                ))}
                {task.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs px-1 py-0">
                    +{task.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Assignee */}
            <div className="flex items-center space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                <AvatarFallback className="text-xs">
                  {task.assignee.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">{task.assignee.name}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Componente para coluna do Kanban
function KanbanColumn({ column, tasks }: { column: KanbanColumn; tasks: KanbanTask[] }) {
  return (
    <div className="flex flex-col w-80 flex-shrink-0">
      <div className={`rounded-t-lg border-2 ${column.color} p-4`}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">{column.title}</h3>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-xs">
              {tasks.length}
              {column.limit && `/${column.limit}`}
            </Badge>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className={`border-2 border-t-0 ${column.color} rounded-b-lg p-2 min-h-[600px] bg-gray-50/50`}>
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {tasks.map((task) => (
              <KanbanTaskCard key={task.id} task={task} />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  )
}

export default function KanbanPage() {
  const { user } = useAuthStore()
  const { addNotification } = useToast()
  const [columns, setColumns] = useState<KanbanColumn[]>(mockKanbanData)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Encontrar tarefa por ID
  const findTask = (id: string) => {
    for (const column of columns) {
      const task = column.tasks.find(task => task.id === id)
      if (task) return { task, columnId: column.id }
    }
    return null
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return

    const activeTaskData = findTask(active.id as string)
    if (!activeTaskData) return

    const overId = over.id as string
    
    // Verificar se estamos movendo para uma coluna diferente
    const overColumn = columns.find(col => col.id === overId)
    const overTask = findTask(overId)
    
    const sourceColumnId = activeTaskData.columnId
    const targetColumnId = overColumn?.id || overTask?.columnId

    if (!targetColumnId) return

    setColumns(prevColumns => {
      const newColumns = [...prevColumns]
      
      // Encontrar índices das colunas
      const sourceColumnIndex = newColumns.findIndex(col => col.id === sourceColumnId)
      const targetColumnIndex = newColumns.findIndex(col => col.id === targetColumnId)
      
      if (sourceColumnIndex === -1 || targetColumnIndex === -1) return prevColumns

      // Remover tarefa da coluna de origem
      const [movedTask] = newColumns[sourceColumnIndex].tasks.splice(
        newColumns[sourceColumnIndex].tasks.findIndex(task => task.id === active.id),
        1
      )

      // Adicionar tarefa na coluna de destino
      if (overTask && sourceColumnId === targetColumnId) {
        // Reordenando dentro da mesma coluna
        const targetTaskIndex = newColumns[targetColumnIndex].tasks.findIndex(task => task.id === overId)
        newColumns[targetColumnIndex].tasks.splice(targetTaskIndex, 0, movedTask)
      } else {
        // Movendo para coluna diferente
        newColumns[targetColumnIndex].tasks.push(movedTask)
      }

      return newColumns
    })

    // Notificação de sucesso
    addNotification({
      type: "success",
      message: "Tarefa movida com sucesso!",
      duration: 3000
    })

    setActiveId(null)
  }

  // Filtrar tarefas baseado na busca
  const filteredColumns = columns.map(column => ({
    ...column,
    tasks: column.tasks.filter(task =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignee.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }))

  // Calcular estatísticas
  const totalTasks = columns.reduce((sum, col) => sum + col.tasks.length, 0)
  const completedTasks = columns.find(col => col.id === 'done')?.tasks.length || 0
  const inProgressTasks = columns.find(col => col.id === 'in-progress')?.tasks.length || 0
  const overdueTasks = columns.reduce((sum, col) => 
    sum + col.tasks.filter(task => new Date(task.dueDate) < new Date()).length, 0
  )

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <FadeIn>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Kanban Board</h1>
            <p className="text-muted-foreground">
              Visualize e gerencie tarefas com drag & drop
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Total: {totalTasks}</span>
              <span>•</span>
              <span>Concluídas: {completedTasks}</span>
              <span>•</span>
              <span>Em Progresso: {inProgressTasks}</span>
              {overdueTasks > 0 && (
                <>
                  <span>•</span>
                  <span className="text-red-600">Atrasadas: {overdueTasks}</span>
                </>
              )}
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Tarefa
            </Button>
          </div>
        </div>
      </FadeIn>

      {/* Filtros */}
      <FadeIn delay={100}>
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar tarefas, pessoas ou projetos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
          <Button variant="outline" size="sm">
            <User className="mr-2 h-4 w-4" />
            Apenas Minhas
          </Button>
        </div>
      </FadeIn>

      {/* Kanban Board */}
      <FadeIn delay={200}>
        <div className="overflow-x-auto pb-4">
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="flex space-x-6 min-w-max">
              {filteredColumns.map((column) => (
                <SortableContext key={column.id} items={[column.id]} strategy={verticalListSortingStrategy}>
                  <KanbanColumn column={column} tasks={column.tasks} />
                </SortableContext>
              ))}
            </div>

            <DragOverlay>
              {activeId ? (
                <div className="rotate-6 opacity-90">
                  {(() => {
                    const taskData = findTask(activeId)
                    return taskData ? <KanbanTaskCard task={taskData.task} /> : null
                  })()}
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </FadeIn>

      {/* Estatísticas no rodapé */}
      <FadeIn delay={300}>
        <div className="border-t pt-4 mt-8">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-6">
              <span>Total de tarefas: {totalTasks}</span>
              <span>Taxa de conclusão: {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%</span>
              <span>Usuários ativos: {new Set(columns.flatMap(col => col.tasks.map(task => task.assignee.id))).size}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>Atualizado em {new Date().toLocaleTimeString('pt-BR')}</span>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  )
}