"use client"

import * as React from "react"
import { 
  BarChart3, 
  TrendingUp,
  Clock,
  CheckCircle,
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
  RefreshButton
} from "@/components/custom/loading"

// Import new reusable components
import { StatCard, StatsGrid } from "@/components/common"

// Import stores and types
import { useDashboardStore } from "@/stores/dashboardStore"
import { useAuthStore } from "@/stores/authStore"
import { Project, Task, User } from "@/types"

const MainDashboard: React.FC = () => {
  const { addNotification } = useToast()
  const { 
    modalState, 
    openModal, 
    closeModal 
  } = useModal()

  // Dashboard store
  const {
    recentProjects,
    recentTasks,
    stats,
    loading,
    error,
    initializeDashboard,
    createProject,
    deleteProject,
    refreshData
  } = useDashboardStore()

  const { user } = useAuthStore()

  // Initialize dashboard data on mount
  React.useEffect(() => {
    initializeDashboard()
  }, [initializeDashboard])

  // Show error notification if any
  React.useEffect(() => {
    if (error) {
      addNotification({
        type: "error",
        title: "Erro",
        message: error
      })
    }
  }, [error, addNotification])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "in-progress":
        return "bg-blue-500"
      case "completed":
        return "bg-green-500"
      case "on-hold":
      case "planning":
        return "bg-yellow-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo"
      case "completed":
        return "Concluído"
      case "on-hold":
        return "Pausado"
      case "planning":
        return "Planejamento"
      case "cancelled":
        return "Cancelado"
      case "todo":
        return "Pendente"
      case "in-progress":
        return "Em andamento"
      case "review":
        return "Em revisão"
      case "testing":
        return "Em teste"
      default:
        return status
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "Urgente"
      case "high":
        return "Alta"
      case "medium":
        return "Média"
      case "low":
        return "Baixa"
      default:
        return priority
    }
  }

  const handleCreateProject = async (data: Record<string, string>) => {
    try {
      const projectData: Omit<Project, 'id'> = {
        name: data.name,
        description: data.description,
        status: "planning",
        progress: 0,
        startDate: new Date(),
        endDate: data.deadline ? new Date(data.deadline) : undefined,
        priority: "medium",
        teamMembers: [],
        managerId: user?.id || '',
        category: "geral",
        tags: [],
        milestones: [],
        attachments: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      await createProject(projectData)
      
      addNotification({
        type: "success",
        title: "Projeto criado!",
        message: `O projeto "${data.name}" foi criado com sucesso.`
      })
      
      closeModal()
    } catch (error) {
      addNotification({
        type: "error",
        title: "Erro ao criar projeto",
        message: "Ocorreu um erro inesperado. Tente novamente."
      })
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    try {
      const project = recentProjects.find(p => p.id === projectId)
      await deleteProject(projectId)
      
      addNotification({
        type: "success",
        title: "Projeto excluído",
        message: `O projeto "${project?.name}" foi excluído com sucesso.`
      })
      
      closeModal()
    } catch (error) {
      addNotification({
        type: "error",
        title: "Erro ao excluir projeto",
        message: "Não foi possível excluir o projeto. Tente novamente."
      })
    }
  }

  const handleRefreshData = async () => {
    try {
      await refreshData()
      
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
            <h1 className="text-3xl font-bold tracking-tight">Visão Geral</h1>
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

        {/* Stats - Using new StatCard component with responsive grid */}
        <StatsGrid>
          <StatCard
            title="Total de Projetos"
            value={projects.length}
            description="+2 desde o mês passado"
            icon={BarChart3}
          />
          
          <StatCard
            title="Projetos Ativos"
            value={projects.filter(p => p.status === "active").length}
            description="Em desenvolvimento"
            icon={TrendingUp}
          />

          <StatCard
            title="Tarefas Pendentes"
            value={tasks.filter(t => t.status === "pending").length}
            description="Aguardando execução"
            icon={Clock}
          />

          <StatCard
            title="Taxa de Conclusão"
            value="89%"
            description="+5% desde a semana passada"
            icon={CheckCircle}
            iconColor="text-green-500"
          />
        </StatsGrid>

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
          onConfirm={() => {
            const project = modalState.data as Project | undefined
            if (project?.id) {
              handleDeleteProject(project.id)
            }
          }}
          title="Excluir Projeto"
          message={`Tem certeza que deseja excluir o projeto "${(modalState.data as Project)?.name || 'este projeto'}"? Esta ação não pode ser desfeita.`}
          confirmText="Excluir"
          variant="destructive"
          loading={isLoading}
        />

        <DetailModal
          isOpen={modalState.isOpen && modalState.type === "view-project"}
          onClose={closeModal}
          title={`Detalhes do Projeto: ${(modalState.data as Project)?.name || 'Projeto'}`}
          data={(modalState.data as Record<string, unknown>) || {} as Record<string, unknown>}
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
