"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/custom/feedback'
import { useAuth } from '@/provider/AuthProvider'
import { useProjects } from '@/hooks/useProjects'
import { useTasks } from '@/hooks/useTasks'
import { Project, Task } from '@/types'

export function AdminSeeder() {
  const { addNotification } = useToast()
  const { user } = useAuth()
  const { createProject, refetch: refetchProjects } = useProjects()
  const { createTask, refetch: refetchTasks } = useTasks()
  const [loading, setLoading] = React.useState(false)

  const [projectData, setProjectData] = React.useState({
    name: 'Sistema de Gestão Empresarial',
    description: 'Sistema completo de gestão empresarial com módulos de vendas, estoque e financeiro.',
    endDate: '2024-06-30'
  })

  const [taskData, setTaskData] = React.useState({
    title: 'Implementar sistema de autenticação',
    description: 'Desenvolver sistema completo de login, registro e recuperação de senha usando Firebase Auth',
    dueDate: '2024-02-15'
  })

  const handleCreateSampleProject = async () => {
    if (!user) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: 'Você precisa estar logado para criar projetos'
      })
      return
    }

    setLoading(true)
    try {
      const project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> = {
        name: projectData.name,
        description: projectData.description,
        status: 'active',
        progress: 75,
        startDate: new Date(),
        endDate: projectData.endDate ? new Date(projectData.endDate) : undefined,
        priority: 'high',
        teamMembers: [
          { userId: user.uid, role: 'lead', joinedAt: new Date() }
        ],
        managerId: user.uid,
        category: 'Sistema',
        tags: ['gestão', 'empresarial', 'vendas'],
        milestones: [],
        attachments: []
      }

      await createProject(project)
      
      addNotification({
        type: 'success',
        title: 'Projeto criado!',
        message: `O projeto "${project.name}" foi criado com sucesso.`
      })
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Erro ao criar projeto',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSampleTask = async () => {
    if (!user) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: 'Você precisa estar logado para criar tarefas'
      })
      return
    }

    setLoading(true)
    try {
      const task: Omit<Task, 'id'> = {
        title: taskData.title,
        description: taskData.description,
        status: 'in-progress',
        priority: 'high',
        assigneeId: user.id,
        reporterId: user.id,
        dueDate: taskData.dueDate ? new Date(taskData.dueDate) : undefined,
        estimatedHours: 16,
        tags: ['autenticação', 'firebase'],
        labels: [],
        comments: [],
        attachments: [],
        checklist: [],
        dependencies: [],
        watchers: [user.id],
        customFields: {},
        createdAt: new Date(),
        updatedAt: new Date()
      }

      await createTask(task)
      
      addNotification({
        type: 'success',
        title: 'Tarefa criada!',
        message: `A tarefa "${task.title}" foi criada com sucesso.`
      })
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Erro ao criar tarefa',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateMultipleSamples = async () => {
    setLoading(true)
    try {
      // Create multiple sample projects
      const projects = [
        {
          name: 'Sistema de Gestão Empresarial',
          description: 'Sistema completo de gestão empresarial com módulos de vendas, estoque e financeiro.',
          status: 'active' as const,
          progress: 75,
          priority: 'high' as const,
          category: 'Sistema',
          tags: ['gestão', 'empresarial', 'vendas']
        },
        {
          name: 'Aplicativo Mobile de Produtividade',
          description: 'App mobile para gestão de tarefas e aumento de produtividade pessoal.',
          status: 'active' as const,
          progress: 45,
          priority: 'medium' as const,
          category: 'Mobile',
          tags: ['mobile', 'produtividade', 'tarefas']
        },
        {
          name: 'Dashboard de Analytics',
          description: 'Dashboard avançado para análise de dados e métricas de negócio.',
          status: 'completed' as const,
          progress: 100,
          priority: 'high' as const,
          category: 'Analytics',
          tags: ['dashboard', 'analytics', 'métricas']
        }
      ]

      // Create multiple sample tasks
      const tasks = [
        {
          title: 'Implementar sistema de autenticação',
          description: 'Desenvolver sistema completo de login, registro e recuperação de senha usando Firebase Auth',
          status: 'completed' as const,
          priority: 'high' as const,
          tags: ['autenticação', 'firebase', 'segurança']
        },
        {
          title: 'Criar interface de gerenciamento de produtos',
          description: 'Desenvolver telas para CRUD de produtos no módulo de vendas',
          status: 'in-progress' as const,
          priority: 'medium' as const,
          tags: ['frontend', 'produtos', 'crud']
        },
        {
          title: 'Configurar pipeline de CI/CD',
          description: 'Implementar pipeline automatizado para build, testes e deploy',
          status: 'todo' as const,
          priority: 'high' as const,
          tags: ['devops', 'ci/cd', 'deployment']
        },
        {
          title: 'Desenvolver telas de onboarding',
          description: 'Criar fluxo de introdução para novos usuários do app mobile',
          status: 'in-progress' as const,
          priority: 'medium' as const,
          tags: ['mobile', 'onboarding', 'ux']
        }
      ]

      // Create projects
      for (const projectInfo of projects) {
        if (user) {
          const project: Omit<Project, 'id'> = {
            ...projectInfo,
            startDate: new Date(),
            endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months from now
            teamMembers: [
              { userId: user.id, role: 'lead', allocation: 100, joinedAt: new Date() }
            ],
            managerId: user.id,
            milestones: [],
            attachments: [],
            createdAt: new Date(),
            updatedAt: new Date()
          }
          await createProject(project)
        }
      }

      // Create tasks
      for (const taskInfo of tasks) {
        if (user) {
          const task: Omit<Task, 'id'> = {
            ...taskInfo,
            assigneeId: user.id,
            reporterId: user.id,
            dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within 30 days
            estimatedHours: Math.floor(Math.random() * 40) + 8, // 8-48 hours
            labels: [],
            comments: [],
            attachments: [],
            checklist: [],
            dependencies: [],
            watchers: [user.id],
            customFields: {},
            createdAt: new Date(),
            updatedAt: new Date(),
            ...(taskInfo.status === 'completed' ? { completedAt: new Date() } : {})
          }
          await createTask(task)
        }
      }

      addNotification({
        type: 'success',
        title: 'Dados de exemplo criados!',
        message: `${projects.length} projetos e ${tasks.length} tarefas foram criados com sucesso.`
      })

      // Refresh data
      await refreshData()
      
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Erro ao criar dados de exemplo',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Administração - Dados de Exemplo</CardTitle>
          <CardDescription>
            Você precisa estar logado para criar dados de exemplo
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Administração - Dados de Exemplo</CardTitle>
          <CardDescription>
            Use esta ferramenta para popular o banco de dados com dados de exemplo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Button 
              onClick={handleCreateMultipleSamples}
              disabled={loading}
              size="lg"
              className="w-full"
            >
              {loading ? 'Criando...' : 'Criar Dados de Exemplo Completos'}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Cria 3 projetos de exemplo e 4 tarefas de exemplo
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Project Creation */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Criar Projeto</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="project-name">Nome do Projeto</Label>
                  <Input
                    id="project-name"
                    value={projectData.name}
                    onChange={(e) => setProjectData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="project-description">Descrição</Label>
                  <Textarea
                    id="project-description"
                    value={projectData.description}
                    onChange={(e) => setProjectData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="project-endDate">Data de Entrega</Label>
                  <Input
                    id="project-endDate"
                    type="date"
                    value={projectData.endDate}
                    onChange={(e) => setProjectData(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
                <Button 
                  onClick={handleCreateSampleProject}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Criando...' : 'Criar Projeto'}
                </Button>
              </div>
            </div>

            {/* Task Creation */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Criar Tarefa</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="task-title">Título da Tarefa</Label>
                  <Input
                    id="task-title"
                    value={taskData.title}
                    onChange={(e) => setTaskData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="task-description">Descrição</Label>
                  <Textarea
                    id="task-description"
                    value={taskData.description}
                    onChange={(e) => setTaskData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="task-dueDate">Data de Entrega</Label>
                  <Input
                    id="task-dueDate"
                    type="date"
                    value={taskData.dueDate}
                    onChange={(e) => setTaskData(prev => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>
                <Button 
                  onClick={handleCreateSampleTask}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Criando...' : 'Criar Tarefa'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}