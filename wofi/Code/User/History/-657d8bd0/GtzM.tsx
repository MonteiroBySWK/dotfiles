"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Camera,
  Save,
  Key,
  Globe,
  Building,
  UserCog,
  Settings,
  Trash2,
  Eye,
  EyeOff,
  Check,
  AlertTriangle
} from "lucide-react"
import { PageHeader } from "@/components/layout/PageHeader"

// Dados mockados do usuário
const userProfile = {
  id: "user-001",
  name: "Carlos Monteiro",
  email: "carlos.monteiro@empresa.com",
  phone: "+55 11 99999-9999",
  avatar: "/avatars/carlos.jpg",
  initials: "CM",
  title: "Desenvolvedor Senior",
  department: "Tecnologia",
  location: "São Paulo, SP",
  timezone: "America/Sao_Paulo",
  language: "pt-BR",
  dateFormat: "DD/MM/YYYY",
  timeFormat: "24h",
  bio: "Desenvolvedor com mais de 8 anos de experiência em tecnologias web e mobile. Especialista em React, Node.js e cloud computing.",
  joinDate: "2022-03-15",
  lastLogin: "2024-12-10T14:30:00Z",
  status: "active",
  role: "developer",
  permissions: [
    "projects.read",
    "projects.write",
    "tasks.read",
    "tasks.write",
    "reports.read"
  ],
  socialLinks: {
    linkedin: "https://linkedin.com/in/carlos-monteiro",
    github: "https://github.com/carlos-monteiro",
    website: "https://carlosmonteiro.dev"
  },
  preferences: {
    emailNotifications: true,
    pushNotifications: true,
    weeklyReports: true,
    projectUpdates: true,
    taskReminders: true,
    marketingEmails: false,
    twoFactorAuth: true,
    sessionTimeout: 8, // horas
    theme: "system"
  }
}

const timezones = [
  { value: "America/Sao_Paulo", label: "São Paulo (UTC-3)" },
  { value: "America/New_York", label: "Nova York (UTC-5)" },
  { value: "Europe/London", label: "Londres (UTC+0)" },
  { value: "Europe/Berlin", label: "Berlim (UTC+1)" },
  { value: "Asia/Tokyo", label: "Tóquio (UTC+9)" }
]

const languages = [
  { value: "pt-BR", label: "Português (Brasil)" },
  { value: "en-US", label: "English (US)" },
  { value: "es-ES", label: "Español" },
  { value: "fr-FR", label: "Français" }
]

const departments = [
  { value: "technology", label: "Tecnologia" },
  { value: "design", label: "Design" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Vendas" },
  { value: "hr", label: "Recursos Humanos" },
  { value: "finance", label: "Financeiro" }
]

export default function AccountSettingsPage() {
  const [profile, setProfile] = useState(userProfile)
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: ""
  })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveProfile = async () => {
    setIsSaving(true)
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSaving(false)
    setIsEditing(false)
    console.log("Perfil salvo:", profile)
  }

  const handleChangePassword = async () => {
    if (passwordData.new !== passwordData.confirm) {
      console.error("Senhas não coincidem")
      return
    }
    
    setIsSaving(true)
    // Simular mudança de senha
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSaving(false)
    setPasswordData({ current: "", new: "", confirm: "" })
    console.log("Senha alterada com sucesso")
  }

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      // Simular preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfile(prev => ({
          ...prev,
          avatar: e.target?.result as string
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDeleteAccount = () => {
    console.log("Iniciar processo de exclusão de conta")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const formatLastLogin = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR')
  }

  return (
    <>
      <PageHeader
        title="Configurações da Conta"
        description="Gerencie suas informações pessoais e preferências"
        actions={[
          {
            label: isEditing ? "Cancelar" : "Editar Perfil",
            variant: isEditing ? "outline" : "default",
            icon: isEditing ? undefined : UserCog,
            onClick: () => setIsEditing(!isEditing)
          }
        ]}
        badge={{
          label: profile.status === "active" ? "Ativa" : "Inativa",
          variant: profile.status === "active" ? "default" : "destructive"
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações Básicas */}
        <div className="lg:col-span-2 space-y-6">
          {/* Perfil Principal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Informações Pessoais
              </CardTitle>
              <CardDescription>
                Atualize suas informações básicas e foto de perfil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback className="text-lg">{profile.initials}</AvatarFallback>
                </Avatar>
                
                {isEditing && (
                  <div>
                    <Label htmlFor="avatar-upload" className="cursor-pointer">
                      <Button variant="outline" asChild>
                        <span>
                          <Camera className="h-4 w-4 mr-2" />
                          Trocar Foto
                        </span>
                      </Button>
                    </Label>
                    <Input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, PNG ou GIF. Máximo 5MB.
                    </p>
                  </div>
                )}
              </div>

              {/* Informações Básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Cargo</Label>
                  <Input
                    id="title"
                    value={profile.title}
                    onChange={(e) => setProfile(prev => ({ ...prev, title: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Departamento</Label>
                  <Select
                    value={profile.department.toLowerCase()}
                    onValueChange={(value) => setProfile(prev => ({ ...prev, department: value }))}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.value} value={dept.value}>
                          {dept.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Localização</Label>
                  <Input
                    id="location"
                    value={profile.location}
                    onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Biografia</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  disabled={!isEditing}
                  rows={3}
                  placeholder="Conte um pouco sobre você..."
                />
              </div>

              {/* Links Sociais */}
              {isEditing && (
                <div className="space-y-4">
                  <Label>Links Sociais</Label>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="linkedin" className="text-sm">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        value={profile.socialLinks.linkedin}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          socialLinks: { ...prev.socialLinks, linkedin: e.target.value }
                        }))}
                        placeholder="https://linkedin.com/in/seu-perfil"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="github" className="text-sm">GitHub</Label>
                      <Input
                        id="github"
                        value={profile.socialLinks.github}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          socialLinks: { ...prev.socialLinks, github: e.target.value }
                        }))}
                        placeholder="https://github.com/seu-usuario"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website" className="text-sm">Website</Label>
                      <Input
                        id="website"
                        value={profile.socialLinks.website}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          socialLinks: { ...prev.socialLinks, website: e.target.value }
                        }))}
                        placeholder="https://seu-site.com"
                      />
                    </div>
                  </div>
                </div>
              )}

              {isEditing && (
                <div className="flex space-x-2">
                  <Button onClick={handleSaveProfile} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Salvar Perfil
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancelar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preferências Regionais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Preferências Regionais
              </CardTitle>
              <CardDescription>
                Configure idioma, fuso horário e formatos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuso Horário</Label>
                  <Select
                    value={profile.timezone}
                    onValueChange={(value) => setProfile(prev => ({ ...prev, timezone: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <Select
                    value={profile.language}
                    onValueChange={(value) => setProfile(prev => ({ ...prev, language: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Formato de Data</Label>
                  <Select
                    value={profile.dateFormat}
                    onValueChange={(value) => setProfile(prev => ({ ...prev, dateFormat: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/AAAA</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/AAAA</SelectItem>
                      <SelectItem value="YYYY-MM-DD">AAAA-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeFormat">Formato de Hora</Label>
                  <Select
                    value={profile.timeFormat}
                    onValueChange={(value) => setProfile(prev => ({ ...prev, timeFormat: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">24 horas</SelectItem>
                      <SelectItem value="12h">12 horas (AM/PM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alterar Senha */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="h-5 w-5 mr-2" />
                Segurança da Conta
              </CardTitle>
              <CardDescription>
                Altere sua senha e configure autenticação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Senha Atual</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPassword ? "text" : "password"}
                      value={passwordData.current}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, current: e.target.value }))}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nova Senha</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.new}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, new: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label>Autenticação de Dois Fatores (2FA)</Label>
                  <p className="text-sm text-muted-foreground">
                    Adicione uma camada extra de segurança à sua conta
                  </p>
                </div>
                <Switch
                  checked={profile.preferences.twoFactorAuth}
                  onCheckedChange={(checked) => setProfile(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, twoFactorAuth: checked }
                  }))}
                />
              </div>

              <Button onClick={handleChangePassword} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Alterando...
                  </>
                ) : (
                  <>
                    <Key className="h-4 w-4 mr-2" />
                    Alterar Senha
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Informações e Status */}
        <div className="space-y-6">
          {/* Status da Conta */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Status da Conta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Status:</span>
                  <Badge variant={profile.status === "active" ? "default" : "destructive"}>
                    {profile.status === "active" ? "Ativa" : "Inativa"}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Cargo:</span>
                  <span className="text-sm font-medium">{profile.title}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Departamento:</span>
                  <span className="text-sm font-medium">{profile.department}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Membro desde:</span>
                  <span className="text-sm font-medium">{formatDate(profile.joinDate)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Último acesso:</span>
                  <span className="text-sm font-medium">{formatLastLogin(profile.lastLogin)}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-sm font-medium">Permissões:</Label>
                <div className="space-y-1">
                  {profile.permissions.map((permission) => (
                    <div key={permission} className="flex items-center space-x-2">
                      <Check className="h-3 w-3 text-green-600" />
                      <span className="text-xs">{permission}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configurações de Sessão */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Configurações de Sessão
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Tempo Limite da Sessão (horas)</Label>
                <Select
                  value={profile.preferences.sessionTimeout.toString()}
                  onValueChange={(value) => setProfile(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, sessionTimeout: parseInt(value) }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hora</SelectItem>
                    <SelectItem value="4">4 horas</SelectItem>
                    <SelectItem value="8">8 horas</SelectItem>
                    <SelectItem value="24">24 horas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tema</Label>
                <Select
                  value={profile.preferences.theme}
                  onValueChange={(value) => setProfile(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, theme: value }
                  }))}
                >
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
            </CardContent>
          </Card>

          {/* Ações Perigosas */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center text-red-600">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Zona de Perigo
              </CardTitle>
              <CardDescription>
                Ações irreversíveis que afetam sua conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleDeleteAccount}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir Conta
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Esta ação não pode ser desfeita. Todos os seus dados serão permanentemente removidos.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
