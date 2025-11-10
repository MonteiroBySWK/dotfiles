"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Plus,
  X,
  Calendar as CalendarIcon,
  Users,
  Save,
  FileText,
  Target,
  Clock,
  DollarSign,
  Check,
  ChevronDown,
  ArrowLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { toast } from "sonner"
import { LoadingOverlay } from "@/components/custom/loading"
import { useAuth } from "@/provider/AuthProvider"
import { useProjects } from "@/hooks/useProjects"
import { useUsers } from "@/hooks/useUsers"
import type { Project as ProjectType, User } from "@/types"

type Props = {
  mode?: "create" | "edit"
  initialData?: Partial<ProjectType>
  submitLabel?: string
  onSubmit?: (data: any) => Promise<any>
  onCancel?: () => void
}

const projectTemplates = [
  { id: "website", name: "Website Institucional", description: "Projeto padrão para criação de website corporativo", estimatedDuration: "8 semanas", defaultTasks: ["Análise de requisitos", "Design de wireframes", "Desenvolvimento frontend", "Desenvolvimento backend", "Testes e deploy"] },
  { id: "mobile", name: "Aplicativo Mobile", description: "Desenvolvimento de app nativo ou híbrido", estimatedDuration: "12 semanas", defaultTasks: ["Especificação técnica", "Design de interface", "Desenvolvimento iOS", "Desenvolvimento Android", "Testes e publicação"] },
  { id: "dashboard", name: "Dashboard/Painel", description: "Painel administrativo ou de controle", estimatedDuration: "6 semanas", defaultTasks: ["Levantamento de métricas", "Design de dashboard", "Desenvolvimento", "Integração de dados", "Testes e homologação"] },
  { id: "custom", name: "Projeto Personalizado", description: "Projeto único com requisitos específicos", estimatedDuration: "A definir", defaultTasks: [] },
]

export default function ProjectForm({ mode = "create", initialData, submitLabel, onSubmit, onCancel }: Props) {
  const router = useRouter()
  const { user: currentUser } = useAuth()
  const { createProject: createProjectHook, loading: projectLoading } = useProjects()
  const { users, loading: usersLoading } = useUsers()

  const [selectedTemplate, setSelectedTemplate] = useState<string>(initialData?.category ?? "")
  const [selectedMembers, setSelectedMembers] = useState<string[]>((initialData?.teamMembers ?? []).map((m: any) => (m.userId ? m.userId : String(m))) )
  const [projectManager, setProjectManager] = useState<string>(initialData?.managerId ?? "")
  const [startDate, setStartDate] = useState<Date | undefined>(initialData?.startDate ? new Date(initialData.startDate as any) : undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(initialData?.endDate ? new Date(initialData.endDate as any) : undefined)
  const [tags, setTags] = useState<string[]>(initialData?.tags ?? [])
  const [newTag, setNewTag] = useState("")
  const [showMembersPopover, setShowMembersPopover] = useState(false)
  const [showStartCalendar, setShowStartCalendar] = useState(false)
  const [showEndCalendar, setShowEndCalendar] = useState(false)
  const [isUrgent, setIsUrgent] = useState(false)
  const [isPublic, setIsPublic] = useState(true)
  const [enableNotifications, setEnableNotifications] = useState(true)

  const [formData, setFormData] = useState<any>({
    name: initialData?.name ?? "",
    description: initialData?.description ?? "",
    budget: initialData?.budget ? (typeof initialData.budget === "object" ? (initialData.budget as any).estimated ?? "" : String(initialData.budget)) : "",
    client: initialData?.clientId ?? "",
    priority: (initialData?.priority ?? "medium") as "low" | "medium" | "high",
  })

  const isLoading = projectLoading || usersLoading

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    const template = projectTemplates.find(t => t.id === templateId)
    if (template && template.id !== "custom") {
      if (!formData.name) handleInputChange("name", template.name)
    }
  }

  const addMember = (userId: string) => {
    if (!selectedMembers.includes(userId)) setSelectedMembers([...selectedMembers, userId])
  }
  const removeMember = (userId: string) => setSelectedMembers(selectedMembers.filter(id => id !== userId))
  const addTag = () => { if (newTag && !tags.includes(newTag)) { setTags([...tags, newTag]); setNewTag("") } }
  const removeTag = (tagToRemove: string) => setTags(tags.filter(tag => tag !== tagToRemove))

  const handleSave = async () => {
    try {
      if (!formData.name || !formData.name.trim()) { toast.error("Nome do projeto é obrigatório"); return }
      if (!currentUser) { toast.error("Usuário não autenticado"); return }

      const projectPayload: any = {
        name: formData.name.trim(),
        description: formData.description?.trim() ?? "",
        status: mode === 'create' ? 'planning' : undefined,
        priority: formData.priority,
        progress: initialData?.progress ?? 0,
        startDate: startDate || new Date(),
        endDate: endDate || (initialData?.endDate ? new Date(initialData.endDate as any) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
        managerId: projectManager || currentUser?.uid || '',
        teamMembers: selectedMembers.map(memberId => ({ userId: memberId, role: 'developer', allocation: 100, joinedAt: new Date() })),
        budget: { estimated: formData.budget ? parseFloat(String(formData.budget).replace(/[^\\d.,]/g, '').replace(',', '.')) : 0, actual: 0, currency: 'BRL', breakdown: { development: 0, design: 0, testing: 0, deployment: 0, other: 0 } },
        clientId: formData.client?.trim() || undefined,
        tags,
        category: selectedTemplate !== 'custom' ? selectedTemplate : 'other',
        milestones: initialData?.milestones ?? [],
        attachments: initialData?.attachments ?? [],
        createdAt: initialData?.createdAt ?? new Date(),
        updatedAt: new Date(),
      }

      if (onSubmit) {
        await onSubmit(projectPayload)
      } else {
        // fallback to hook create
        const newProject = await createProjectHook(projectPayload)
        if (newProject?.id) router.push(`/dashboard/projects/${newProject.id}`)
      }

      toast.success(mode === 'create' ? 'Projeto criado com sucesso!' : 'Projeto salvo com sucesso!')
      if (mode === 'create') router.push('/dashboard/projects')
    } catch (error) {
      console.error('Error saving project:', error)
      toast.error('Falha ao salvar projeto. Tente novamente.')
    }
  }

  const selectedTemplate_obj = projectTemplates.find(t => t.id === selectedTemplate)

  if (isLoading) return <LoadingOverlay isLoading={true}><div /></LoadingOverlay>

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> Template do Projeto</CardTitle>
            <CardDescription>Escolha um template para acelerar a criação</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {projectTemplates.map((template) => (
                <div key={template.id} className={cn("relative cursor-pointer rounded-lg border p-4 hover:bg-accent", selectedTemplate === template.id && "border-primary bg-accent")} onClick={() => handleTemplateSelect(template.id)}>
                  <div className="flex items-center space-x-2">
                    <div className={cn("h-4 w-4 rounded-full border-2 flex items-center justify-center", selectedTemplate === template.id ? "border-primary bg-primary" : "border-muted-foreground")}>
                      {selectedTemplate === template.id && (<Check className="h-3 w-3 text-white" />)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{template.name}</h4>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">Duração estimada: {template.estimatedDuration}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Informações Básicas</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="project-name">Nome do Projeto *</Label>
                <Input id="project-name" placeholder="Ex: Website da Empresa" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client">Cliente</Label>
                <Input id="client" placeholder="Nome do cliente ou empresa" value={formData.client} onChange={(e) => handleInputChange("client", e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" placeholder="Descreva os objetivos e escopo do projeto..." rows={4} value={formData.description} onChange={(e) => handleInputChange("description", e.target.value)} />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Prioridade</Label>
                <Select value={formData.priority} onValueChange={(value: "low" | "medium" | "high") => handleInputChange("priority", value)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Orçamento</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input id="budget" placeholder="0,00" className="pl-9" value={formData.budget} onChange={(e) => handleInputChange("budget", e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Project Manager</Label>
                <Select value={projectManager} onValueChange={setProjectManager}>
                  <SelectTrigger><SelectValue placeholder="Selecionar..." /></SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (<SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" /> Cronograma</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Data de Início</Label>
                <Popover open={showStartCalendar} onOpenChange={setShowStartCalendar}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal"><CalendarIcon className="mr-2 h-4 w-4" />{startDate ? format(startDate, "PPP", { locale: ptBR }) : "Selecionar data"}</Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={startDate} onSelect={setStartDate} disabled={(date) => date < new Date("1900-01-01")} initialFocus /></PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Data de Entrega</Label>
                <Popover open={showEndCalendar} onOpenChange={setShowEndCalendar}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal"><CalendarIcon className="mr-2 h-4 w-4" />{endDate ? format(endDate, "PPP", { locale: ptBR }) : "Selecionar data"}</Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={endDate} onSelect={setEndDate} disabled={(date) => !startDate || date < startDate} initialFocus /></PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Equipe do Projeto</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Membros da Equipe</Label>
              <Popover open={showMembersPopover} onOpenChange={setShowMembersPopover}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">Adicionar membros <ChevronDown className="h-4 w-4" /></Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Buscar membros..." />
                    <CommandList>
                      <CommandEmpty>Nenhum membro encontrado.</CommandEmpty>
                      <CommandGroup>
                        {users.map((user) => (
                          <CommandItem key={user.id} onSelect={() => { addMember(user.id); setShowMembersPopover(false) }} disabled={selectedMembers.includes(user.id)}>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6"><AvatarImage src={user.avatar || "/avatars/default.jpg"} alt={user.name} /><AvatarFallback>{user.name?.split(' ').map(n => n[0]).join('') || 'U'}</AvatarFallback></Avatar>
                              <div><div className="font-medium">{user.name}</div><div className="text-sm text-muted-foreground">{user.role || user.email}</div></div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {selectedMembers.length > 0 && (<div className="space-y-2"><Label>Membros Selecionados</Label><div className="flex flex-wrap gap-2">{selectedMembers.map((memberId) => { const member = users.find(u => u.id === memberId); return member ? (<div key={member.id} className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-2"><Avatar className="h-6 w-6"><AvatarImage src={member.avatar || "/avatars/default.jpg"} alt={member.name} /><AvatarFallback>{member.name?.split(' ').map(n => n[0]).join('') || 'U'}</AvatarFallback></Avatar><span className="text-sm font-medium">{member.name}</span><Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => removeMember(member.id)}><X className="h-3 w-3" /></Button></div>) : null })}</div></div>)}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Tags</CardTitle><CardDescription>Organize seu projeto com tags</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2"><Input placeholder="Nova tag..." value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTag()} /><Button onClick={addTag} size="icon"><Plus className="h-4 w-4" /></Button></div>
            {tags.length > 0 && (<div className="flex flex-wrap gap-2">{tags.map((tag) => (<Badge key={tag} variant="secondary" className="flex items-center gap-1">{tag}<Button variant="ghost" size="sm" className="h-4 w-4 p-0" onClick={() => removeTag(tag)}><X className="h-3 w-3" /></Button></Badge>))}</div>)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Configurações</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between"><div className="space-y-0.5"><Label>Projeto Urgente</Label><p className="text-sm text-muted-foreground">Marcar como alta prioridade</p></div><Switch checked={isUrgent} onCheckedChange={setIsUrgent} /></div>
            <Separator />
            <div className="flex items-center justify-between"><div className="space-y-0.5"><Label>Projeto Público</Label><p className="text-sm text-muted-foreground">Visível para toda equipe</p></div><Switch checked={isPublic} onCheckedChange={setIsPublic} /></div>
            <Separator />
            <div className="flex items-center justify-between"><div className="space-y-0.5"><Label>Notificações</Label><p className="text-sm text-muted-foreground">Receber atualizações</p></div><Switch checked={enableNotifications} onCheckedChange={setEnableNotifications} /></div>
          </CardContent>
        </Card>

        {selectedTemplate_obj && selectedTemplate_obj.defaultTasks.length > 0 && (<Card><CardHeader><CardTitle>Tarefas do Template</CardTitle><CardDescription>Tarefas que serão criadas automaticamente</CardDescription></CardHeader><CardContent><div className="space-y-2">{selectedTemplate_obj.defaultTasks.map((task, index) => (<div key={index} className="flex items-center gap-2 text-sm"><Target className="h-3 w-3 text-muted-foreground" />{task}</div>))}</div></CardContent></Card>)}

        <div className="space-y-2">
          <Button onClick={handleSave} className="w-full" disabled={isLoading}>{isLoading ? (mode === 'create' ? 'Criando...' : 'Salvando...') : (submitLabel ?? (mode === 'create' ? 'Criar Projeto' : 'Salvar'))}</Button>
          {onCancel && <Button variant="outline" className="w-full" onClick={onCancel}>Cancelar</Button>}
        </div>
      </div>
    </div>
  )
}
