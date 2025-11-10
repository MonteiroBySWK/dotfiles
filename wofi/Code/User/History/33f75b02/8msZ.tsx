"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, BarChart3, Users, CheckCircle, Clock } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { 
  useProjects, 
  useTasks, 
  useUsers, 
  useProjectStats, 
  useTaskStats 
} from "@/hooks"

export function DashboardWithFirebase() {
  const { user, loading: authLoading } = useAuth()
  const [refreshKey, setRefreshKey] = useState(0)

  // Use our custom hooks with Firebase services
  const { 
    projects, 
    loading: projectsLoading, 
    error: projectsError,
    refetch: refetchProjects 
  } = useProjects()

  const { 
    tasks, 
    loading: tasksLoading, 
    error: tasksError,
    refetch: refetchTasks 
  } = useTasks()

  const { 
    users, 
    loading: usersLoading,
    getUserStats 
  } = useUsers()

  const { 
    stats: projectStats, 
    loading: projectStatsLoading 
  } = useProjectStats()

  const { 
    stats: taskStats, 
    loading: taskStatsLoading 
  } = useTaskStats()

  // Refresh all data
  const handleRefresh = async () => {
    setRefreshKey(prev => prev + 1)
    await Promise.all([
      refetchProjects(),
      refetchTasks()
    ])
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando...</span>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Por favor, faça login para acessar o dashboard.</p>
      </div>
    )
  }

  const isLoading = projectsLoading || tasksLoading || usersLoading
  const hasError = projectsError || tasksError

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo, {user.name}! Aqui está um resumo dos seus projetos.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Atualizar
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Projeto
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {hasError && (
        <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg">
          <p className="font-medium">Erro ao carregar dados:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            {projectsError && <li>Projetos: {projectsError}</li>}
            {tasksError && <li>Tarefas: {tasksError}</li>}
          </ul>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projetos</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projectStatsLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                (projectStats as any)?.total || projects.length
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {(projectStats as any)?.active || 0} ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tarefas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {taskStatsLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                (taskStats as any)?.total || tasks.length
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {(taskStats as any)?.completed || 0} concluídas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usersLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                users.length
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {users.filter(u => u.status === 'active').length} ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {taskStatsLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                (taskStats as any)?.inProgress || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              tarefas ativas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects */}
      <Card>
        <CardHeader>
          <CardTitle>Projetos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {projectsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Carregando projetos...</span>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum projeto encontrado</p>
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Projeto
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.slice(0, 5).map((project) => (
                <div 
                  key={project.id} 
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-medium">{project.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={
                        project.status === 'active' ? 'default' :
                        project.status === 'completed' ? 'secondary' :
                        'outline'
                      }
                    >
                      {project.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {project.progress}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Tarefas Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {tasksLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Carregando tarefas...</span>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma tarefa encontrada</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.slice(0, 5).map((task) => (
                <div 
                  key={task.id} 
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-medium">{task.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {task.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={
                        task.status === 'completed' ? 'secondary' :
                        task.status === 'in-progress' ? 'default' :
                        'outline'
                      }
                    >
                      {task.status}
                    </Badge>
                    <Badge 
                      variant={
                        task.priority === 'urgent' ? 'destructive' :
                        task.priority === 'high' ? 'default' :
                        'outline'
                      }
                    >
                      {task.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}