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
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { 
  Plus,
  X,
  Calendar as CalendarIcon,
  ArrowLeft,
  Save,
  CheckSquare,
  User,
  Clock,
  Flag,
  Paperclip,
  MessageSquare,
  Target,
  AlertCircle
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

type Project = {
  id: string
  name: string
  status: string
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

const projects: Project[] = [
  { id: "1", name: "Website Redesign", status: "Em Progresso" },
  { id: "2", name: "Mobile App", status: "Planejamento" },
  { id: "3", name: "E-commerce Platform", status: "Em Progresso" },
  { id: "4", name: "Dashboard Analytics", status: "Em Revisão" },
  { id: "5", name: "Sistema de Login", status: "Concluído" }
]

const taskTemplates = [
  {
    id: "development",
    name: "Desenvolvimento",
    description: "Tarefa de programação/desenvolvimento",
    estimatedHours: 8,
    defaultTags: ["dev", "coding"]
  },
  {
    id: "design",
    name: "Design",
    description: "Tarefa de design/criação visual",
    estimatedHours: 4,
    defaultTags: ["design", "ui"]
  },
  {
    id: "testing",
    name: "Testes",
    description: "Testes e validação de qualidade",
    estimatedHours: 2,
    defaultTags: ["qa", "testing"]
  },
  {
    id: "review",
    name: "Revisão",
    description: "Revisão de código ou conteúdo",
    estimatedHours: 1,
    defaultTags: ["review"]
  },
  {
    id: "meeting",
    name: "Reunião",
    description: "Reunião ou apresentação",
    estimatedHours: 1,
    defaultTags: ["meeting"]
  },
  {
    id: "research",
    name: "Pesquisa",
    description: "Pesquisa e análise",
    estimatedHours: 3,
    defaultTags: ["research"]
  }
]

export default function NewTaskPage() {
  const router = useRouter()
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [assignee, setAssignee] = useState<string>("")
  const [project, setProject] = useState<string>("")
  const [dueDate, setDueDate] = useState<Date>()
  const [showCalendar, setShowCalendar] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [estimatedHours, setEstimatedHours] = useState([4])
  const [progress, setProgress] = useState([0])
  const [isUrgent, setIsUrgent] = useState(false)
  const [isBlocked, setIsBlocked] = useState(false)
  const [sendNotification, setSendNotification] = useState(true)
  const [attachments, setAttachments] = useState<string[]>([])
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "todo",
    parentTask: "",
    dependencies: ""
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    const template = taskTemplates.find(t => t.id === templateId)
    if (template) {
      setEstimatedHours([template.estimatedHours])
      setTags([...tags, ...template.defaultTags.filter(tag => !tags.includes(tag))])
      if (!formData.title) {
        handleInputChange("title", template.name)
      }
    }
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
    const taskData = {
      ...formData,
      template: selectedTemplate,
      assignee,
      project,
      dueDate,
      tags,
      estimatedHours: estimatedHours[0],
      progress: progress[0],
      isUrgent,
      isBlocked,
      sendNotification,
      attachments
    }
    
    console.log("Task data:", taskData)
    router.push("/dashboard/tasks")
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low": return "text-green-600 bg-green-50"
      case "medium": return "text-yellow-600 bg-yellow-50"
      case "high": return "text-red-600 bg-red-50"
      default: return "text-blue-600 bg-blue-50"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "low": return "🟢"
      case "medium": return "🟡"
      case "high": return "🔴"
      default: return "⚪"
    }
  }

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
          <h1 className="text-3xl font-bold tracking-tight">Nova Tarefa</h1>
          <p className="text-muted-foreground">
            Crie uma nova tarefa e atribua responsabilidades
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task Template */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5" />
                Tipo de Tarefa
              </CardTitle>
              <CardDescription>
                Escolha um template para acelerar a criação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {taskTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={cn(
                      "relative cursor-pointer rounded-lg border p-3 hover:bg-accent transition-colors",
                      selectedTemplate === template.id && "border-primary bg-accent"
                    )}
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{template.name}</h4>
                        <div className={cn(
                          "h-3 w-3 rounded-full border-2",
                          selectedTemplate === template.id 
                            ? "border-primary bg-primary" 
                            : "border-muted-foreground"
                        )} />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {template.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {template.estimatedHours}h estimadas
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
              <CardTitle>Informações da Tarefa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="task-title">Título da Tarefa *</Label>
                <Input
                  id="task-title"
                  placeholder="Ex: Implementar sistema de login"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva o que precisa ser feito, requisitos e critérios de aceitação..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Projeto</Label>
                  <Select value={project} onValueChange={setProject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar projeto..." />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((proj) => (
                        <SelectItem key={proj.id} value={proj.id}>
                          {proj.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">A Fazer</SelectItem>
                      <SelectItem value="in-progress">Em Progresso</SelectItem>
                      <SelectItem value="review">Em Revisão</SelectItem>
                      <SelectItem value="done">Concluído</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Prioridade</Label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">
                        <div className="flex items-center gap-2">
                          <span>🟢</span> Baixa
                        </div>
                      </SelectItem>
                      <SelectItem value="medium">
                        <div className="flex items-center gap-2">
                          <span>🟡</span> Média
                        </div>
                      </SelectItem>
                      <SelectItem value="high">
                        <div className="flex items-center gap-2">
                          <span>🔴</span> Alta
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Responsável</Label>
                  <Select value={assignee} onValueChange={setAssignee}>
                    <SelectTrigger>
                      <SelectValue placeholder="Atribuir para..." />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback className="text-xs">
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            {member.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Planning */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Planejamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Data de Entrega</Label>
                  <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDate ? format(dueDate, "PPP", { locale: ptBR }) : "Selecionar data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dueDate}
                        onSelect={setDueDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Tarefa Pai</Label>
                  <Input
                    placeholder="ID ou nome da tarefa pai"
                    value={formData.parentTask}
                    onChange={(e) => handleInputChange("parentTask", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Horas Estimadas: {estimatedHours[0]}h</Label>
                  <Slider
                    value={estimatedHours}
                    onValueChange={setEstimatedHours}
                    max={40}
                    min={0.5}
                    step={0.5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>30min</span>
                    <span>40h</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Progresso Inicial: {progress[0]}%</Label>
                  <Slider
                    value={progress}
                    onValueChange={setProgress}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Dependências</Label>
                <Textarea
                  placeholder="Liste outras tarefas que devem ser concluídas antes desta..."
                  rows={2}
                  value={formData.dependencies}
                  onChange={(e) => handleInputChange("dependencies", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Prioridade:</span>
                <Badge className={getPriorityColor(formData.priority)}>
                  {getPriorityIcon(formData.priority)} {formData.priority === "low" ? "Baixa" : formData.priority === "medium" ? "Média" : "Alta"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Estimativa:</span>
                <span className="text-sm font-medium">{estimatedHours[0]}h</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Progresso:</span>
                <span className="text-sm font-medium">{progress[0]}%</span>
              </div>
              {assignee && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Responsável:</span>
                  <div className="flex items-center gap-1">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={teamMembers.find(m => m.id === assignee)?.avatar} />
                      <AvatarFallback className="text-xs">
                        {teamMembers.find(m => m.id === assignee)?.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">
                      {teamMembers.find(m => m.id === assignee)?.name.split(' ')[0]}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>
                Organize sua tarefa com tags
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
                        className="h-4 w-4 p-0 hover:bg-transparent"
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
                  <Label className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                    Tarefa Urgente
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Precisa atenção imediata
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
                  <Label className="flex items-center gap-2">
                    <Flag className="h-4 w-4 text-red-500" />
                    Tarefa Bloqueada
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Tem impedimentos
                  </p>
                </div>
                <Switch
                  checked={isBlocked}
                  onCheckedChange={setIsBlocked}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-blue-500" />
                    Notificar Equipe
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Enviar notificação
                  </p>
                </div>
                <Switch
                  checked={sendNotification}
                  onCheckedChange={setSendNotification}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-2">
            <Button onClick={handleSave} className="w-full">
              <Save className="mr-2 h-4 w-4" />
              Criar Tarefa
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
