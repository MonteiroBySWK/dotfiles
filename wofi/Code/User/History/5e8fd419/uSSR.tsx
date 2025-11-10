"use client"

import * as React from "react"
import { 
  Bell, 
  X, 
  Check, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  XCircle,
  Clock,
  User,
  Settings,
  Mail,
  Calendar,
  DollarSign,
  FileText,
  Users,
  Shield,
  Activity,
  TrendingUp,
  MessageSquare,
  Filter,
  Archive,
  Trash2,
  MoreHorizontal,
  Volume2,
  VolumeX,
  Smartphone,
  Monitor,
  Globe
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/custom/feedback"
import { LoadingOverlay } from "@/components/custom/loading"

interface Notification {
  id: string
  type: "info" | "success" | "warning" | "error" | "message" | "system"
  title: string
  message: string
  timestamp: string
  read: boolean
  archived: boolean
  category: string
  priority: "low" | "medium" | "high" | "urgent"
  sender?: {
    name: string
    avatar?: string
    role?: string
  }
  actions?: {
    label: string
    action: string
    variant?: "default" | "destructive" | "outline"
  }[]
  metadata?: Record<string, any>
}

interface NotificationSettings {
  email: boolean
  push: boolean
  desktop: boolean
  sound: boolean
  categories: Record<string, boolean>
  quietHours: {
    enabled: boolean
    start: string
    end: string
  }
  frequency: "instant" | "hourly" | "daily"
}

const NotificationsPage: React.FC = () => {
  const { addNotification } = useToast()
  const [isLoading, setIsLoading] = React.useState(false)
  const [filterType, setFilterType] = React.useState<string>("all")
  const [filterRead, setFilterRead] = React.useState<string>("all")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedNotifications, setSelectedNotifications] = React.useState<string[]>([])

  const [notifications, setNotifications] = React.useState<Notification[]>([
    {
      id: "1",
      type: "success",
      title: "Projeto Concluído",
      message: "O projeto 'Website Redesign' foi concluído com sucesso!",
      timestamp: "2024-01-22T14:30:00Z",
      read: false,
      archived: false,
      category: "projects",
      priority: "high",
      sender: {
        name: "Ana Silva",
        avatar: "/avatars/ana.jpg",
        role: "Project Manager"
      },
      actions: [
        { label: "Ver Projeto", action: "view-project", variant: "default" },
        { label: "Baixar Relatório", action: "download-report", variant: "outline" }
      ]
    },
    {
      id: "2",
      type: "warning",
      title: "Prazo se Aproximando",
      message: "O projeto 'Mobile App' tem prazo em 3 dias. Revise o progresso.",
      timestamp: "2024-01-22T13:15:00Z",
      read: false,
      archived: false,
      category: "deadlines",
      priority: "urgent",
      sender: {
        name: "Sistema",
        role: "Automático"
      },
      actions: [
        { label: "Ver Cronograma", action: "view-timeline", variant: "default" }
      ]
    },
    {
      id: "3",
      type: "message",
      title: "Nova Mensagem",
      message: "Carlos Santos enviou uma mensagem sobre o orçamento do Q1.",
      timestamp: "2024-01-22T12:45:00Z",
      read: true,
      archived: false,
      category: "messages",
      priority: "medium",
      sender: {
        name: "Carlos Santos",
        avatar: "/avatars/carlos.jpg",
        role: "Financial Manager"
      },
      actions: [
        { label: "Responder", action: "reply", variant: "default" },
        { label: "Ver Conversa", action: "view-chat", variant: "outline" }
      ]
    },
    {
      id: "4",
      type: "info",
      title: "Atualização do Sistema",
      message: "Nova versão disponível com melhorias de performance e segurança.",
      timestamp: "2024-01-22T10:00:00Z",
      read: true,
      archived: false,
      category: "system",
      priority: "low",
      sender: {
        name: "Sistema",
        role: "Automático"
      },
      actions: [
        { label: "Ver Detalhes", action: "view-updates", variant: "outline" }
      ]
    },
    {
      id: "5",
      type: "error",
      title: "Falha no Backup",
      message: "O backup automático de hoje falhou. Verifique as configurações.",
      timestamp: "2024-01-22T08:30:00Z",
      read: false,
      archived: false,
      category: "system",
      priority: "urgent",
      sender: {
        name: "Sistema",
        role: "Automático"
      },
      actions: [
        { label: "Executar Backup", action: "run-backup", variant: "default" },
        { label: "Ver Logs", action: "view-logs", variant: "outline" }
      ]
    }
  ])

  const [settings, setSettings] = React.useState<NotificationSettings>({
    email: true,
    push: true,
    desktop: false,
    sound: true,
    categories: {
      projects: true,
      messages: true,
      system: true,
      deadlines: true,
      financial: true,
      team: true
    },
    quietHours: {
      enabled: false,
      start: "22:00",
      end: "08:00"
    },
    frequency: "instant"
  })

  const categories = [
    { id: "projects", name: "Projetos", icon: FileText },
    { id: "messages", name: "Mensagens", icon: MessageSquare },
    { id: "system", name: "Sistema", icon: Settings },
    { id: "deadlines", name: "Prazos", icon: Clock },
    { id: "financial", name: "Financeiro", icon: DollarSign },
    { id: "team", name: "Equipe", icon: Users }
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "message":
        return <MessageSquare className="h-4 w-4 text-blue-500" />
      case "system":
        return <Settings className="h-4 w-4 text-gray-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "low":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Agora"
    if (diffMins < 60) return `${diffMins}m atrás`
    if (diffHours < 24) return `${diffHours}h atrás`
    if (diffDays < 7) return `${diffDays}d atrás`
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ))
  }

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    addNotification({
      type: "success",
      message: "Todas as notificações foram marcadas como lidas."
    })
  }

  const handleArchive = (notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, archived: true } : n
    ))
    addNotification({
      type: "success",
      message: "Notificação arquivada."
    })
  }

  const handleDelete = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId))
    addNotification({
      type: "success",
      message: "Notificação excluída."
    })
  }

  const handleBulkAction = async (action: string) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      switch (action) {
        case "mark-read":
          setNotifications(prev => prev.map(n => 
            selectedNotifications.includes(n.id) ? { ...n, read: true } : n
          ))
          break
        case "archive":
          setNotifications(prev => prev.map(n => 
            selectedNotifications.includes(n.id) ? { ...n, archived: true } : n
          ))
          break
        case "delete":
          setNotifications(prev => prev.filter(n => !selectedNotifications.includes(n.id)))
          break
      }
      
      setSelectedNotifications([])
      addNotification({
        type: "success",
        message: `${selectedNotifications.length} notificações processadas.`
      })
    } catch (error) {
      addNotification({
        type: "error",
        title: "Erro na operação",
        message: "Não foi possível processar as notificações."
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      addNotification({
        type: "success",
        title: "Configurações salvas!",
        message: "Suas preferências de notificação foram atualizadas."
      })
    } catch (error) {
      addNotification({
        type: "error",
        title: "Erro ao salvar",
        message: "Não foi possível salvar as configurações."
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    const matchesType = filterType === "all" || notification.type === filterType
    const matchesRead = filterRead === "all" || 
      (filterRead === "unread" && !notification.read) ||
      (filterRead === "read" && notification.read)
    const matchesSearch = !searchQuery || 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase())
    const notArchived = !notification.archived

    return matchesType && matchesRead && matchesSearch && notArchived
  })

  const unreadCount = notifications.filter(n => !n.read && !n.archived).length

  const renderNotificationsList = () => (
    <div className="space-y-4">
      {/* Filtros e Ações */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="success">Sucesso</SelectItem>
              <SelectItem value="warning">Avisos</SelectItem>
              <SelectItem value="error">Erros</SelectItem>
              <SelectItem value="message">Mensagens</SelectItem>
              <SelectItem value="system">Sistema</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterRead} onValueChange={setFilterRead}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="unread">Não lidas</SelectItem>
              <SelectItem value="read">Lidas</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Buscar notificações..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
        </div>

        <div className="flex items-center space-x-2">
          {selectedNotifications.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Ações ({selectedNotifications.length})
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleBulkAction("mark-read")}>
                  <Check className="h-4 w-4 mr-2" />
                  Marcar como Lidas
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction("archive")}>
                  <Archive className="h-4 w-4 mr-2" />
                  Arquivar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => handleBulkAction("delete")}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button variant="outline" onClick={handleMarkAllAsRead}>
            <Check className="h-4 w-4 mr-2" />
            Marcar Todas como Lidas
          </Button>
        </div>
      </div>

      {/* Lista de Notificações */}
      <div className="space-y-2">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchQuery ? "Nenhuma notificação encontrada" : "Nenhuma notificação"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`cursor-pointer transition-colors ${
                !notification.read ? "bg-blue-50 border-blue-200" : ""
              } ${
                selectedNotifications.includes(notification.id) ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => {
                if (!notification.read) {
                  handleMarkAsRead(notification.id)
                }
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  {/* Checkbox para seleção */}
                  <input
                    type="checkbox"
                    checked={selectedNotifications.includes(notification.id)}
                    onChange={(e) => {
                      e.stopPropagation()
                      if (e.target.checked) {
                        setSelectedNotifications(prev => [...prev, notification.id])
                      } else {
                        setSelectedNotifications(prev => prev.filter(id => id !== notification.id))
                      }
                    }}
                    className="mt-1"
                  />

                  {/* Ícone do tipo */}
                  <div className="mt-0.5">
                    {getTypeIcon(notification.type)}
                  </div>

                  {/* Conteúdo */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-medium ${!notification.read ? "font-semibold" : ""}`}>
                        {notification.title}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(notification.priority)}>
                          {notification.priority === "urgent" ? "Urgente" :
                           notification.priority === "high" ? "Alto" :
                           notification.priority === "medium" ? "Médio" : "Baixo"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>

                    {notification.sender && (
                      <div className="flex items-center space-x-2 mt-2">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {notification.sender.name}
                          {notification.sender.role && ` • ${notification.sender.role}`}
                        </span>
                      </div>
                    )}

                    {/* Ações */}
                    {notification.actions && notification.actions.length > 0 && (
                      <div className="flex items-center space-x-2 mt-3">
                        {notification.actions.map((action, index) => (
                          <Button
                            key={index}
                            size="sm"
                            variant={action.variant || "outline"}
                            onClick={(e) => {
                              e.stopPropagation()
                              console.log("Action:", action.action)
                            }}
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Menu de ações */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {!notification.read && (
                        <DropdownMenuItem onClick={() => handleMarkAsRead(notification.id)}>
                          <Check className="h-4 w-4 mr-2" />
                          Marcar como Lida
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => handleArchive(notification.id)}>
                        <Archive className="h-4 w-4 mr-2" />
                        Arquivar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDelete(notification.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )

  const renderSettings = () => (
    <div className="space-y-6">
      {/* Métodos de Notificação */}
      <Card>
        <CardHeader>
          <CardTitle>Métodos de Notificação</CardTitle>
          <CardDescription>
            Configure como você quer receber notificações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label>Email</Label>
                <p className="text-sm text-muted-foreground">
                  Receber notificações por email
                </p>
              </div>
            </div>
            <Switch
              checked={settings.email}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, email: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Smartphone className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label>Push</Label>
                <p className="text-sm text-muted-foreground">
                  Notificações push no dispositivo
                </p>
              </div>
            </div>
            <Switch
              checked={settings.push}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, push: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Monitor className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label>Desktop</Label>
                <p className="text-sm text-muted-foreground">
                  Notificações do navegador
                </p>
              </div>
            </div>
            <Switch
              checked={settings.desktop}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, desktop: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Volume2 className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label>Som</Label>
                <p className="text-sm text-muted-foreground">
                  Reproduzir som nas notificações
                </p>
              </div>
            </div>
            <Switch
              checked={settings.sound}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, sound: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Categorias */}
      <Card>
        <CardHeader>
          <CardTitle>Categorias</CardTitle>
          <CardDescription>
            Escolha quais tipos de notificação receber
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <div key={category.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <Label>{category.name}</Label>
                </div>
                <Switch
                  checked={settings.categories[category.id]}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({
                      ...prev,
                      categories: { ...prev.categories, [category.id]: checked }
                    }))
                  }
                />
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Horário Silencioso */}
      <Card>
        <CardHeader>
          <CardTitle>Horário Silencioso</CardTitle>
          <CardDescription>
            Configure quando não receber notificações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Ativar Horário Silencioso</Label>
            <Switch
              checked={settings.quietHours.enabled}
              onCheckedChange={(checked) => 
                setSettings(prev => ({
                  ...prev,
                  quietHours: { ...prev.quietHours, enabled: checked }
                }))
              }
            />
          </div>

          {settings.quietHours.enabled && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Início</Label>
                <Input
                  type="time"
                  value={settings.quietHours.start}
                  onChange={(e) => 
                    setSettings(prev => ({
                      ...prev,
                      quietHours: { ...prev.quietHours, start: e.target.value }
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Fim</Label>
                <Input
                  type="time"
                  value={settings.quietHours.end}
                  onChange={(e) => 
                    setSettings(prev => ({
                      ...prev,
                      quietHours: { ...prev.quietHours, end: e.target.value }
                    }))
                  }
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Frequência */}
      <Card>
        <CardHeader>
          <CardTitle>Frequência</CardTitle>
          <CardDescription>
            Configure com que frequência receber notificações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select 
            value={settings.frequency} 
            onValueChange={(value: any) => setSettings(prev => ({ ...prev, frequency: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="instant">Instantâneo</SelectItem>
              <SelectItem value="hourly">Resumo por Hora</SelectItem>
              <SelectItem value="daily">Resumo Diário</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings}>
          <Settings className="h-4 w-4 mr-2" />
          Salvar Configurações
        </Button>
      </div>
    </div>
  )

  return (
    <LoadingOverlay isLoading={isLoading} message="Processando...">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notificações</h1>
            <p className="text-muted-foreground">
              Gerencie todas as suas notificações e preferências
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">
              {unreadCount} não lidas
            </Badge>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="notifications">
          <TabsList>
            <TabsTrigger value="notifications">
              Notificações
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications">
            {renderNotificationsList()}
          </TabsContent>

          <TabsContent value="settings">
            {renderSettings()}
          </TabsContent>
        </Tabs>
      </div>
    </LoadingOverlay>
  )
}

export default NotificationsPage
