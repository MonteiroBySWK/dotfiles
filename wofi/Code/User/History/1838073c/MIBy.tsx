"use client"

import * as React from "react"
import { 
  BarChart3, 
  Users, 
  Calendar, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreVertical
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/custom/feedback"
import { useModal } from "@/hooks/use-modal"
import { 
  ConfirmModal, 
  FormModal, 
  DetailModal 
} from "@/components/custom/modals"
import { 
  LoadingOverlay, 
  ProgressBar, 
  CircularProgress,
  RefreshButton
} from "@/components/custom/loading"

interface Project {
  id: string
  name: string
  status: "active" | "completed" | "paused"
  progress: number
  team: Array<{
    id: string
    name: string
    avatar?: string
  }>
  deadline: string
  description: string
}

interface Task {
  id: string
  title: string
  status: "pending" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  assignee: string
  dueDate: string
}

const MainDashboard: React.FC = () => {
  const { addNotification } = useToast()
  const { 
    modalState, 
    openModal, 
    closeModal 
  } = useModal()

  const [isLoading, setIsLoading] = React.useState(false)
  const [projects, setProjects] = React.useState<Project[]>([
    {
      id: "1",
      name: "Sistema de Gestão",
      status: "active",
      progress: 75,
      team: [
        { id: "1", name: "Ana Silva", avatar: "/avatars/ana.jpg" },
        { id: "2", name: "Carlos Santos", avatar: "/avatars/carlos.jpg" }
      ],
      deadline: "2024-02-15",
      description: "Sistema completo de gestão empresarial com módulos de vendas, estoque e financeiro."
    },
    {
      id: "2", 
      name: "App Mobile",
      status: "active",
      progress: 45,
      team: [
        { id: "3", name: "Maria Costa", avatar: "/avatars/maria.jpg" }
      ],
      deadline: "2024-03-01",
      description: "Aplicativo mobile para gestão de tarefas e produtividade."
    },
    {
      id: "3",
      name: "Dashboard Analytics",
      status: "completed",
      progress: 100,
      team: [
        { id: "1", name: "Ana Silva", avatar: "/avatars/ana.jpg" },
        { id: "4", name: "João Oliveira", avatar: "/avatars/joao.jpg" }
      ],
      deadline: "2024-01-20",
      description: "Dashboard avançado para análise de dados e métricas de negócio."
    }
  ])

  const [tasks, setTasks] = React.useState<Task[]>([
    {
      id: "1",
      title: "Implementar autenticação",
      status: "in-progress",
      priority: "high",
      assignee: "Ana Silva",
      dueDate: "2024-01-25"
    },
    {
      id: "2",
      title: "Criar testes unitários",
      status: "pending",
      priority: "medium",
      assignee: "Carlos Santos",
      dueDate: "2024-01-30"
    },
    {
      id: "3",
      title: "Deploy em produção",
      status: "completed",
      priority: "high",
      assignee: "Maria Costa",
      dueDate: "2024-01-20"
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "in-progress":
        return "bg-blue-500"
      case "completed":
        return "bg-green-500"
      case "paused":
      case "pending":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleCreateProject = async (data: Record<string, string>) => {
    setIsLoading(true)
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const newProject: Project = {
        id: Date.now().toString(),
        name: data.name,
        status: "active",
        progress: 0,
        team: [],
        deadline: data.deadline,
        description: data.description
      }
      
      setProjects(prev => [...prev, newProject])
      
      addNotification({
        type: "success",
        title: "Projeto criado!",
        message: `O projeto "${data.name}" foi criado com sucesso.`,
        action: {
          label: "Ver projeto",
          onClick: () => console.log("Ver projeto:", newProject.id)
        }
      })
    } catch (error) {
      addNotification({
        type: "error",
        title: "Erro ao criar projeto",
        message: "Ocorreu um erro inesperado. Tente novamente."
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    setIsLoading(true)
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const project = projects.find(p => p.id === projectId)
      setProjects(prev => prev.filter(p => p.id !== projectId))
      
      addNotification({
        type: "success",
        title: "Projeto excluído",
        message: `O projeto "${project?.name}" foi excluído com sucesso.`
      })
    } catch (error) {
      addNotification({
        type: "error",
        title: "Erro ao excluir projeto",
        message: "Não foi possível excluir o projeto. Tente novamente."
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefreshData = async () => {
    setIsLoading(true)
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      addNotification({
        type: "info",
        message: "Dados atualizados com sucesso!"
      })
    } catch (error) {
      addNotification({
        type: "error",
        title: "Erro na atualização",
        message: "Não foi possível atualizar os dados."
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formFields = [
    {
      name: "name",
      label: "Nome do Projeto",
      type: "text" as const,
      placeholder: "Digite o nome do projeto",
      required: true
    },
    {
      name: "description",
      label: "Descrição",
      type: "textarea" as const,
      placeholder: "Descreva o projeto",
      required: true
    },
    {
      name: "deadline",
      label: "Prazo",
      type: "date" as const,
      required: true
    }
  ]

  return (
    <LoadingOverlay isLoading={isLoading} message="Carregando dados...">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Bem-vindo de volta! Aqui está um resumo dos seus projetos.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <RefreshButton
              onRefresh={handleRefreshData}
              size="md"
            />
            <Button 
              onClick={() => openModal("create-project")}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Novo Projeto</span>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Projetos
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.length}</div>
              <p className="text-xs text-muted-foreground">
                +2 desde o mês passado
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Projetos Ativos
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {projects.filter(p => p.status === "active").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Em desenvolvimento
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tarefas Pendentes
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {tasks.filter(t => t.status === "pending").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Aguardando execução
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Taxa de Conclusão
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89%</div>
              <p className="text-xs text-muted-foreground">
                +5% desde a semana passada
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Projects */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Projetos Recentes
                <Badge variant="secondary">{projects.length}</Badge>
              </CardTitle>
              <CardDescription>
                Acompanhe o progresso dos seus projetos ativos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{project.name}</h4>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => openModal("view-project", project)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => openModal("delete-project", project)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge 
                        className={`text-white ${getStatusColor(project.status)}`}
                      >
                        {project.status === "active" ? "Ativo" : 
                         project.status === "completed" ? "Concluído" : "Pausado"}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Prazo: {new Date(project.deadline).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Progresso</span>
                        <span>{project.progress}%</span>
                      </div>
                      <ProgressBar 
                        value={project.progress} 
                        color={project.progress === 100 ? "success" : "default"}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">Equipe:</span>
                      <div className="flex -space-x-2">
                        {project.team.slice(0, 3).map((member) => (
                          <Avatar key={member.id} className="h-6 w-6 border-2 border-background">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback className="text-xs">
                              {member.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {project.team.length > 3 && (
                          <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                            <span className="text-xs">+{project.team.length - 3}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Tarefas Recentes
                <Badge variant="secondary">{tasks.length}</Badge>
              </CardTitle>
              <CardDescription>
                Suas tarefas mais importantes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{task.title}</h4>
                      <Badge 
                        className={`text-white ${getPriorityColor(task.priority)}`}
                      >
                        {task.priority === "high" ? "Alta" : 
                         task.priority === "medium" ? "Média" : "Baixa"}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>Responsável: {task.assignee}</span>
                      <span>•</span>
                      <span>Prazo: {new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>

                    <Badge 
                      variant="outline"
                      className={getStatusColor(task.status)}
                    >
                      {task.status === "pending" ? "Pendente" :
                       task.status === "in-progress" ? "Em andamento" : "Concluída"}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Modals */}
        <FormModal
          isOpen={modalState.isOpen && modalState.type === "create-project"}
          onClose={closeModal}
          onSubmit={handleCreateProject}
          title="Criar Novo Projeto"
          fields={formFields}
          submitText="Criar Projeto"
          loading={isLoading}
        />

        <ConfirmModal
          isOpen={modalState.isOpen && modalState.type === "delete-project"}
          onClose={closeModal}
          onConfirm={() => handleDeleteProject(modalState.data?.id)}
          title="Excluir Projeto"
          message={`Tem certeza que deseja excluir o projeto "${modalState.data?.name}"? Esta ação não pode ser desfeita.`}
          confirmText="Excluir"
          variant="destructive"
          loading={isLoading}
        />

        <DetailModal
          isOpen={modalState.isOpen && modalState.type === "view-project"}
          onClose={closeModal}
          title={`Detalhes do Projeto: ${modalState.data?.name}`}
          data={modalState.data || {}}
          actions={[
            {
              label: "Editar",
              onClick: () => console.log("Editar projeto"),
              variant: "default",
              icon: <Edit className="h-4 w-4" />
            },
            {
              label: "Excluir",
              onClick: () => {
                closeModal()
                openModal("delete-project", modalState.data)
              },
              variant: "destructive",
              icon: <Trash2 className="h-4 w-4" />
            }
          ]}
        />
      </div>
    </LoadingOverlay>
  )
}

export default MainDashboard
