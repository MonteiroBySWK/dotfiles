"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { 
  Settings,
  Database,
  HardDrive,
  Wifi,
  Shield,
  Zap,
  Monitor,
  RotateCcw,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Server,
  Activity,
  BarChart3,
  RefreshCw,
  Save,
  Info,
  Gauge,
  Globe
} from "lucide-react"
import { PageHeader } from "@/components/layout/PageHeader"
import { PageContainer } from "@/components/layout/page-container"

// Configurações do sistema
const systemSettings = {
  general: {
    systemName: "Dashboard Thera",
    version: "2.1.4",
    environment: "production", // development, staging, production
    timezone: "America/Sao_Paulo",
    language: "pt-BR",
    debugMode: false,
    maintenanceMode: false,
    autoUpdates: true
  },
  performance: {
    cachingEnabled: true,
    compressionEnabled: true,
    cdnEnabled: true,
    lazyLoading: true,
    maxConcurrentUsers: 1000,
    requestTimeout: 30, // seconds
    sessionTimeout: 8, // hours
    backgroundJobs: true
  },
  storage: {
    totalSpace: 1000, // GB
    usedSpace: 245, // GB
    backupEnabled: true,
    backupFrequency: "daily", // hourly, daily, weekly
    retentionDays: 30,
    compressionEnabled: true,
    cloudSync: true
  },
  security: {
    httpsOnly: true,
    corsEnabled: true,
    rateLimiting: true,
    ipWhitelist: false,
    auditLogging: true,
    encryptionLevel: "AES-256",
    tokenExpiry: 24, // hours
    maxLoginAttempts: 5
  },
  integrations: {
    emailService: "enabled",
    smsService: "enabled",
    webhooks: "enabled",
    apiAccess: "enabled",
    thirdPartyConnections: 12,
    activeIntegrations: 8
  },
  monitoring: {
    errorTracking: true,
    performanceMetrics: true,
    userAnalytics: true,
    systemAlerts: true,
    customDashboards: true,
    realTimeMonitoring: true
  }
}

// Métricas do sistema
const systemMetrics = {
  uptime: "99.8%",
  responseTime: "245ms",
  activeUsers: 156,
  totalRequests: 2845692,
  errorRate: "0.02%",
  cpuUsage: 45,
  memoryUsage: 68,
  diskUsage: 24.5,
  networkUsage: 12.8,
  lastBackup: "2024-12-10T02:00:00Z",
  lastUpdate: "2024-12-05T14:30:00Z"
}

// Logs do sistema
const systemLogs = [
  {
    id: "log-1",
    timestamp: "2024-12-10T15:45:22Z",
    level: "info",
    category: "system",
    message: "Sistema iniciado com sucesso",
    details: "Todos os serviços estão operacionais"
  },
  {
    id: "log-2",
    timestamp: "2024-12-10T15:30:15Z",
    level: "warning",
    category: "performance",
    message: "Alto uso de CPU detectado",
    details: "CPU usage: 85% por 5 minutos"
  },
  {
    id: "log-3",
    timestamp: "2024-12-10T14:20:08Z",
    level: "error",
    category: "database",
    message: "Falha na conexão com banco de dados",
    details: "Timeout após 30 segundos - reconectado automaticamente"
  },
  {
    id: "log-4",
    timestamp: "2024-12-10T13:15:43Z",
    level: "info",
    category: "backup",
    message: "Backup automático concluído",
    details: "245 GB processados em 45 minutos"
  },
  {
    id: "log-5",
    timestamp: "2024-12-10T12:00:00Z",
    level: "info",
    category: "security",
    message: "Auditoria de segurança executada",
    details: "Nenhuma vulnerabilidade encontrada"
  }
]

// Serviços do sistema
const systemServices = [
  {
    name: "Web Server",
    status: "running",
    port: 3000,
    uptime: "7 dias, 14h",
    cpu: 15,
    memory: 245
  },
  {
    name: "Database",
    status: "running",
    port: 5432,
    uptime: "7 dias, 14h",
    cpu: 25,
    memory: 512
  },
  {
    name: "Redis Cache",
    status: "running",
    port: 6379,
    uptime: "7 dias, 14h",
    cpu: 5,
    memory: 128
  },
  {
    name: "Background Jobs",
    status: "running",
    port: null,
    uptime: "7 dias, 14h",
    cpu: 8,
    memory: 64
  },
  {
    name: "File Storage",
    status: "running",
    port: 9000,
    uptime: "7 dias, 14h",
    cpu: 12,
    memory: 156
  },
  {
    name: "Email Service",
    status: "warning",
    port: 587,
    uptime: "2h, 30m",
    cpu: 3,
    memory: 32
  }
]

export default function SystemSettingsPage() {
  const [settings, setSettings] = useState(systemSettings)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedLogLevel, setSelectedLogLevel] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [backupInProgress, setBackupInProgress] = useState(false)
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false)

  const handleSaveSettings = async () => {
    setIsSaving(true)
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSaving(false)
    console.log("Configurações do sistema salvas:", settings)
  }

  const handleBackupNow = async () => {
    setBackupInProgress(true)
    // Simular backup
    await new Promise(resolve => setTimeout(resolve, 5000))
    setBackupInProgress(false)
    console.log("Backup manual iniciado")
  }

  const handleRestoreSystem = () => {
    console.log("Restauração do sistema iniciada")
  }

  const handleRestartService = (serviceName: string) => {
    console.log(`Reiniciando serviço: ${serviceName}`)
  }

  const handleClearLogs = () => {
    console.log("Logs limpos")
  }

  const handleExportLogs = () => {
    console.log("Exportando logs")
  }

  const filteredLogs = systemLogs.filter(log => {
    const matchesLevel = selectedLogLevel === "all" || log.level === selectedLogLevel
    const matchesCategory = selectedCategory === "all" || log.category === selectedCategory
    return matchesLevel && matchesCategory
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR')
  }

  const getServiceStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "default"
      case "warning":
        return "secondary"
      case "error":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case "info":
        return "text-blue-600"
      case "warning":
        return "text-yellow-600"
      case "error":
        return "text-red-600"
      default:
        return "text-muted-foreground"
    }
  }

  const getLogLevelIcon = (level: string) => {
    switch (level) {
      case "info":
        return Info
      case "warning":
        return AlertTriangle
      case "error":
        return AlertTriangle
      default:
        return Clock
    }
  }

  const calculateStoragePercentage = () => {
    return (settings.storage.usedSpace / settings.storage.totalSpace) * 100
  }

  return (
    <PageContainer>
      <PageHeader
        title="Configurações do Sistema"
        description="Gerencie configurações avançadas, performance e monitoramento"
        actions={[
          {
            label: "Backup Manual",
            icon: Download,
            onClick: handleBackupNow,
            disabled: backupInProgress
          }
        ]}
        badge={{
          label: `Uptime: ${systemMetrics.uptime}`,
          variant: "default"
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configurações Principais */}
        <div className="lg:col-span-2 space-y-6">
          {/* Configurações Gerais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Configurações Gerais
              </CardTitle>
              <CardDescription>
                Configurações básicas do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="systemName">Nome do Sistema</Label>
                  <Input
                    id="systemName"
                    value={settings.general.systemName}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      general: { ...prev.general, systemName: e.target.value }
                    }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Versão</Label>
                  <Input value={settings.general.version} disabled />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="environment">Ambiente</Label>
                  <Select
                    value={settings.general.environment}
                    onValueChange={(value) => setSettings(prev => ({
                      ...prev,
                      general: { ...prev.general, environment: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="development">Desenvolvimento</SelectItem>
                      <SelectItem value="staging">Homologação</SelectItem>
                      <SelectItem value="production">Produção</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuso Horário</Label>
                  <Select
                    value={settings.general.timezone}
                    onValueChange={(value) => setSettings(prev => ({
                      ...prev,
                      general: { ...prev.general, timezone: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Sao_Paulo">São Paulo (UTC-3)</SelectItem>
                      <SelectItem value="America/New_York">Nova York (UTC-5)</SelectItem>
                      <SelectItem value="Europe/London">Londres (UTC+0)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tóquio (UTC+9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Modo de Manutenção</Label>
                    <p className="text-sm text-muted-foreground">
                      Bloquear acesso de usuários para manutenção
                    </p>
                  </div>
                  <Switch
                    checked={settings.general.maintenanceMode}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      general: { ...prev.general, maintenanceMode: checked }
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Atualizações Automáticas</Label>
                    <p className="text-sm text-muted-foreground">
                      Permitir atualizações automáticas do sistema
                    </p>
                  </div>
                  <Switch
                    checked={settings.general.autoUpdates}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      general: { ...prev.general, autoUpdates: checked }
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Modo Debug</Label>
                    <p className="text-sm text-muted-foreground">
                      Ativar logs detalhados para depuração
                    </p>
                  </div>
                  <Switch
                    checked={settings.general.debugMode}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      general: { ...prev.general, debugMode: checked }
                    }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Performance
              </CardTitle>
              <CardDescription>
                Configurações de otimização e performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Máximo de Usuários Simultâneos</Label>
                  <Select
                    value={settings.performance.maxConcurrentUsers.toString()}
                    onValueChange={(value) => setSettings(prev => ({
                      ...prev,
                      performance: { ...prev.performance, maxConcurrentUsers: parseInt(value) }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="500">500 usuários</SelectItem>
                      <SelectItem value="1000">1000 usuários</SelectItem>
                      <SelectItem value="2000">2000 usuários</SelectItem>
                      <SelectItem value="5000">5000 usuários</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Timeout de Requisição (segundos)</Label>
                  <Select
                    value={settings.performance.requestTimeout.toString()}
                    onValueChange={(value) => setSettings(prev => ({
                      ...prev,
                      performance: { ...prev.performance, requestTimeout: parseInt(value) }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 segundos</SelectItem>
                      <SelectItem value="30">30 segundos</SelectItem>
                      <SelectItem value="60">60 segundos</SelectItem>
                      <SelectItem value="120">120 segundos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Cache Habilitado</Label>
                    <p className="text-sm text-muted-foreground">
                      Usar cache para melhorar performance
                    </p>
                  </div>
                  <Switch
                    checked={settings.performance.cachingEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      performance: { ...prev.performance, cachingEnabled: checked }
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Compressão Gzip</Label>
                    <p className="text-sm text-muted-foreground">
                      Comprimir respostas para reduzir largura de banda
                    </p>
                  </div>
                  <Switch
                    checked={settings.performance.compressionEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      performance: { ...prev.performance, compressionEnabled: checked }
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>CDN Habilitado</Label>
                    <p className="text-sm text-muted-foreground">
                      Usar rede de distribuição de conteúdo
                    </p>
                  </div>
                  <Switch
                    checked={settings.performance.cdnEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      performance: { ...prev.performance, cdnEnabled: checked }
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Lazy Loading</Label>
                    <p className="text-sm text-muted-foreground">
                      Carregar conteúdo sob demanda
                    </p>
                  </div>
                  <Switch
                    checked={settings.performance.lazyLoading}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      performance: { ...prev.performance, lazyLoading: checked }
                    }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Armazenamento e Backup */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <HardDrive className="h-5 w-5 mr-2" />
                Armazenamento e Backup
              </CardTitle>
              <CardDescription>
                Gerencie espaço em disco e políticas de backup
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Uso de Disco */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Uso de Disco</Label>
                  <span className="text-sm text-muted-foreground">
                    {settings.storage.usedSpace} GB / {settings.storage.totalSpace} GB
                  </span>
                </div>
                <Progress value={calculateStoragePercentage()} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {(100 - calculateStoragePercentage()).toFixed(1)}% disponível
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Frequência de Backup</Label>
                  <Select
                    value={settings.storage.backupFrequency}
                    onValueChange={(value) => setSettings(prev => ({
                      ...prev,
                      storage: { ...prev.storage, backupFrequency: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">A cada hora</SelectItem>
                      <SelectItem value="daily">Diário</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Retenção (dias)</Label>
                  <Select
                    value={settings.storage.retentionDays.toString()}
                    onValueChange={(value) => setSettings(prev => ({
                      ...prev,
                      storage: { ...prev.storage, retentionDays: parseInt(value) }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 dias</SelectItem>
                      <SelectItem value="30">30 dias</SelectItem>
                      <SelectItem value="90">90 dias</SelectItem>
                      <SelectItem value="365">365 dias</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Backup Automático</Label>
                    <p className="text-sm text-muted-foreground">
                      Realizar backups automaticamente
                    </p>
                  </div>
                  <Switch
                    checked={settings.storage.backupEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      storage: { ...prev.storage, backupEnabled: checked }
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Compressão de Backup</Label>
                    <p className="text-sm text-muted-foreground">
                      Comprimir backups para economizar espaço
                    </p>
                  </div>
                  <Switch
                    checked={settings.storage.compressionEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      storage: { ...prev.storage, compressionEnabled: checked }
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Sincronização na Nuvem</Label>
                    <p className="text-sm text-muted-foreground">
                      Enviar backups para armazenamento na nuvem
                    </p>
                  </div>
                  <Switch
                    checked={settings.storage.cloudSync}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      storage: { ...prev.storage, cloudSync: checked }
                    }))}
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleBackupNow} disabled={backupInProgress}>
                  {backupInProgress ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Fazendo Backup...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Backup Agora
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleRestoreSystem}>
                  <Upload className="h-4 w-4 mr-2" />
                  Restaurar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Configurações Avançadas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Server className="h-5 w-5 mr-2" />
                  Configurações Avançadas
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                >
                  {showAdvancedSettings ? "Ocultar" : "Mostrar"}
                </Button>
              </CardTitle>
              <CardDescription>
                Configurações técnicas avançadas do sistema
              </CardDescription>
            </CardHeader>
            {showAdvancedSettings && (
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>HTTPS Obrigatório</Label>
                      <p className="text-sm text-muted-foreground">
                        Forçar conexões seguras HTTPS
                      </p>
                    </div>
                    <Switch
                      checked={settings.security.httpsOnly}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        security: { ...prev.security, httpsOnly: checked }
                      }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Rate Limiting</Label>
                      <p className="text-sm text-muted-foreground">
                        Limitar número de requisições por usuário
                      </p>
                    </div>
                    <Switch
                      checked={settings.security.rateLimiting}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        security: { ...prev.security, rateLimiting: checked }
                      }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Audit Logging</Label>
                      <p className="text-sm text-muted-foreground">
                        Registrar todas as ações dos usuários
                      </p>
                    </div>
                    <Switch
                      checked={settings.security.auditLogging}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        security: { ...prev.security, auditLogging: checked }
                      }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Monitoramento em Tempo Real</Label>
                      <p className="text-sm text-muted-foreground">
                        Monitor contínuo de performance e erros
                      </p>
                    </div>
                    <Switch
                      checked={settings.monitoring.realTimeMonitoring}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        monitoring: { ...prev.monitoring, realTimeMonitoring: checked }
                      }))}
                    />
                  </div>
                </div>
              </CardContent>
            )}
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
            <Button variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Restaurar Padrões
            </Button>
          </div>
        </div>

        {/* Sidebar - Status e Logs */}
        <div className="space-y-6">
          {/* Status do Sistema */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Status do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Uptime:</span>
                  <Badge variant="default">{systemMetrics.uptime}</Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Tempo de Resposta:</span>
                  <span className="text-sm font-medium">{systemMetrics.responseTime}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Usuários Ativos:</span>
                  <span className="text-sm font-medium">{systemMetrics.activeUsers}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Taxa de Erro:</span>
                  <span className="text-sm font-medium text-green-600">{systemMetrics.errorRate}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>CPU:</span>
                    <span>{systemMetrics.cpuUsage}%</span>
                  </div>
                  <Progress value={systemMetrics.cpuUsage} className="h-2" />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Memória:</span>
                    <span>{systemMetrics.memoryUsage}%</span>
                  </div>
                  <Progress value={systemMetrics.memoryUsage} className="h-2" />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Disco:</span>
                    <span>{systemMetrics.diskUsage}%</span>
                  </div>
                  <Progress value={systemMetrics.diskUsage} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Serviços */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Server className="h-5 w-5 mr-2" />
                Serviços
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {systemServices.map((service) => (
                <div key={service.name} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{service.name}</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getServiceStatusColor(service.status)}>
                        {service.status === "running" ? "Executando" : 
                         service.status === "warning" ? "Aviso" : "Erro"}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestartService(service.name)}
                      >
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    {service.port && <p>Porta: {service.port}</p>}
                    <p>Uptime: {service.uptime}</p>
                    <p>CPU: {service.cpu}% | RAM: {service.memory}MB</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Logs do Sistema */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Logs do Sistema
              </CardTitle>
              <CardDescription>
                <div className="flex space-x-2 mt-2">
                  <Select value={selectedLogLevel} onValueChange={setSelectedLogLevel}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warning">Aviso</SelectItem>
                      <SelectItem value="error">Erro</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline" size="sm" onClick={handleExportLogs}>
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredLogs.slice(0, 5).map((log) => {
                const LogIcon = getLogLevelIcon(log.level)
                return (
                  <div key={log.id} className="p-2 border-l-2 border-l-muted text-xs">
                    <div className="flex items-start space-x-2">
                      <LogIcon className={`h-3 w-3 mt-0.5 ${getLogLevelColor(log.level)}`} />
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                          <span className="font-medium">{log.message}</span>
                          <Badge variant="outline" className="text-xs">
                            {log.level}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">{log.details}</p>
                        <p className="text-muted-foreground">
                          {formatDate(log.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="w-full" onClick={handleClearLogs}>
                  <Trash2 className="h-3 w-3 mr-2" />
                  Limpar Logs
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}
