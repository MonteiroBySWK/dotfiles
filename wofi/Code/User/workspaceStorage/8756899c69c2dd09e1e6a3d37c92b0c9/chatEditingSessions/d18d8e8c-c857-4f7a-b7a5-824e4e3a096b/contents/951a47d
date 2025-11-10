"use client"

import { useState, useEffect } from "react"
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
import { toast } from "sonner"
import { LoadingOverlay } from "@/components/custom/loading"
import ProjectForm from "@/components/projects/ProjectForm"

type ProjectTemplate = {
  id: string
  name: string
  description: string
  estimatedDuration: string
  defaultTasks: string[]
}

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
  
  // Firebase stores
  const { createProject, loading: projectLoading } = useProjectStore()
  const { users, loading: usersLoading, fetchUsers } = useUserStore()
  const { user: currentUser } = useAuthStore()
  
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
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
    priority: "medium" as "low" | "medium" | "high"
  })

  const isLoading = projectLoading || usersLoading

  // Load users on component mount
  useEffect(() => {
    fetchUsers().catch((error) => {
      console.error('Error fetching users:', error)
      toast.error("Falha ao carregar usuários")
    })
  }, [fetchUsers])

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

  const addMember = (userId: string) => {
    if (!selectedMembers.includes(userId)) {
      setSelectedMembers([...selectedMembers, userId])
    }
  }

  const removeMember = (userId: string) => {
    setSelectedMembers(selectedMembers.filter(id => id !== userId))
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

  const handleSave = async () => {
    try {
      // Validation
      if (!formData.name.trim()) {
        toast.error("Nome do projeto é obrigatório")
        return
      }

      if (!currentUser) {
        toast.error("Usuário não autenticado")
        return
      }

      // Prepare project data
      const projectData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: 'planning' as const,
        priority: formData.priority,
        progress: 0,
        startDate: startDate || new Date(),
        endDate: endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        managerId: projectManager || currentUser.id,
        teamMembers: selectedMembers.map(memberId => ({
          userId: memberId,
          role: 'developer' as const,
          allocation: 100,
          joinedAt: new Date()
        })),
        budget: {
          estimated: formData.budget ? parseFloat(formData.budget.replace(/[^\d.,]/g, '').replace(',', '.')) : 0,
          actual: 0,
          currency: 'BRL',
          breakdown: {
            development: 0,
            design: 0,
            testing: 0,
            deployment: 0,
            other: 0
          }
        },
        clientId: formData.client.trim(),
        tags: tags,
        category: selectedTemplate !== 'custom' ? selectedTemplate : 'other',
        milestones: [],
        attachments: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }

      // Create project
      const projectId = await createProject(projectData)

      toast.success("Projeto criado com sucesso!")

      // Redirect to project details or projects list
      router.push(`/dashboard/projects`)
      
    } catch (error) {
      console.error('Error creating project:', error)
      toast.error("Falha ao criar projeto. Tente novamente.")
    }
  }

  const selectedTemplate_obj = projectTemplates.find(t => t.id === selectedTemplate)

  if (isLoading) {
    return <LoadingOverlay isLoading={true}><div></div></LoadingOverlay>
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Novo Projeto</h1>
          <p className="text-muted-foreground">Crie um novo projeto e configure sua equipe</p>
        </div>
      </div>

      <ProjectForm mode="create" />
    </div>
  )
}
