'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTable } from '@/components/custom/data-table'
import { ColumnDef } from '@tanstack/react-table'
import {
  Plus,
  CheckSquare,
  Clock,
  Flag,
  Kanban,
  CalendarDays,
  User,
} from 'lucide-react'
import { FadeIn } from '@/components/custom/animations'
import { useToast } from '@/components/custom/feedback'
import { useTasks } from '@/hooks/useTasks'
import { Task } from '@/types'
import { StatCard, StatusBadge } from '@/components/common'
import { LoadingSpinner } from '@/components/custom/loading'

export default function TasksPage() {
  const { addNotification } = useToast()
  const { tasks, loading, error } = useTasks()
  const [showNewTaskForm, setShowNewTaskForm] = useState(false)

  const columns: ColumnDef<Task>[] = [
    {
      id: 'select',
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
      accessorKey: 'title',
      header: 'Tarefa',
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.getValue('title')}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.description}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string
        return <StatusBadge status={status} />
      },
    },
    {
      accessorKey: 'priority',
      header: 'Prioridade',
      cell: ({ row }) => {
        const priority = row.getValue('priority') as string
        return <StatusBadge status={priority} />
      },
    },
    {
      accessorKey: 'assigneeId',
      header: 'Responsável',
      cell: ({ row }) => {
        return row.original.assigneeId || 'Não atribuído'
      },
    },
    {
      accessorKey: 'projectId',
      header: 'Projeto',
      cell: ({ row }) => {
        return row.original.projectId || 'Sem projeto'
      },
    },
    {
      accessorKey: 'dueDate',
      header: 'Prazo',
      cell: ({ row }) => {
        const dueDate = row.original.dueDate
        return dueDate
          ? new Date(dueDate).toLocaleDateString('pt-BR')
          : 'Não definido'
      },
    },
    {
      accessorKey: 'tags',
      header: 'Tags',
      cell: ({ row }) => {
        const tags = (row.getValue('tags') as string[]) || []
        return (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )
      },
    },
  ]

  const stats = {
    total: tasks.length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    overdue: tasks.filter(
      (t) =>
        t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed',
    ).length,
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-red-500">Erro ao carregar tarefas: {error}</p>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <FadeIn>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tarefas</h1>
            <p className="text-muted-foreground">
              Gerencie todas as tarefas e atividades do projeto
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowNewTaskForm(!showNewTaskForm)}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Tarefa
            </Button>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={100}>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="default" size="sm">
            <Link href="/dashboard/tasks">
              <CheckSquare className="mr-2 h-4 w-4" />
              Lista de Tarefas
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/tasks/my">
              <User className="mr-2 h-4 w-4" />
              Minhas Tarefas
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/tasks/kanban">
              <Kanban className="mr-2 h-4 w-4" />
              Kanban
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/tasks/timeline">
              <CalendarDays className="mr-2 h-4 w-4" />
              Timeline
            </Link>
          </Button>
        </div>
      </FadeIn>

      <FadeIn delay={200}>
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            title="Total de Tarefas"
            value={stats.total.toString()}
            description="+3 esta semana"
            icon={CheckSquare}
          />

          <StatCard
            title="Em Progresso"
            value={stats.inProgress.toString()}
            description="Atividades em andamento"
            icon={Clock}
          />

          <StatCard
            title="Concluídas"
            value={stats.completed.toString()}
            description={`${Math.round((stats.completed / (stats.total || 1)) * 100)}% do total`}
            icon={CheckSquare}
            iconColor="text-green-500"
          />

          <StatCard
            title="Atrasadas"
            value={stats.overdue.toString()}
            description="Requerem atenção"
            icon={Flag}
            iconColor="text-red-500"
            className="[&_.text-2xl]:text-red-500"
          />
        </div>
      </FadeIn>

      <FadeIn delay={400}>
        <DataTable
          columns={columns}
          data={tasks}
          searchKey="title"
          searchPlaceholder="Buscar tarefas..."
          filters={[
            {
              key: 'status',
              label: 'Status',
              options: [
                { label: 'A Fazer', value: 'todo' },
                { label: 'Em Progresso', value: 'in-progress' },
                { label: 'Em Revisão', value: 'review' },
                { label: 'Concluído', value: 'completed' },
              ],
            },
            {
              key: 'priority',
              label: 'Prioridade',
              options: [
                { label: 'Baixa', value: 'low' },
                { label: 'Média', value: 'medium' },
                { label: 'Alta', value: 'high' },
                { label: 'Urgente', value: 'urgent' },
              ],
            },
          ]}
          enableRowSelection={true}
          enableExport={true}
          pageSize={10}
        />
      </FadeIn>
    </div>
  )
}