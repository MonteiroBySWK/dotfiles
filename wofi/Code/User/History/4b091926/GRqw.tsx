"use client"

import { useState } from "react"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { 
  Plus,
  X,
  Calendar as CalendarIcon,
  Users,
  ArrowLeft,
  Save,
  FileText,
  Target,
  Clock,
  DollarSign,
  Check,
  ChevronDown
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

type TeamMember = {
  id: string
  name: string
  email: string
  role: string
  avatar: string
}

type ProjectTemplate = {
  id: string
  name: string
  description: string
  estimatedDuration: string
  defaultTasks: string[]
}

const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@empresa.com",
    role: "Desenvolvedor Frontend",
    avatar: "/avatars/joao.jpg"
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria@empresa.com",
    role: "Designer UI/UX",
    avatar: "/avatars/maria.jpg"
  },
  {
    id: "3",
    name: "Carlos Oliveira",
    email: "carlos@empresa.com",
    role: "Project Manager",
    avatar: "/avatars/carlos.jpg"
  },
  {
    id: "4",
    name: "Ana Costa",
    email: "ana@empresa.com",
    role: "Desenvolvedor Backend",
    avatar: "/avatars/ana.jpg"
  },
  {
    id: "5",
    name: "Pedro Ferreira",
    email: "pedro@empresa.com",
    role: "QA Tester",
    avatar: "/avatars/pedro.jpg"
  }
]

const projectTemplates: ProjectTemplate[] = [
  {
    id: "website",
    name: "Website Institucional",
    description: "Projeto padrão para criação de website corporativo",
    estimatedDuration: "8 semanas",
    defaultTasks: [
      "Análise de requisitos",
      "Design de wireframes",
      "Desenvolvimento frontend",
      "Desenvolvimento backend",
      "Testes e deploy"
    ]
  },
  {
    id: "mobile",
    name: "Aplicativo Mobile",
    description: "Desenvolvimento de app nativo ou híbrido",
    estimatedDuration: "12 semanas",
    defaultTasks: [
      "Especificação técnica",
      "Design de interface",
      "Desenvolvimento iOS",
      "Desenvolvimento Android",
      "Testes e publicação"
    ]
  },
  {
    id: "dashboard",
    name: "Dashboard/Painel",
    description: "Painel administrativo ou de controle",
    estimatedDuration: "6 semanas",
    defaultTasks: [
      "Levantamento de métricas",
      "Design de dashboard",
      "Desenvolvimento",
      "Integração de dados",
      "Testes e homologação"
    ]
  },
  {
    id: "custom",
    name: "Projeto Personalizado",
    description: "Projeto único com requisitos específicos",
    estimatedDuration: "A definir",
    defaultTasks: []
  }
]

export default function NewProjectPage() {
  const router = useRouter()
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [selectedMembers, setSelectedMembers] = useState<TeamMember[]>([])
  const [projectManager, setProjectManager] = useState<string>("")
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [showMembersPopover, setShowMembersPopover] = useState(false)
  const [showStartCalendar, setShowStartCalendar] = useState(false)
  const [showEndCalendar, setShowEndCalendar] = useState(false)
  const [isUrgent, setIsUrgent] = useState(false)
  const [isPublic, setIsPublic] = useState(true)
  const [enableNotifications, setEnableNotifications] = useState(true)
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    budget: "",
    client: "",
    priority: "medium"
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    const template = projectTemplates.find(t => t.id === templateId)
    if (template && template.id !== "custom") {
      // Auto-populate some fields based on template
      if (!formData.name) {
        handleInputChange("name", template.name)
      }
    }
  }

  const addMember = (member: TeamMember) => {
    if (!selectedMembers.find(m => m.id === member.id)) {
      setSelectedMembers([...selectedMembers, member])
    }
  }

  const removeMember = (memberId: string) => {
    setSelectedMembers(selectedMembers.filter(m => m.id !== memberId))
  }

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleSave = () => {
    // Here you would normally send the data to your API
    console.log("Project data:", {
      ...formData,
      template: selectedTemplate,
      members: selectedMembers,
      projectManager,
      startDate,
      endDate,
      tags,
      isUrgent,
      isPublic,
      enableNotifications
    })
    
    // Redirect to projects list or project details
    router.push("/dashboard/projects")
  }

  const selectedTemplate_obj = projectTemplates.find(t => t.id === selectedTemplate)

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Novo Projeto</h1>
          <p className="text-muted-foreground">
            Crie um novo projeto e configure sua equipe
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Template */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Template do Projeto
              </CardTitle>
              <CardDescription>
                Escolha um template para acelerar a criação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                {projectTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={cn(
                      "relative cursor-pointer rounded-lg border p-4 hover:bg-accent",
                      selectedTemplate === template.id && "border-primary bg-accent"
                    )}
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={cn(
                        "h-4 w-4 rounded-full border-2",
                        selectedTemplate === template.id 
                          ? "border-primary bg-primary" 
                          : "border-muted-foreground"
                      )}>
                        {selectedTemplate === template.id && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{template.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {template.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Duração estimada: {template.estimatedDuration}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="project-name">Nome do Projeto *</Label>
                  <Input
                    id="project-name"
                    placeholder="Ex: Website da Empresa"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client">Cliente</Label>
                  <Input
                    id="client"
                    placeholder="Nome do cliente ou empresa"
                    value={formData.client}
                    onChange={(e) => handleInputChange("client", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva os objetivos e escopo do projeto..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Prioridade</Label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
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
                    <Input
                      id="budget"
                      placeholder="0,00"
                      className="pl-9"
                      value={formData.budget}
                      onChange={(e) => handleInputChange("budget", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Project Manager</Label>
                  <Select value={projectManager} onValueChange={setProjectManager}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Cronograma
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Data de Início</Label>
                  <Popover open={showStartCalendar} onOpenChange={setShowStartCalendar}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP", { locale: ptBR }) : "Selecionar data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Data de Entrega</Label>
                  <Popover open={showEndCalendar} onOpenChange={setShowEndCalendar}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP", { locale: ptBR }) : "Selecionar data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        disabled={(date) => !startDate || date < startDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Equipe do Projeto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Membros da Equipe</Label>
                <Popover open={showMembersPopover} onOpenChange={setShowMembersPopover}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      <span>Adicionar membros</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Buscar membros..." />
                      <CommandList>
                        <CommandEmpty>Nenhum membro encontrado.</CommandEmpty>
                        <CommandGroup>
                          {teamMembers.map((member) => (
                            <CommandItem
                              key={member.id}
                              onSelect={() => {
                                addMember(member)
                                setShowMembersPopover(false)
                              }}
                              disabled={selectedMembers.some(m => m.id === member.id)}
                            >
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={member.avatar} alt={member.name} />
                                  <AvatarFallback>
                                    {member.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{member.name}</div>
                                  <div className="text-sm text-muted-foreground">{member.role}</div>
                                </div>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {selectedMembers.length > 0 && (
                <div className="space-y-2">
                  <Label>Membros Selecionados</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-2"
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{member.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => removeMember(member.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>
                Organize seu projeto com tags
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Nova tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addTag()}
                />
                <Button onClick={addTag} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0"
                        onClick={() => removeTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Projeto Urgente</Label>
                  <p className="text-sm text-muted-foreground">
                    Marcar como alta prioridade
                  </p>
                </div>
                <Switch
                  checked={isUrgent}
                  onCheckedChange={setIsUrgent}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Projeto Público</Label>
                  <p className="text-sm text-muted-foreground">
                    Visível para toda equipe
                  </p>
                </div>
                <Switch
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificações</Label>
                  <p className="text-sm text-muted-foreground">
                    Receber atualizações
                  </p>
                </div>
                <Switch
                  checked={enableNotifications}
                  onCheckedChange={setEnableNotifications}
                />
              </div>
            </CardContent>
          </Card>

          {/* Template Info */}
          {selectedTemplate_obj && selectedTemplate_obj.defaultTasks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Tarefas do Template</CardTitle>
                <CardDescription>
                  Tarefas que serão criadas automaticamente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {selectedTemplate_obj.defaultTasks.map((task, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Target className="h-3 w-3 text-muted-foreground" />
                      {task}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="space-y-2">
            <Button onClick={handleSave} className="w-full">
              <Save className="mr-2 h-4 w-4" />
              Criar Projeto
            </Button>
            <Button variant="outline" className="w-full" onClick={() => router.back()}>
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
