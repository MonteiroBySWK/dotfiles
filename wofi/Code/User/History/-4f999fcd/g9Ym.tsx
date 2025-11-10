"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTable } from "@/components/custom/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { 
  Plus, 
  CheckSquare, 
  Clock, 
  Users,
  Flag,
  Calendar,
  MoreHorizontal,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2
} from "lucide-react"
import { FadeIn, StaggeredList } from "@/components/custom/animations"
import { useToast } from "@/components/custom/feedback"

// Import new common components
import { StatCard, StatusBadge, SearchAndFilter, ActionDropdown } from "@/components/common"
import { FormDialog } from "@/components/forms"

// Local interface with string dates for mock data
interface TaskWithStringDate {
  id: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'review' | 'completed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignee: string
  project: string
  dueDate: string
  tags: string[]
}

const mockTasks: TaskWithStringDate[] = [
  {
    id: "1",
    title: "Implementar autenticação",
    description: "Criar sistema de login e registro de usuários",
    status: "in-progress",
    priority: "high",
    assignee: "João Silva",
    project: "Projeto Alpha",
    dueDate: "2025-10-15",
    tags: ["backend", "security"]
  },
  {
    id: "2", 
    title: "Design da homepage",
    description: "Criar mockups e protótipos da página inicial",
    status: "review",
    priority: "medium",
    assignee: "Maria Santos",
    project: "Website Redesign",
    dueDate: "2025-10-12",
    tags: ["design", "ui/ux"]
  },
  {
    id: "3",
    title: "Configurar banco de dados",
    description: "Setup do PostgreSQL e migrações iniciais",
    status: "completed",
    priority: "high",
    assignee: "Carlos Lima",
    project: "E-commerce Platform",
    dueDate: "2025-10-08",
    tags: ["database", "backend"]
  },
  {
    id: "4",
    title: "Testes automatizados",
    description: "Implementar suite de testes unitários",
    status: "todo",
    priority: "medium",
    assignee: "Ana Costa",
    project: "Mobile App",
    dueDate: "2025-10-20",
    tags: ["testing", "qa"]
  }
]

const statusOptions = {
  'todo': { label: 'A Fazer', color: 'bg-gray-500' },
  'in-progress': { label: 'Em Progresso', color: 'bg-blue-500' },
  'review': { label: 'Em Revisão', color: 'bg-yellow-500' },
  'completed': { label: 'Concluído', color: 'bg-green-500' }
}

const priorityOptions = {
  'low': { label: 'Baixa', color: 'bg-green-500' },
  'medium': { label: 'Média', color: 'bg-yellow-500' },
  'high': { label: 'Alta', color: 'bg-orange-500' },
  'urgent': { label: 'Urgente', color: 'bg-red-500' }
}

export default function TasksPage() {
  const { addNotification } = useToast()
  const [tasks, setTasks] = useState<TaskWithStringDate[]>(mockTasks)
  const [showNewTaskForm, setShowNewTaskForm] = useState(false)

  const columns: ColumnDef<TaskWithStringDate>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Selecionar todos"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Selecionar linha"
        />
      ),
    },
    {
      accessorKey: "title",
      header: "Tarefa",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.getValue("title")}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.description}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return <StatusBadge status={status} />
      },
    },
    {
      accessorKey: "priority",
      header: "Prioridade", 
      cell: ({ row }) => {
        const priority = row.getValue("priority") as string
        return <StatusBadge status={priority} />
      },
    },
    {
      accessorKey: "assignee",
      header: "Responsável",
    },
    {
      accessorKey: "project",
      header: "Projeto",
    },
    {
      accessorKey: "dueDate",
      header: "Prazo",
      cell: ({ row }) => {
        const date = new Date(row.getValue("dueDate"))
        return date.toLocaleDateString()
      },
    },
    {
      accessorKey: "tags",
      header: "Tags",
      cell: ({ row }) => {
        const tags = row.getValue("tags") as string[]
        return (
          <div className="flex gap-1 flex-wrap">
            {tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )
      },
    },
  ]

  const getTaskStats = () => {
    return {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'completed').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      overdue: tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length
    }
  }

  const stats = getTaskStats()

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <FadeIn>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tarefas</h1>
            <p className="text-muted-foreground">
              Gerencie todas as tarefas e atividades do projeto
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => addNotification({
              type: "info",
              message: "Visualização Kanban ativada",
              duration: 3000
            })}>
              <CheckSquare className="mr-2 h-4 w-4" />
              Kanban
            </Button>
            <Button onClick={() => setShowNewTaskForm(!showNewTaskForm)}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Tarefa
            </Button>
          </div>
        </div>
      </FadeIn>

      {/* Estatísticas */}
      <FadeIn delay={200}>
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            title="Total de Tarefas"
            value={stats.total}
            description="+3 esta semana"
            icon={CheckSquare}
          />
          
          <StatCard
            title="Em Progresso"
            value={stats.inProgress}
            description="Atividades em andamento"
            icon={Clock}
          />
          
          <StatCard
            title="Concluídas"
            value={stats.completed}
            description={`${Math.round((stats.completed / stats.total) * 100)}% do total`}
            icon={CheckSquare}
            iconColor="text-green-500"
          />
          
          <StatCard
            title="Atrasadas"
            value={stats.overdue}
            description="Requerem atenção"
            icon={Flag}
            iconColor="text-red-500"
            className="[&_.text-2xl]:text-red-500"
          />
        </div>
      </FadeIn>

      {/* Formulário de Nova Tarefa */}
      {showNewTaskForm && (
        <FadeIn delay={300}>
          <Card>
            <CardHeader>
              <CardTitle>Nova Tarefa</CardTitle>
              <CardDescription>Adicione uma nova tarefa ao projeto</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Título</label>
                  <Input placeholder="Digite o título da tarefa" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Projeto</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o projeto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alpha">Projeto Alpha</SelectItem>
                      <SelectItem value="beta">Website Redesign</SelectItem>
                      <SelectItem value="gamma">Mobile App</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Responsável</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Atribuir a" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="joao">João Silva</SelectItem>
                      <SelectItem value="maria">Maria Santos</SelectItem>
                      <SelectItem value="carlos">Carlos Lima</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Prioridade</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baixa</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="urgent">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Descrição</label>
                  <Textarea placeholder="Descreva os detalhes da tarefa" />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setShowNewTaskForm(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => {
                  addNotification({
                    type: "success",
                    message: "Tarefa criada com sucesso!",
                    duration: 3000
                  })
                  setShowNewTaskForm(false)
                }}>
                  Criar Tarefa
                </Button>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {/* Tabela de Tarefas */}
      <FadeIn delay={400}>
        <DataTable
          columns={columns}
          data={tasks}
          searchKey="title"
          searchPlaceholder="Buscar tarefas..."
          filters={[
            {
              key: "status",
              label: "Status",
              options: [
                { label: "A Fazer", value: "todo" },
                { label: "Em Progresso", value: "in-progress" },
                { label: "Em Revisão", value: "review" },
                { label: "Concluído", value: "completed" }
              ]
            },
            {
              key: "priority",
              label: "Prioridade",
              options: [
                { label: "Baixa", value: "low" },
                { label: "Média", value: "medium" },
                { label: "Alta", value: "high" },
                { label: "Urgente", value: "urgent" }
              ]
            }
          ]}
          enableRowSelection={true}
          enableExport={true}
          pageSize={10}
        />
      </FadeIn>
    </div>
  )
}
