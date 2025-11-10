"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  Bell,
  Shield,
  Palette,
  Globe,
  Calendar,
  Users,
  Settings
} from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { PageContainer } from "@/components/layout/page-container"

// Dados do usuário
const userData = {
  name: "João Silva",
  email: "joao.silva@empresa.com",
  phone: "+55 11 99999-8888",
  role: "Product Manager",
  department: "Produto",
  location: "São Paulo, SP",
  bio: "Product Manager com 8 anos de experiência em produtos digitais. Apaixonado por tecnologia e inovação.",
  avatar: "/avatars/joao.jpg",
  joinDate: "2022-03-15",
  lastLogin: "2024-09-21T10:30:00Z",
  status: "active"
}

const settingsCategories = [
  {
    id: "profile",
    title: "Perfil",
    description: "Informações pessoais e profissionais",
    icon: User,
    active: true
  },
  {
    id: "notifications",
    title: "Notificações",
    description: "Configure suas preferências de notificação",
    icon: Bell,
    active: false
  },
  {
    id: "privacy",
    title: "Privacidade",
    description: "Controle de privacidade e segurança",
    icon: Shield,
    active: false
  },
  {
    id: "appearance",
    title: "Aparência",
    description: "Tema e personalização da interface",
    icon: Palette,
    active: false
  },
  {
    id: "language",
    title: "Idioma e Região",
    description: "Configurações de localização",
    icon: Globe,
    active: false
  }
]

export default function SettingsProfilePage() {
  const [activeCategory, setActiveCategory] = useState("profile")
  const [formData, setFormData] = useState(userData)
  const [hasChanges, setHasChanges] = useState(false)

  // Configurações de notificação
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    projectUpdates: true,
    taskAssignments: true,
    deadlineReminders: true,
    teamMentions: true,
    weeklyReports: false,
    marketingEmails: false
  })

  // Configurações de privacidade
  const [privacy, setPrivacy] = useState({
    profileVisibility: "team",
    showEmail: false,
    showPhone: false,
    showLastSeen: true,
    allowDirectMessages: true,
    showOnlineStatus: true
  })

  // Configurações de aparência
  const [appearance, setAppearance] = useState({
    theme: "system",
    compactMode: false,
    animations: true,
    fontSize: "medium"
  })

  // Configurações de idioma
  const [language, setLanguage] = useState({
    language: "pt-BR",
    timezone: "America/Sao_Paulo",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h"
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const handleSave = () => {
    console.log("Salvando configurações:", {
      profile: formData,
      notifications,
      privacy,
      appearance,
      language
    })
    setHasChanges(false)
  }

  const renderProfileSettings = () => (
    <div className="space-y-6">
      {/* Avatar e Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
          <CardDescription>
            Atualize suas informações pessoais e profissionais
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={formData.avatar} />
              <AvatarFallback className="text-lg">
                {formData.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm">
                <Camera className="h-3 w-3 mr-1" />
                Alterar Foto
              </Button>
              <p className="text-xs text-muted-foreground mt-1">
                JPG, PNG ou GIF. Máximo 2MB.
              </p>
            </div>
          </div>

          {/* Informações Pessoais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Localização</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Cargo</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => handleInputChange("role", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Departamento</Label>
              <Select 
                value={formData.department} 
                onValueChange={(value) => handleInputChange("department", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Produto">Produto</SelectItem>
                  <SelectItem value="Desenvolvimento">Desenvolvimento</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Vendas">Vendas</SelectItem>
                  <SelectItem value="RH">Recursos Humanos</SelectItem>
                  <SelectItem value="Financeiro">Financeiro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Biografia</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              rows={4}
              placeholder="Conte um pouco sobre você..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Informações da Conta */}
      <Card>
        <CardHeader>
          <CardTitle>Informações da Conta</CardTitle>
          <CardDescription>
            Detalhes sobre sua conta e atividade
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-sm text-muted-foreground">Membro desde</Label>
              <p className="font-medium">
                {new Date(formData.joinDate).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Último acesso</Label>
              <p className="font-medium">
                {new Date(formData.lastLogin).toLocaleString('pt-BR')}
              </p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Status da conta</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="secondary">
                  {formData.status === "active" ? "Ativa" : "Inativa"}
                </Badge>
              </div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">ID do usuário</Label>
              <p className="font-mono text-sm">#USR-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderNotificationSettings = () => (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de Notificação</CardTitle>
        <CardDescription>
          Escolha como e quando receber notificações
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Canais de Notificação */}
        <div>
          <h4 className="font-medium mb-4">Canais de Notificação</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Notificações por Email</Label>
                <p className="text-sm text-muted-foreground">
                  Receba atualizações importantes por email
                </p>
              </div>
              <Switch
                checked={notifications.emailNotifications}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, emailNotifications: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Notificações Push</Label>
                <p className="text-sm text-muted-foreground">
                  Receba notificações push no navegador
                </p>
              </div>
              <Switch
                checked={notifications.pushNotifications}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, pushNotifications: checked }))
                }
              />
            </div>
          </div>
        </div>

        {/* Tipos de Notificação */}
        <div>
          <h4 className="font-medium mb-4">Tipos de Notificação</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Atualizações de Projeto</Label>
                <p className="text-sm text-muted-foreground">
                  Quando houver mudanças em projetos que você segue
                </p>
              </div>
              <Switch
                checked={notifications.projectUpdates}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, projectUpdates: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Atribuição de Tarefas</Label>
                <p className="text-sm text-muted-foreground">
                  Quando uma tarefa for atribuída a você
                </p>
              </div>
              <Switch
                checked={notifications.taskAssignments}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, taskAssignments: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Lembretes de Prazo</Label>
                <p className="text-sm text-muted-foreground">
                  Lembretes antes dos prazos vencerem
                </p>
              </div>
              <Switch
                checked={notifications.deadlineReminders}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, deadlineReminders: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Menções da Equipe</Label>
                <p className="text-sm text-muted-foreground">
                  Quando alguém mencionar você
                </p>
              </div>
              <Switch
                checked={notifications.teamMentions}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, teamMentions: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Relatórios Semanais</Label>
                <p className="text-sm text-muted-foreground">
                  Resumo semanal de atividades
                </p>
              </div>
              <Switch
                checked={notifications.weeklyReports}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, weeklyReports: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Emails de Marketing</Label>
                <p className="text-sm text-muted-foreground">
                  Novidades, dicas e atualizações da plataforma
                </p>
              </div>
              <Switch
                checked={notifications.marketingEmails}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, marketingEmails: checked }))
                }
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderCurrentSettings = () => {
    switch (activeCategory) {
      case "profile":
        return renderProfileSettings()
      case "notifications":
        return renderNotificationSettings()
      case "privacy":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Privacidade</CardTitle>
              <CardDescription>
                Controle quem pode ver suas informações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Configurações de privacidade em desenvolvimento...
              </p>
            </CardContent>
          </Card>
        )
      case "appearance":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Aparência</CardTitle>
              <CardDescription>
                Personalize a aparência da interface
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Configurações de aparência em desenvolvimento...
              </p>
            </CardContent>
          </Card>
        )
      case "language":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Idioma e Região</CardTitle>
              <CardDescription>
                Configure idioma, fuso horário e formatos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Configurações de idioma em desenvolvimento...
              </p>
            </CardContent>
          </Card>
        )
      default:
        return renderProfileSettings()
    }
  }

  return (
    <PageContainer>
      <PageHeader
        title="Configurações"
        description="Gerencie suas preferências e configurações da conta"
        actions={hasChanges ? [
          {
            label: "Salvar Alterações",
            icon: Save,
            onClick: handleSave
          }
        ] : []}
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Menu Lateral */}
        <div className="lg:w-64">
          <Card>
            <CardContent className="p-2">
              <nav className="space-y-1">
                {settingsCategories.map((category) => {
                  const IconComponent = category.icon
                  return (
                    <Button
                      key={category.id}
                      variant={activeCategory === category.id ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveCategory(category.id)}
                    >
                      <IconComponent className="h-4 w-4 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">{category.title}</div>
                        <div className="text-xs text-muted-foreground hidden lg:block">
                          {category.description}
                        </div>
                      </div>
                    </Button>
                  )
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Conteúdo Principal */}
        <div className="flex-1">
          {renderCurrentSettings()}
        </div>
      </div>
    </PageContainer>
  )
}
