"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Bell,
  Mail,
  MessageSquare,
  Calendar,
  Users,
  CheckCircle,
  AlertTriangle,
  Info,
  Smartphone,
  Monitor,
  Volume2,
  VolumeX,
  Clock,
  Settings,
  Save,
  RotateCcw
} from "lucide-react"
import { PageHeader } from "@/components/layout/PageHeader"
import { PageContainer } from "@/components/layout/page-container"

// Configurações de notificação
const notificationSettings = {
  email: {
    enabled: true,
    frequency: "immediate", // immediate, daily, weekly
    categories: {
      projectUpdates: true,
      taskAssignments: true,
      teamMessages: true,
      deadlineReminders: true,
      systemAlerts: true,
      weeklyReports: true,
      marketingEmails: false,
      securityAlerts: true
    }
  },
  push: {
    enabled: true,
    devices: ["desktop", "mobile"],
    categories: {
      urgentTasks: true,
      mentions: true,
      directMessages: true,
      meetingReminders: true,
      systemMaintenance: true,
      teamUpdates: false
    }
  },
  inApp: {
    enabled: true,
    sound: true,
    badge: true,
    categories: {
      allNotifications: true,
      onlyImportant: false,
      onlyMentions: false
    }
  },
  schedule: {
    enabled: true,
    quietHours: {
      start: "22:00",
      end: "08:00",
      weekends: true
    },
    workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday"]
  }
}

const notificationTypes = [
  {
    id: "project-updates",
    title: "Atualizações de Projetos",
    description: "Novos comentários, alterações de status e marcos",
    icon: CheckCircle,
    category: "projects",
    frequency: "immediate",
    channels: ["email", "push", "inApp"]
  },
  {
    id: "task-assignments",
    title: "Atribuições de Tarefas",
    description: "Quando você recebe novas tarefas ou há mudanças",
    icon: AlertTriangle,
    category: "tasks",
    frequency: "immediate",
    channels: ["email", "push", "inApp"]
  },
  {
    id: "team-messages",
    title: "Mensagens da Equipe",
    description: "Mensagens diretas e menções em grupos",
    icon: MessageSquare,
    category: "communication",
    frequency: "immediate",
    channels: ["push", "inApp"]
  },
  {
    id: "deadline-reminders",
    title: "Lembretes de Prazos",
    description: "Avisos antes do vencimento de tarefas e projetos",
    icon: Clock,
    category: "reminders",
    frequency: "daily",
    channels: ["email", "push"]
  },
  {
    id: "system-alerts",
    title: "Alertas do Sistema",
    description: "Manutenções, atualizações e problemas técnicos",
    icon: Settings,
    category: "system",
    frequency: "immediate",
    channels: ["email", "inApp"]
  },
  {
    id: "weekly-reports",
    title: "Relatórios Semanais",
    description: "Resumo semanal de atividades e progresso",
    icon: Calendar,
    category: "reports",
    frequency: "weekly",
    channels: ["email"]
  },
  {
    id: "meeting-reminders",
    title: "Lembretes de Reuniões",
    description: "Avisos antes de reuniões agendadas",
    icon: Users,
    category: "calendar",
    frequency: "immediate",
    channels: ["push", "inApp"]
  }
]

const devices = [
  {
    id: "desktop-chrome",
    name: "Chrome - Desktop",
    type: "desktop",
    browser: "Chrome",
    os: "Windows 11",
    lastActive: "2024-12-10T14:30:00Z",
    status: "active"
  },
  {
    id: "mobile-app",
    name: "App Mobile",
    type: "mobile",
    device: "iPhone 14",
    os: "iOS 17.2",
    lastActive: "2024-12-10T13:45:00Z",
    status: "active"
  },
  {
    id: "desktop-firefox",
    name: "Firefox - Desktop",
    type: "desktop",
    browser: "Firefox",
    os: "Ubuntu 22.04",
    lastActive: "2024-12-09T16:20:00Z",
    status: "inactive"
  }
]

export default function NotificationsSettingsPage() {
  const [settings, setSettings] = useState(notificationSettings)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isSaving, setIsSaving] = useState(false)
  const [testNotificationSent, setTestNotificationSent] = useState(false)

  const handleSaveSettings = async () => {
    setIsSaving(true)
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSaving(false)
    console.log("Configurações de notificação salvas:", settings)
  }

  const handleResetToDefaults = () => {
    setSettings(notificationSettings)
    console.log("Configurações resetadas para padrão")
  }

  const handleTestNotification = async () => {
    setTestNotificationSent(true)
    // Simular envio de notificação de teste
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log("Notificação de teste enviada")
    setTimeout(() => setTestNotificationSent(false), 3000)
  }

  const toggleEmailCategory = (category: string) => {
    setSettings(prev => ({
      ...prev,
      email: {
        ...prev.email,
        categories: {
          ...prev.email.categories,
          [category]: !prev.email.categories[category as keyof typeof prev.email.categories]
        }
      }
    }))
  }

  const togglePushCategory = (category: string) => {
    setSettings(prev => ({
      ...prev,
      push: {
        ...prev.push,
        categories: {
          ...prev.push.categories,
          [category]: !prev.push.categories[category as keyof typeof prev.push.categories]
        }
      }
    }))
  }

  const filteredNotifications = selectedCategory === "all" 
    ? notificationTypes 
    : notificationTypes.filter(n => n.category === selectedCategory)

  const formatLastActive = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR')
  }

  const getDeviceIcon = (type: string) => {
    return type === "mobile" ? Smartphone : Monitor
  }

  return (
    <PageContainer>
      <PageHeader
        title="Configurações de Notificações"
        description="Gerencie como e quando você recebe notificações"
        actions={[
          {
            label: "Testar Notificação",
            icon: Bell,
            onClick: handleTestNotification,
            disabled: testNotificationSent
          }
        ]}
        badge={testNotificationSent ? {
          label: "Teste enviado!",
          variant: "default"
        } : undefined}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configurações Principais */}
        <div className="lg:col-span-2 space-y-6">
          {/* Configurações Gerais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Configurações Gerais
              </CardTitle>
              <CardDescription>
                Configure os tipos de notificação que você deseja receber
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Canais de Notificação */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Canais de Notificação</Label>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Email */}
                  <div className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <Label>Email</Label>
                      </div>
                      <Switch
                        checked={settings.email.enabled}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          email: { ...prev.email, enabled: checked }
                        }))}
                      />
                    </div>
                    
                    {settings.email.enabled && (
                      <div className="space-y-2">
                        <Label className="text-sm">Frequência</Label>
                        <Select
                          value={settings.email.frequency}
                          onValueChange={(value) => setSettings(prev => ({
                            ...prev,
                            email: { ...prev.email, frequency: value }
                          }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="immediate">Imediato</SelectItem>
                            <SelectItem value="daily">Diário</SelectItem>
                            <SelectItem value="weekly">Semanal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  {/* Push */}
                  <div className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Smartphone className="h-4 w-4" />
                        <Label>Push</Label>
                      </div>
                      <Switch
                        checked={settings.push.enabled}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          push: { ...prev.push, enabled: checked }
                        }))}
                      />
                    </div>
                    
                    {settings.push.enabled && (
                      <div className="text-sm text-muted-foreground">
                        {settings.push.devices.length} dispositivos ativos
                      </div>
                    )}
                  </div>

                  {/* In-App */}
                  <div className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Monitor className="h-4 w-4" />
                        <Label>No App</Label>
                      </div>
                      <Switch
                        checked={settings.inApp.enabled}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          inApp: { ...prev.inApp, enabled: checked }
                        }))}
                      />
                    </div>
                    
                    {settings.inApp.enabled && (
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          {settings.inApp.sound ? (
                            <Volume2 className="h-3 w-3 text-green-600" />
                          ) : (
                            <VolumeX className="h-3 w-3 text-muted-foreground" />
                          )}
                          <Label className="text-xs">Som</Label>
                          <Switch
                            checked={settings.inApp.sound}
                            onCheckedChange={(checked) => setSettings(prev => ({
                              ...prev,
                              inApp: { ...prev.inApp, sound: checked }
                            }))}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Horário de Trabalho */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Horário Silencioso</Label>
                    <p className="text-sm text-muted-foreground">
                      Não receber notificações durante determinados horários
                    </p>
                  </div>
                  <Switch
                    checked={settings.schedule.enabled}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      schedule: { ...prev.schedule, enabled: checked }
                    }))}
                  />
                </div>

                {settings.schedule.enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                    <div className="space-y-2">
                      <Label>Início</Label>
                      <Select
                        value={settings.schedule.quietHours.start}
                        onValueChange={(value) => setSettings(prev => ({
                          ...prev,
                          schedule: {
                            ...prev.schedule,
                            quietHours: { ...prev.schedule.quietHours, start: value }
                          }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => {
                            const hour = i.toString().padStart(2, '0')
                            return (
                              <SelectItem key={hour} value={`${hour}:00`}>
                                {hour}:00
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Fim</Label>
                      <Select
                        value={settings.schedule.quietHours.end}
                        onValueChange={(value) => setSettings(prev => ({
                          ...prev,
                          schedule: {
                            ...prev.schedule,
                            quietHours: { ...prev.schedule.quietHours, end: value }
                          }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => {
                            const hour = i.toString().padStart(2, '0')
                            return (
                              <SelectItem key={hour} value={`${hour}:00`}>
                                {hour}:00
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="md:col-span-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={settings.schedule.quietHours.weekends}
                          onCheckedChange={(checked) => setSettings(prev => ({
                            ...prev,
                            schedule: {
                              ...prev.schedule,
                              quietHours: { ...prev.schedule.quietHours, weekends: checked }
                            }
                          }))}
                        />
                        <Label>Aplicar também aos fins de semana</Label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tipos de Notificação */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Tipos de Notificação
              </CardTitle>
              <CardDescription>
                Configure notificações específicas por categoria
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filtro por Categoria */}
              <div className="flex items-center space-x-2">
                <Label>Filtrar por:</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    <SelectItem value="projects">Projetos</SelectItem>
                    <SelectItem value="tasks">Tarefas</SelectItem>
                    <SelectItem value="communication">Comunicação</SelectItem>
                    <SelectItem value="calendar">Calendário</SelectItem>
                    <SelectItem value="system">Sistema</SelectItem>
                    <SelectItem value="reports">Relatórios</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Lista de Notificações */}
              <div className="space-y-3">
                {filteredNotifications.map((notification) => {
                  const Icon = notification.icon
                  return (
                    <div key={notification.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <Icon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                          <div className="space-y-1 flex-1">
                            <h4 className="font-medium">{notification.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {notification.description}
                            </p>
                            <div className="flex items-center space-x-4 text-xs">
                              <Badge variant="outline">{notification.frequency}</Badge>
                              <div className="flex items-center space-x-1">
                                {notification.channels.map((channel) => (
                                  <Badge key={channel} variant="secondary" className="text-xs">
                                    {channel}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          {notification.channels.includes("email") && (
                            <Switch
                              checked={settings.email.categories[notification.id.replace("-", "") as keyof typeof settings.email.categories] || false}
                              onCheckedChange={() => toggleEmailCategory(notification.id.replace("-", ""))}
                              disabled={!settings.email.enabled}
                            />
                          )}
                          {notification.channels.includes("push") && (
                            <Switch
                              checked={settings.push.categories[notification.id.replace("-", "") as keyof typeof settings.push.categories] || false}
                              onCheckedChange={() => togglePushCategory(notification.id.replace("-", ""))}
                              disabled={!settings.push.enabled}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="flex space-x-2">
            <Button onClick={handleSaveSettings} disabled={isSaving}>
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Configurações
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleResetToDefaults}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Restaurar Padrões
            </Button>
          </div>
        </div>

        {/* Sidebar - Dispositivos e Resumo */}
        <div className="space-y-6">
          {/* Dispositivos Conectados */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Smartphone className="h-5 w-5 mr-2" />
                Dispositivos
              </CardTitle>
              <CardDescription>
                Dispositivos que podem receber notificações push
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {devices.map((device) => {
                const Icon = getDeviceIcon(device.type)
                return (
                  <div key={device.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Icon className="h-4 w-4" />
                        <span className="font-medium text-sm">{device.name}</span>
                      </div>
                      <Badge variant={device.status === "active" ? "default" : "secondary"}>
                        {device.status === "active" ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>{device.type === "mobile" ? device.device : `${device.browser} - ${device.os}`}</p>
                      <p>Último acesso: {formatLastActive(device.lastActive)}</p>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Resumo de Configurações */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Info className="h-5 w-5 mr-2" />
                Resumo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Email:</span>
                  <Badge variant={settings.email.enabled ? "default" : "secondary"}>
                    {settings.email.enabled ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Push:</span>
                  <Badge variant={settings.push.enabled ? "default" : "secondary"}>
                    {settings.push.enabled ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">No App:</span>
                  <Badge variant={settings.inApp.enabled ? "default" : "secondary"}>
                    {settings.inApp.enabled ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Horário Silencioso:</span>
                  <Badge variant={settings.schedule.enabled ? "default" : "secondary"}>
                    {settings.schedule.enabled ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-1">
                <p className="text-sm font-medium">Categorias Ativas:</p>
                <div className="text-xs text-muted-foreground">
                  <p>Email: {Object.values(settings.email.categories).filter(Boolean).length}/8</p>
                  <p>Push: {Object.values(settings.push.categories).filter(Boolean).length}/6</p>
                </div>
              </div>

              {settings.schedule.enabled && (
                <>
                  <Separator />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Horário Silencioso:</p>
                    <p className="text-xs text-muted-foreground">
                      {settings.schedule.quietHours.start} às {settings.schedule.quietHours.end}
                      {settings.schedule.quietHours.weekends && " (incluindo fins de semana)"}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Teste de Notificação */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Teste</CardTitle>
              <CardDescription>
                Envie uma notificação de teste para verificar as configurações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleTestNotification}
                disabled={testNotificationSent}
              >
                {testNotificationSent ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                    Teste Enviado!
                  </>
                ) : (
                  <>
                    <Bell className="h-4 w-4 mr-2" />
                    Enviar Teste
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}
