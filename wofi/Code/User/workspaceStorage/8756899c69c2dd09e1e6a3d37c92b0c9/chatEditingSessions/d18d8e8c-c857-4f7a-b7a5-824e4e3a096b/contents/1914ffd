'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useProjects } from '@/hooks/useProjects'
import { Project } from '@/types/project'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Save, Trash2, ArrowLeft } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

export default function ProjectConfigPage() {
  const params = useParams<{ projectId: string }>()
  const router = useRouter()
  const { toast } = useToast()
  const projectId = useMemo(() => {
    const raw = params?.projectId
    return Array.isArray(raw) ? raw[0] : raw
  }, [params])

  const { findProjectById, updateProject, deleteProject, loading: projectsLoading } = useProjects()
  
  const [project, setProject] = useState<Project | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '',
    description: '',
    status: 'planning',
    priority: 'medium',
    progress: 0,
    budget: '',
    deadline: '', // yyyy-mm-dd
    clientName: '',
  })

  useEffect(() => {
    if (projectId) {
      const fetchedProject = findProjectById(projectId)
      if (fetchedProject) {
        setProject(fetchedProject)
        setForm({
          name: fetchedProject.name ?? '',
          description: fetchedProject.description ?? '',
          status: fetchedProject.status ?? 'planning',
          priority: fetchedProject.priority ?? 'medium',
          progress: fetchedProject.progress ?? 0,
          budget: fetchedProject.budget?.toString() ?? '',
          deadline: fetchedProject.deadline ? new Date(fetchedProject.deadline).toISOString().slice(0, 10) : '',
          clientName: fetchedProject.clientName ?? '',
        })
      } else if (!projectsLoading) {
        setError('Projeto não encontrado')
      }
    }
  }, [projectId, findProjectById, projectsLoading])

  function onChange<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function onSave() {
    if (!projectId) return
    setSaving(true)
    setError(null)
    try {
      const progress = Math.max(0, Math.min(100, Number(form.progress ?? 0)))
      const budget = form.budget ? parseFloat(form.budget) : undefined
      const deadline = form.deadline ? new Date(form.deadline) : undefined

      const payload: Partial<Project> = {
        name: form.name,
        description: form.description,
        status: form.status,
        priority: form.priority,
        progress,
        budget,
        deadline,
        clientName: form.clientName || undefined,
      }

      await updateProject(projectId, payload)
      toast({
        title: "Sucesso",
        description: "Configurações salvas com sucesso.",
      })
    } catch (e) {
      console.error(e)
      setError('Falha ao salvar alterações')
      toast({
        title: "Erro",
        description: "Falha ao salvar alterações.",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  async function onDelete() {
    if (!projectId) return
    const confirmed = window.confirm('Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.')
    if (!confirmed) return
    try {
      await deleteProject(projectId)
      toast({
        title: "Sucesso",
        description: "Projeto excluído com sucesso.",
      })
      router.push('/dashboard/projects')
    } catch (e) {
      console.error(e)
      setError('Falha ao excluir projeto')
      toast({
        title: "Erro",
        description: "Falha ao excluir projeto.",
        variant: "destructive"
      })
    }
  }

  if (projectsLoading) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Carregando configurações...
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="text-red-600">{error}</div>
        <Link href="/dashboard/projects">
          <Button variant="secondary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Configurações do Projeto</h1>
          <p className="text-muted-foreground">Edite os detalhes do projeto e salve as alterações.</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/projects/${projectId}`}>
            <Button variant="secondary">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Projeto
            </Button>
          </Link>
          <Button onClick={onSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações básicas</CardTitle>
          <CardDescription>Nome, descrição, status e prioridade.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome</label>
              <input
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={form.name}
                onChange={(e) => onChange('name', e.target.value)}
                placeholder="Nome do projeto"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Cliente</label>
              <input
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={form.clientName}
                onChange={(e) => onChange('clientName', e.target.value)}
                placeholder="Nome do cliente"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Descrição</label>
            <textarea
              className="w-full rounded-md border px-3 py-2 text-sm min-h-[100px]"
              value={form.description}
              onChange={(e) => onChange('description', e.target.value)}
              placeholder="Descreva brevemente o projeto"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={form.status}
                onChange={(e) => onChange('status', e.target.value)}
              >
                <option value="planning">Planning</option>
                <option value="in-progress">In progress</option>
                <option value="completed">Completed</option>
                <option value="paused">Paused</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Prioridade</label>
              <select
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={form.priority}
                onChange={(e) => onChange('priority', e.target.value)}
              >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
                <option value="critical">Crítica</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Progresso (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={form.progress}
                onChange={(e) =>
                  onChange('progress', Math.max(0, Math.min(100, Number(e.target.value ?? 0))))
                }
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Orçamento (número)</label>
              <input
                className="w-full rounded-md border px-3 py-2 text-sm"
                placeholder="Ex: 50000"
                value={form.budget}
                onChange={(e) => onChange('budget', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Deadline</label>
              <input
                type="date"
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={form.deadline}
                onChange={(e) => onChange('deadline', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Zona de Perigo</CardTitle>
          <CardDescription>Excluir o projeto permanentemente.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={onDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir Projeto
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
