"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Shield,
  Key,
  Smartphone,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Monitor,
  Fingerprint,
  QrCode,
  Download,
  Trash2,
  RefreshCw,
  LogOut,
  History
} from "lucide-react"
import { PageHeader } from "@/components/layout/PageHeader"
import { PageContainer } from "@/components/layout/page-container"

// Configurações de segurança
const securitySettings = {
  twoFactorAuth: {
    enabled: true,
    method: "app", // app, sms, email
    backupCodes: ["123456", "234567", "345678", "456789", "567890"],
    lastUsed: "2024-12-09T10:30:00Z"
  },
  passwordPolicy: {
    minLength: 8,
    requireNumbers: true,
    requireSymbols: true,
    requireUppercase: true,
    expiryDays: 90,
    lastChanged: "2024-11-15T14:20:00Z"
  },
  sessionSecurity: {
    timeout: 8, // horas
    rememberDevice: true,
    maxSessions: 5,
    requireReauth: true
  },
  loginAlerts: {
    newDevice: true,
    newLocation: true,
    failedAttempts: true,
    emailNotification: true,
    pushNotification: true
  },
  privacySettings: {
    profileVisibility: "team", // public, team, private
    activityTracking: true,
    dataCollection: true,
    thirdPartyAccess: false
  }
}

// Sessões ativas
const activeSessions = [
  {
    id: "session-1",
    device: "Chrome - Windows 11",
    location: "São Paulo, SP",
    ip: "192.168.1.100",
    loginTime: "2024-12-10T14:30:00Z",
    lastActive: "2024-12-10T15:45:00Z",
    current: true
  },
  {
    id: "session-2",
    device: "Mobile App - iPhone 14",
    location: "São Paulo, SP",
    ip: "192.168.1.101",
    loginTime: "2024-12-10T08:15:00Z",
    lastActive: "2024-12-10T13:20:00Z",
    current: false
  },
  {
    id: "session-3",
    device: "Firefox - Ubuntu",
    location: "Rio de Janeiro, RJ",
    ip: "203.0.113.1",
    loginTime: "2024-12-09T19:45:00Z",
    lastActive: "2024-12-09T22:30:00Z",
    current: false
  }
]

// Histórico de login
const loginHistory = [
  {
    id: "login-1",
    timestamp: "2024-12-10T14:30:00Z",
    device: "Chrome - Windows 11",
    location: "São Paulo, SP",
    ip: "192.168.1.100",
    status: "success",
    method: "password"
  },
  {
    id: "login-2",
    timestamp: "2024-12-10T08:15:00Z",
    device: "Mobile App - iPhone 14",
    location: "São Paulo, SP",
    ip: "192.168.1.101",
    status: "success",
    method: "biometric"
  },
  {
    id: "login-3",
    timestamp: "2024-12-09T23:45:00Z",
    device: "Chrome - Unknown",
    location: "Brasília, DF",
    ip: "203.0.113.5",
    status: "failed",
    method: "password",
    reason: "Invalid credentials"
  },
  {
    id: "login-4",
    timestamp: "2024-12-09T19:45:00Z",
    device: "Firefox - Ubuntu",
    location: "Rio de Janeiro, RJ",
    ip: "203.0.113.1",
    status: "success",
    method: "2fa"
  }
]

export default function SecuritySettingsPage() {
  const [settings, setSettings] = useState(securitySettings)
  const [showBackupCodes, setShowBackupCodes] = useState(false)
  const [newPassword, setNewPassword] = useState({ current: "", new: "", confirm: "" })
  const [showPasswords, setShowPasswords] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [qrCodeGenerated, setQrCodeGenerated] = useState(false)

  const handleSaveSettings = async () => {
    setIsSaving(true)
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSaving(false)
    console.log("Configurações de segurança salvas:", settings)
  }

  const handleChangePassword = async () => {
    if (newPassword.new !== newPassword.confirm) {
      console.error("Senhas não coincidem")
      return
    }
    
    setIsSaving(true)
    // Simular mudança de senha
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSaving(false)
    setNewPassword({ current: "", new: "", confirm: "" })
    console.log("Senha alterada com sucesso")
  }

  const handleEnable2FA = async () => {
    setQrCodeGenerated(true)
    // Simular geração de QR Code
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSettings(prev => ({
      ...prev,
      twoFactorAuth: { ...prev.twoFactorAuth, enabled: true }
    }))
    console.log("2FA habilitado")
  }

  const handleDisable2FA = () => {
    setSettings(prev => ({
      ...prev,
      twoFactorAuth: { ...prev.twoFactorAuth, enabled: false }
    }))
    console.log("2FA desabilitado")
  }

  const handleRevokeSession = (sessionId: string) => {
    console.log(`Sessão revogada: ${sessionId}`)
  }

  const handleRevokeAllSessions = () => {
    console.log("Todas as sessões foram revogadas")
  }

  const handleGenerateBackupCodes = () => {
    const newCodes = Array.from({ length: 10 }, () => 
      Math.random().toString(36).substring(2, 8).toUpperCase()
    )
    setSettings(prev => ({
      ...prev,
      twoFactorAuth: { ...prev.twoFactorAuth, backupCodes: newCodes }
    }))
    console.log("Novos códigos de backup gerados")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "default"
      case "failed":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return CheckCircle
      case "failed":
        return AlertTriangle
      default:
        return Clock
    }
  }

  const passwordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    
    const levels = ["Muito Fraca", "Fraca", "Média", "Forte", "Muito Forte"]
    const colors = ["text-red-600", "text-orange-600", "text-yellow-600", "text-blue-600", "text-green-600"]
    
    return {
      level: levels[strength] || "Muito Fraca",
      color: colors[strength] || "text-red-600",
      score: strength
    }
  }

  const currentPasswordStrength = passwordStrength(newPassword.new)

  return (
    <PageContainer>
      <PageHeader
        title="Configurações de Segurança"
        description="Proteja sua conta com configurações avançadas de segurança"
        actions={[
          {
            label: "Revogar Todas as Sessões",
            icon: LogOut,
            variant: "destructive",
            onClick: handleRevokeAllSessions
          }
        ]}
        badge={{
          label: settings.twoFactorAuth.enabled ? "2FA Ativo" : "2FA Inativo",
          variant: settings.twoFactorAuth.enabled ? "default" : "destructive"
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configurações Principais */}
        <div className="lg:col-span-2 space-y-6">
          {/* Autenticação de Dois Fatores */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Autenticação de Dois Fatores (2FA)
              </CardTitle>
              <CardDescription>
                Adicione uma camada extra de segurança à sua conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium">Status do 2FA</h4>
                  <p className="text-sm text-muted-foreground">
                    {settings.twoFactorAuth.enabled 
                      ? "Sua conta está protegida com 2FA" 
                      : "Sua conta não está protegida com 2FA"
                    }
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={settings.twoFactorAuth.enabled ? "default" : "destructive"}>
                    {settings.twoFactorAuth.enabled ? "Ativo" : "Inativo"}
                  </Badge>
                  {settings.twoFactorAuth.enabled ? (
                    <Button variant="destructive" size="sm" onClick={handleDisable2FA}>
                      <Unlock className="h-4 w-4 mr-2" />
                      Desabilitar
                    </Button>
                  ) : (
                    <Button size="sm" onClick={handleEnable2FA}>
                      <Lock className="h-4 w-4 mr-2" />
                      Habilitar
                    </Button>
                  )}
                </div>
              </div>

              {settings.twoFactorAuth.enabled && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 border rounded-lg text-center">
                      <Smartphone className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <h4 className="font-medium text-sm">App Autenticador</h4>
                      <p className="text-xs text-muted-foreground">Google Authenticator, Authy</p>
                      <Badge variant={settings.twoFactorAuth.method === "app" ? "default" : "outline"} className="mt-2">
                        {settings.twoFactorAuth.method === "app" ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>

                    <div className="p-3 border rounded-lg text-center">
                      <QrCode className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <h4 className="font-medium text-sm">QR Code</h4>
                      <p className="text-xs text-muted-foreground">Escaneie para configurar</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <QrCode className="h-3 w-3 mr-1" />
                        Gerar
                      </Button>
                    </div>

                    <div className="p-3 border rounded-lg text-center">
                      <Key className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                      <h4 className="font-medium text-sm">Códigos de Backup</h4>
                      <p className="text-xs text-muted-foreground">{settings.twoFactorAuth.backupCodes.length} códigos</p>
                      <Button variant="outline" size="sm" className="mt-2" onClick={() => setShowBackupCodes(!showBackupCodes)}>
                        <Eye className="h-3 w-3 mr-1" />
                        {showBackupCodes ? "Ocultar" : "Ver"}
                      </Button>
                    </div>
                  </div>

                  {showBackupCodes && (
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">Códigos de Backup</h4>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={handleGenerateBackupCodes}>
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Gerar Novos
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-3 w-3 mr-1" />
                            Baixar
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        {settings.twoFactorAuth.backupCodes.map((code, index) => (
                          <div key={index} className="p-2 bg-background border rounded text-center font-mono text-sm">
                            {code}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-3">
                        ⚠️ Guarde estes códigos em local seguro. Cada código só pode ser usado uma vez.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Alteração de Senha */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="h-5 w-5 mr-2" />
                Alterar Senha
              </CardTitle>
              <CardDescription>
                Mantenha sua senha forte e atualizada
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Senha Atual</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPasswords ? "text" : "password"}
                      value={newPassword.current}
                      onChange={(e) => setNewPassword(prev => ({ ...prev, current: e.target.value }))}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPasswords(!showPasswords)}
                    >
                      {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nova Senha</Label>
                  <Input
                    id="newPassword"
                    type={showPasswords ? "text" : "password"}
                    value={newPassword.new}
                    onChange={(e) => setNewPassword(prev => ({ ...prev, new: e.target.value }))}
                  />
                  {newPassword.new && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Força da senha: </span>
                      <span className={currentPasswordStrength.color}>
                        {currentPasswordStrength.level}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                  <Input
                    id="confirmPassword"
                    type={showPasswords ? "text" : "password"}
                    value={newPassword.confirm}
                    onChange={(e) => setNewPassword(prev => ({ ...prev, confirm: e.target.value }))}
                  />
                  {newPassword.confirm && newPassword.new !== newPassword.confirm && (
                    <p className="text-sm text-red-600">As senhas não coincidem</p>
                  )}
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-muted/50">
                <h4 className="font-medium mb-2">Requisitos da Senha</h4>
                <div className="text-sm space-y-1">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className={`h-3 w-3 ${newPassword.new.length >= 8 ? "text-green-600" : "text-muted-foreground"}`} />
                    <span>Mínimo de 8 caracteres</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className={`h-3 w-3 ${/[A-Z]/.test(newPassword.new) ? "text-green-600" : "text-muted-foreground"}`} />
                    <span>Pelo menos uma letra maiúscula</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className={`h-3 w-3 ${/[0-9]/.test(newPassword.new) ? "text-green-600" : "text-muted-foreground"}`} />
                    <span>Pelo menos um número</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className={`h-3 w-3 ${/[^A-Za-z0-9]/.test(newPassword.new) ? "text-green-600" : "text-muted-foreground"}`} />
                    <span>Pelo menos um símbolo</span>
                  </div>
                </div>
              </div>

              <Button onClick={handleChangePassword} disabled={isSaving || !newPassword.current || !newPassword.new || newPassword.new !== newPassword.confirm}>
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

          {/* Configurações de Sessão */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Monitor className="h-5 w-5 mr-2" />
                Configurações de Sessão
              </CardTitle>
              <CardDescription>
                Gerencie como suas sessões são controladas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tempo Limite da Sessão</Label>
                  <Select
                    value={settings.sessionSecurity.timeout.toString()}
                    onValueChange={(value) => setSettings(prev => ({
                      ...prev,
                      sessionSecurity: { ...prev.sessionSecurity, timeout: parseInt(value) }
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
                  <Label>Máximo de Sessões</Label>
                  <Select
                    value={settings.sessionSecurity.maxSessions.toString()}
                    onValueChange={(value) => setSettings(prev => ({
                      ...prev,
                      sessionSecurity: { ...prev.sessionSecurity, maxSessions: parseInt(value) }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 sessão</SelectItem>
                      <SelectItem value="3">3 sessões</SelectItem>
                      <SelectItem value="5">5 sessões</SelectItem>
                      <SelectItem value="10">10 sessões</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Lembrar dispositivo</Label>
                    <p className="text-sm text-muted-foreground">
                      Não solicitar 2FA em dispositivos confiáveis
                    </p>
                  </div>
                  <Switch
                    checked={settings.sessionSecurity.rememberDevice}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      sessionSecurity: { ...prev.sessionSecurity, rememberDevice: checked }
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Reautenticação obrigatória</Label>
                    <p className="text-sm text-muted-foreground">
                      Solicitar senha para ações sensíveis
                    </p>
                  </div>
                  <Switch
                    checked={settings.sessionSecurity.requireReauth}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      sessionSecurity: { ...prev.sessionSecurity, requireReauth: checked }
                    }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alertas de Login */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Alertas de Segurança
              </CardTitle>
              <CardDescription>
                Configure quando ser notificado sobre atividades de login
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Novo dispositivo</Label>
                  <p className="text-sm text-muted-foreground">
                    Alerta quando um novo dispositivo faz login
                  </p>
                </div>
                <Switch
                  checked={settings.loginAlerts.newDevice}
                  onCheckedChange={(checked) => setSettings(prev => ({
                    ...prev,
                    loginAlerts: { ...prev.loginAlerts, newDevice: checked }
                  }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Nova localização</Label>
                  <p className="text-sm text-muted-foreground">
                    Alerta quando login vem de nova localização
                  </p>
                </div>
                <Switch
                  checked={settings.loginAlerts.newLocation}
                  onCheckedChange={(checked) => setSettings(prev => ({
                    ...prev,
                    loginAlerts: { ...prev.loginAlerts, newLocation: checked }
                  }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Tentativas falhadas</Label>
                  <p className="text-sm text-muted-foreground">
                    Alerta após múltiplas tentativas de login falhadas
                  </p>
                </div>
                <Switch
                  checked={settings.loginAlerts.failedAttempts}
                  onCheckedChange={(checked) => setSettings(prev => ({
                    ...prev,
                    loginAlerts: { ...prev.loginAlerts, failedAttempts: checked }
                  }))}
                />
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
                  <Shield className="h-4 w-4 mr-2" />
                  Salvar Configurações
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Sidebar - Sessões e Histórico */}
        <div className="space-y-6">
          {/* Sessões Ativas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Monitor className="h-5 w-5 mr-2" />
                Sessões Ativas
              </CardTitle>
              <CardDescription>
                {activeSessions.length} sessões ativas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeSessions.map((session) => (
                <div key={session.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{session.device}</span>
                    <div className="flex items-center space-x-2">
                      {session.current && (
                        <Badge variant="default" className="text-xs">Atual</Badge>
                      )}
                      {!session.current && (
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleRevokeSession(session.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{session.location}</span>
                    </div>
                    <p>IP: {session.ip}</p>
                    <p>Login: {formatDate(session.loginTime)}</p>
                    <p>Última atividade: {formatDate(session.lastActive)}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Histórico de Login */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <History className="h-5 w-5 mr-2" />
                Histórico de Login
              </CardTitle>
              <CardDescription>
                Últimas atividades de login
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {loginHistory.slice(0, 5).map((login) => {
                const StatusIcon = getStatusIcon(login.status)
                return (
                  <div key={login.id} className="flex items-start space-x-3 p-2 border-l-2 border-l-muted">
                    <StatusIcon className={`h-4 w-4 mt-0.5 ${
                      login.status === "success" ? "text-green-600" : 
                      login.status === "failed" ? "text-red-600" : "text-yellow-600"
                    }`} />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{login.device}</span>
                        <Badge variant={getStatusColor(login.status)} className="text-xs">
                          {login.status === "success" ? "Sucesso" : "Falhou"}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <p>{login.location} • {login.ip}</p>
                        <p>{formatDate(login.timestamp)}</p>
                        <p>Método: {login.method}</p>
                        {login.reason && (
                          <p className="text-red-600">Motivo: {login.reason}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Configurações de Privacidade */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                Privacidade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label>Visibilidade do Perfil</Label>
                <Select
                  value={settings.privacySettings.profileVisibility}
                  onValueChange={(value) => setSettings(prev => ({
                    ...prev,
                    privacySettings: { ...prev.privacySettings, profileVisibility: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Público</SelectItem>
                    <SelectItem value="team">Apenas Equipe</SelectItem>
                    <SelectItem value="private">Privado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">Rastreamento de Atividade</Label>
                  <p className="text-xs text-muted-foreground">
                    Permitir coleta de dados de uso
                  </p>
                </div>
                <Switch
                  checked={settings.privacySettings.activityTracking}
                  onCheckedChange={(checked) => setSettings(prev => ({
                    ...prev,
                    privacySettings: { ...prev.privacySettings, activityTracking: checked }
                  }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">Acesso de Terceiros</Label>
                  <p className="text-xs text-muted-foreground">
                    Permitir integrações externas
                  </p>
                </div>
                <Switch
                  checked={settings.privacySettings.thirdPartyAccess}
                  onCheckedChange={(checked) => setSettings(prev => ({
                    ...prev,
                    privacySettings: { ...prev.privacySettings, thirdPartyAccess: checked }
                  }))}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}
