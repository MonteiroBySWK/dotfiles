"use client"

import { useState } from "react"
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  Palette, 
  Globe,
  Save,
  Upload,
  Key,
  Smartphone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Camera,
  Trash2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
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
import { Separator } from "@/components/ui/separator"

// Dados mock do usuário
const userData = {
  name: "Gabriel Monteiro",
  email: "gabriel@empresa.com",
  phone: "+55 11 99999-8888",
  avatar: "/avatars/gabriel.jpg",
  role: "Administrador",
  department: "Tecnologia",
  joinDate: "2023-01-15",
  lastLogin: "2024-01-22T14:30:00Z",
  twoFactorEnabled: true,
  language: "pt-BR",
  timezone: "America/Sao_Paulo",
  theme: "system"
}

const notificationSettings = {
  email: {
    projectUpdates: true,
    taskAssignments: true,
    teamMessages: true,
    systemAlerts: true,
    marketing: false
  },
  push: {
    projectUpdates: true,
    taskAssignments: true,
    teamMessages: false,
    systemAlerts: true
  },
  inApp: {
    projectUpdates: true,
    taskAssignments: true,
    teamMessages: true,
    systemAlerts: true
  }
}

const securityLog = [
  {
    id: 1,
    action: "Login",
    device: "Chrome on Windows",
    location: "São Paulo, SP",
    timestamp: "2024-01-22T14:30:00Z",
    status: "success"
  },
  {
    id: 2,
    action: "Alteração de senha",
    device: "Chrome on Windows",
    location: "São Paulo, SP",
    timestamp: "2024-01-20T10:15:00Z",
    status: "success"
  },
  {
    id: 3,
    action: "Login falhado",
    device: "Safari on iPhone",
    location: "Rio de Janeiro, RJ",
    timestamp: "2024-01-18T08:45:00Z",
    status: "failed"
  }
]

export default function SettingsPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false)

  const handleSaveProfile = () => {
    // Implementar salvamento do perfil
    console.log("Salvando perfil...")
  }

  const handleChangePassword = () => {
    // Implementar alteração de senha
    console.log("Alterando senha...")
  }

  const handleUploadAvatar = () => {
    // Implementar upload de avatar
    console.log("Upload de avatar...")
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('pt-BR')
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie suas preferências e configurações da conta
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="account">Conta</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
        </TabsList>

        {/* Perfil */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Perfil</CardTitle>
              <CardDescription>
                Atualize suas informações pessoais e foto de perfil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={userData.avatar} alt={userData.name} />
                  <AvatarFallback className="text-2xl">
                    {userData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button onClick={handleUploadAvatar}>
                    <Upload className="mr-2 h-4 w-4" />
                    Alterar Foto
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remover
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    JPG, GIF ou PNG. Máximo 1MB.
                  </p>
                </div>
              </div>

              <Separator />

              {/* Informações Básicas */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input id="name" defaultValue={userData.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" defaultValue={userData.email} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" type="tel" defaultValue={userData.phone} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Cargo</Label>
                  <Input id="role" defaultValue={userData.role} disabled />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biografia</Label>
                <Textarea 
                  id="bio" 
                  placeholder="Conte um pouco sobre você..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancelar</Button>
                <Button onClick={handleSaveProfile}>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Alterações
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Informações da Conta */}
          <Card>
            <CardHeader>
              <CardTitle>Informações da Conta</CardTitle>
              <CardDescription>
                Detalhes da sua conta e status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium">Departamento</Label>
                  <p className="text-sm text-muted-foreground">{userData.department}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Data de Ingresso</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(userData.joinDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Último Login</Label>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(userData.lastLogin)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Ativo
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conta */}
        <TabsContent value="account" className="space-y-6">
          {/* Alterar Senha */}
          <Card>
            <CardHeader>
              <CardTitle>Alterar Senha</CardTitle>
              <CardDescription>
                Mantenha sua conta segura com uma senha forte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Senha Atual</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Digite sua senha atual"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">Nova Senha</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Digite a nova senha"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirme a nova senha"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button onClick={handleChangePassword}>
                <Key className="mr-2 h-4 w-4" />
                Alterar Senha
              </Button>
            </CardContent>
          </Card>

          {/* Zona de Perigo */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Zona de Perigo</CardTitle>
              <CardDescription>
                Ações irreversíveis para sua conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={isDeleteAccountOpen} onOpenChange={setIsDeleteAccountOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir Conta
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirmar Exclusão da Conta</DialogTitle>
                    <DialogDescription>
                      Esta ação não pode ser desfeita. Todos os seus dados serão permanentemente removidos.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm">
                      Digite <strong>EXCLUIR</strong> para confirmar:
                    </p>
                    <Input placeholder="EXCLUIR" />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDeleteAccountOpen(false)}>
                      Cancelar
                    </Button>
                    <Button variant="destructive">
                      Confirmar Exclusão
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notificações */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
              <CardDescription>
                Configure como e quando você quer receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* E-mail */}
              <div>
                <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Notificações por E-mail
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Atualizações de Projetos</Label>
                      <p className="text-sm text-muted-foreground">Novidades sobre projetos que você participa</p>
                    </div>
                    <Switch defaultChecked={notificationSettings.email.projectUpdates} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Atribuição de Tarefas</Label>
                      <p className="text-sm text-muted-foreground">Quando uma tarefa for atribuída a você</p>
                    </div>
                    <Switch defaultChecked={notificationSettings.email.taskAssignments} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Mensagens da Equipe</Label>
                      <p className="text-sm text-muted-foreground">Mensagens diretas e menções</p>
                    </div>
                    <Switch defaultChecked={notificationSettings.email.teamMessages} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Alertas do Sistema</Label>
                      <p className="text-sm text-muted-foreground">Avisos importantes e manutenções</p>
                    </div>
                    <Switch defaultChecked={notificationSettings.email.systemAlerts} />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Push */}
              <div>
                <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Notificações Push
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Atualizações de Projetos</Label>
                    </div>
                    <Switch defaultChecked={notificationSettings.push.projectUpdates} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Atribuição de Tarefas</Label>
                    </div>
                    <Switch defaultChecked={notificationSettings.push.taskAssignments} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Mensagens da Equipe</Label>
                    </div>
                    <Switch defaultChecked={notificationSettings.push.teamMessages} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Segurança */}
        <TabsContent value="security" className="space-y-6">
          {/* Autenticação de Dois Fatores */}
          <Card>
            <CardHeader>
              <CardTitle>Autenticação de Dois Fatores</CardTitle>
              <CardDescription>
                Adicione uma camada extra de segurança à sua conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Status da 2FA</h4>
                  <p className="text-sm text-muted-foreground">
                    {userData.twoFactorEnabled ? "Ativada" : "Desativada"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {userData.twoFactorEnabled && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Ativa
                    </Badge>
                  )}
                  <Button variant={userData.twoFactorEnabled ? "outline" : "default"}>
                    {userData.twoFactorEnabled ? "Gerenciar" : "Configurar"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Histórico de Segurança */}
          <Card>
            <CardHeader>
              <CardTitle>Atividade de Segurança</CardTitle>
              <CardDescription>
                Histórico recente de atividades da sua conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityLog.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        log.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <p className="font-medium text-sm">{log.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {log.device} • {log.location}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(log.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sistema */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferências do Sistema</CardTitle>
              <CardDescription>
                Configure aparência e comportamento do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="theme">Tema</Label>
                  <Select defaultValue={userData.theme}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Claro</SelectItem>
                      <SelectItem value="dark">Escuro</SelectItem>
                      <SelectItem value="system">Sistema</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <Select defaultValue={userData.language}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuso Horário</Label>
                  <Select defaultValue={userData.timezone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                      <SelectItem value="America/New_York">Nova York (GMT-5)</SelectItem>
                      <SelectItem value="Europe/London">Londres (GMT+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date-format">Formato de Data</Label>
                  <Select defaultValue="dd/mm/yyyy">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd/mm/yyyy">DD/MM/AAAA</SelectItem>
                      <SelectItem value="mm/dd/yyyy">MM/DD/AAAA</SelectItem>
                      <SelectItem value="yyyy-mm-dd">AAAA-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Preferências de Interface</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Sidebar Compacta</Label>
                      <p className="text-sm text-muted-foreground">Mostrar sidebar em modo compacto</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Animações</Label>
                      <p className="text-sm text-muted-foreground">Habilitar animações de transição</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Sons do Sistema</Label>
                      <p className="text-sm text-muted-foreground">Reproduzir sons para notificações</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Configurações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
