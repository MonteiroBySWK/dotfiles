'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
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
  const [error, setError] = useState<string | null>(null)
  const [initialData, setInitialData] = useState<any | null>(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      if (!projectId) return
      setLoading(true)
      setError(null)
      try {
        const ref = doc(db, 'projects', projectId)
        const snap = await getDoc(ref)
        if (!snap.exists()) {
          if (mounted) setError('Projeto não encontrado')
          return
        }
        const data = snap.data() as ProjectDoc
        // normalize basic fields for ProjectForm
        const client = typeof data.client === 'string' ? data.client : typeof data.client === 'object' ? data.client?.name ?? '' : data.clientName ?? ''
        const normalized: any = {
          id: snap.id,
          name: data.name ?? '',
          description: data.description ?? '',
          priority: (data.priority as any) ?? 'medium',
          progress: Number(data.progress ?? 0),
          startDate: data.createdAt ? toDateSafe(data.createdAt) ?? new Date() : undefined,
          endDate: toDateSafe(data.deadline) ?? undefined,
          managerId: data['managerId'] ?? undefined,
          teamMembers: data['teamMembers'] ?? [],
          budget: data.budget ?? undefined,
          clientId: data.client ?? data.clientName ?? client,
          tags: data['tags'] ?? [],
          category: data['category'] ?? undefined,
          milestones: data['milestones'] ?? [],
          attachments: data['attachments'] ?? [],
        }
        if (mounted) setInitialData(normalized)
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

  async function handleSubmit(payload: any) {
    if (!projectId) throw new Error('missing projectId')
    // translate payload to Firestore fields
    const ref = doc(db, 'projects', projectId)
    const toSave: any = {
      name: payload.name,
      description: payload.description,
      priority: payload.priority,
      updatedAt: serverTimestamp(),
      progress: payload.progress ?? 0,
      budget: payload.budget ?? undefined,
      deadline: payload.endDate ?? undefined,
      clientName: payload.clientId ?? undefined,
    }
    await updateDoc(ref, toSave)
    return true
  }

  if (loading) return (<div className="py-12 text-center text-muted-foreground">Carregando configurações...</div>)
  if (error) return (<div className="space-y-4"><div className="text-red-600">{error}</div><Link href="/dashboard/projects"><Button variant="secondary"><ArrowLeft className="mr-2 h-4 w-4" />Voltar</Button></Link></div>)

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
        </div>
      </div>

      <ProjectForm mode="edit" initialData={initialData} onSubmit={handleSubmit} onCancel={() => { /* no-op default, could navigate back */ }} />
    </div>
  )
}