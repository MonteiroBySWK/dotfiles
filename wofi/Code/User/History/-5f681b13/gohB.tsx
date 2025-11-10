'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { doc, getDoc, updateDoc, deleteDoc, serverTimestamp, FieldValue } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Save, Trash2, ArrowLeft } from 'lucide-react'

type FirestoreTimestamp = { toDate: () => Date }
type ProjectDoc = {
  name?: string
  description?: string
  status?: 'planning' | 'in-progress' | 'completed' | 'paused' | string
  priority?: 'low' | 'medium' | 'high' | 'critical' | string
  progress?: number | string
  budget?: number | string
  deadline?: Date | string | FirestoreTimestamp
  client?: string | { name?: string }
  clientName?: string
  createdAt?: Date | string | FirestoreTimestamp
  updatedAt?: Date | string | FirestoreTimestamp | FieldValue
}

function toDateSafe(v: ProjectDoc['createdAt']): Date | null {
  if (!v) return null
  if (v instanceof Date) return v
  if (typeof v === 'string') {
    const d = new Date(v)
    return isNaN(d.getTime()) ? null : d
  }
  if (typeof v === 'object' && 'toDate' in v && typeof v.toDate === 'function') {
    try { return v.toDate() } catch { return null }
  }
  return null
}

function toNumberSafe(n: unknown, fallback = 0): number {
  if (typeof n === 'number') return n
  if (typeof n === 'string') {
    const parsed = Number(n.replace?.(',', '.') ?? n)
    return isNaN(parsed) ? fallback : parsed
  }
  return fallback
}

export default function ProjectConfig() {
  const params = useParams<{ projectId: string }>()
  const router = useRouter()
  const projectId = useMemo(() => {
    const raw = params?.projectId
    return Array.isArray(raw) ? raw[0] : raw
  }, [params])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '',
    description: '',
    status: 'planning',
    priority: 'medium',
    progress: 0,
    budget: '',
    deadline: '', // yyyy-mm-dd
    client: '',
  })

  useEffect(() => {
    let mounted = true
    async function load() {
      if (!projectId) return
      setLoading(true)
      setError(null)
      setSuccess(null)
      try {
        const ref = doc(db, 'projects', projectId)
        const snap = await getDoc(ref)
        if (!snap.exists()) {
          if (mounted) setError('Projeto não encontrado')
          return
        }
        const data = snap.data() as ProjectDoc
        const deadline = toDateSafe(data.deadline)
        const client =
          typeof data.client === 'string'
            ? data.client
            : typeof data.client === 'object'
              ? (data.client?.name ?? '')
              : (data.clientName ?? '')

        if (mounted) {
          setForm({
            name: data.name ?? '',
            description: data.description ?? '',
            status: (data.status ?? 'planning') as string,
            priority: (data.priority ?? 'medium') as string,
            progress: Math.max(0, Math.min(100, toNumberSafe(data.progress, 0))),
            budget:
              typeof data.budget === 'number'
                ? String(data.budget)
                : (data.budget ?? ''),
            deadline: deadline ? deadline.toISOString().slice(0, 10) : '',
            client,
          })
        }
      } catch (e) {
        console.error(e)
        if (mounted) setError('Falha ao carregar projeto')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [projectId])

  function onChange<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function onSave() {
    if (!projectId) return
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const ref = doc(db, 'projects', projectId)

      const progress = Math.max(0, Math.min(100, toNumberSafe(form.progress, 0)))

      const budgetTrim = String(form.budget ?? '').trim()
      let budgetToSave: number | string | null = null
      if (budgetTrim !== '') {
        const parsedBudget = Number(budgetTrim.replace(',', '.'))
        budgetToSave = isNaN(parsedBudget) ? budgetTrim : parsedBudget
      }

      const deadlineToSave = form.deadline ? new Date(form.deadline) : null

      const payload: Partial<ProjectDoc> & { updatedAt: unknown } = {
        name: form.name,
        description: form.description,
        status: form.status,
        priority: form.priority,
        progress,
        budget: budgetToSave ?? undefined,
        deadline: deadlineToSave ?? undefined,
        clientName: form.client || undefined,
        updatedAt: serverTimestamp(),
      }

      await updateDoc(ref, payload)
      setSuccess('Configurações salvas com sucesso')
    } catch (e) {
      console.error(e)
      setError('Falha ao salvar alterações')
    } finally {
      setSaving(false)
    }
  }

  async function onDelete() {
    if (!projectId) return
    const confirmed = window.confirm('Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.')
    if (!confirmed) return
    try {
      await deleteDoc(doc(db, 'projects', projectId))
      router.push('/dashboard/projects')
    } catch (e) {
      console.error(e)
      setError('Falha ao excluir projeto')
    }
  }

  if (loading) {
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

      {success && (
        <div className="rounded-md border border-green-200 bg-green-50 text-green-800 px-3 py-2">
          {success}
        </div>
      )}

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
                value={form.client}
                onChange={(e) => onChange('client', e.target.value)}
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