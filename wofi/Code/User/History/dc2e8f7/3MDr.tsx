'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Monitor, 
  Globe, 
  Database, 
  Key,
  Save,
  RotateCcw,
  Upload,
  Download,
  Trash2,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Laptop,
  Check
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Tipos para configurações
interface UserSettings {
  name: string;
  email: string;
  role: string;
  department: string;
  phone: string;
  bio: string;
  avatar: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  taskUpdates: boolean;
  projectDeadlines: boolean;
  teamMentions: boolean;
  weeklyReports: boolean;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: string;
  passwordExpiry: string;
  loginNotifications: boolean;
}

interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  dateFormat: string;
  compactMode: boolean;
}

interface SystemSettings {
  dataRetention: string;
  backupFrequency: string;
  apiRateLimit: string;
  maintenanceMode: boolean;
}

// Dados iniciais
const initialUserSettings: UserSettings = {
  name: 'João Silva',
  email: 'joao.silva@empresa.com',
  role: 'Gerente de Projeto',
  department: 'Desenvolvimento',
  phone: '+55 11 99999-9999',
  bio: 'Gerente de projetos com 8 anos de experiência em desenvolvimento de software e gestão de equipes ágeis.',
  avatar: ''
};

const initialNotifications: NotificationSettings = {
  emailNotifications: true,
  pushNotifications: true,
  taskUpdates: true,
  projectDeadlines: true,
  teamMentions: true,
  weeklyReports: false
};

const initialSecurity: SecuritySettings = {
  twoFactorAuth: false,
  sessionTimeout: '4',
  passwordExpiry: '90',
  loginNotifications: true
};

const initialAppearance: AppearanceSettings = {
  theme: 'system',
  language: 'pt-BR',
  timezone: 'America/Sao_Paulo',
  dateFormat: 'DD/MM/YYYY',
  compactMode: false
};

const initialSystem: SystemSettings = {
  dataRetention: '365',
  backupFrequency: 'daily',
  apiRateLimit: '1000',
  maintenanceMode: false
};

export default function Config() {
  const [userSettings, setUserSettings] = useState<UserSettings>(initialUserSettings);
  const [notifications, setNotifications] = useState<NotificationSettings>(initialNotifications);
  const [security, setSecurity] = useState<SecuritySettings>(initialSecurity);
  const [appearance, setAppearance] = useState<AppearanceSettings>(initialAppearance);
  const [system, setSystem] = useState<SystemSettings>(initialSystem);
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Handlers
  const handleSave = async () => {
    setIsSaving(true);
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    // Aqui você faria a chamada para a API
    console.log('Configurações salvas:', {
      userSettings,
      notifications,
      security,
      appearance,
      system
    });
  };

  const handleReset = () => {
    setUserSettings(initialUserSettings);
    setNotifications(initialNotifications);
    setSecurity(initialSecurity);
    setAppearance(initialAppearance);
    setSystem(initialSystem);
  };

  const handleExport = () => {
    const config = {
      userSettings,
      notifications,
      security,
      appearance,
      system,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'configuracoes.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Configurações
          </h1>
          <p className="text-muted-foreground">
            Gerencie suas preferências pessoais e configurações do sistema
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Resetar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <div className="h-4 w-4 mr-2 animate-spin border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Salvar
          </Button>
        </div>
      </div>

      <Separator />

      {/* Tabs de Configuração */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid grid-cols-2 sm:grid-cols-5 w-full">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Perfil</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notificações</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Segurança</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Aparência</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Sistema</span>
          </TabsTrigger>
        </TabsList>

        {/* Aba Perfil */}
        <TabsContent value="profile">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>
                  Atualize suas informações de perfil e detalhes pessoais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={userSettings.avatar} />
                    <AvatarFallback className="text-lg">
                      {userSettings.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Alterar Foto
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Recomendado: 300x300px, máximo 2MB
                    </p>
                  </div>
                </div>

                {/* Informações básicas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      value={userSettings.name}
                      onChange={(e) => setUserSettings({...userSettings, name: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userSettings.email}
                      onChange={(e) => setUserSettings({...userSettings, email: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="role">Cargo</Label>
                    <Select value={userSettings.role} onValueChange={(value) => setUserSettings({...userSettings, role: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Gerente de Projeto">Gerente de Projeto</SelectItem>
                        <SelectItem value="Desenvolvedor Senior">Desenvolvedor Senior</SelectItem>
                        <SelectItem value="Desenvolvedor Pleno">Desenvolvedor Pleno</SelectItem>
                        <SelectItem value="Desenvolvedor Junior">Desenvolvedor Junior</SelectItem>
                        <SelectItem value="Designer UX/UI">Designer UX/UI</SelectItem>
                        <SelectItem value="QA Engineer">QA Engineer</SelectItem>
                        <SelectItem value="Product Owner">Product Owner</SelectItem>
                        <SelectItem value="Scrum Master">Scrum Master</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="department">Departamento</Label>
                    <Select value={userSettings.department} onValueChange={(value) => setUserSettings({...userSettings, department: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Desenvolvimento">Desenvolvimento</SelectItem>
                        <SelectItem value="Design">Design</SelectItem>
                        <SelectItem value="Produto">Produto</SelectItem>
                        <SelectItem value="QA">Qualidade</SelectItem>
                        <SelectItem value="DevOps">DevOps</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Vendas">Vendas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={userSettings.phone}
                      onChange={(e) => setUserSettings({...userSettings, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Biografia</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    value={userSettings.bio}
                    onChange={(e) => setUserSettings({...userSettings, bio: e.target.value})}
                    placeholder="Conte um pouco sobre você e sua experiência..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Aba Notificações */}
        <TabsContent value="notifications">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Preferências de Notificação</CardTitle>
                <CardDescription>
                  Configure como e quando você deseja receber notificações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Notificações por E-mail</Label>
                      <p className="text-sm text-muted-foreground">Receber notificações no seu e-mail</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.emailNotifications}
                      onChange={(e) => setNotifications({...notifications, emailNotifications: e.target.checked})}
                      className="rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Notificações Push</Label>
                      <p className="text-sm text-muted-foreground">Receber notificações push no navegador</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.pushNotifications}
                      onChange={(e) => setNotifications({...notifications, pushNotifications: e.target.checked})}
                      className="rounded"
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Atualizações de Tarefas</Label>
                      <p className="text-sm text-muted-foreground">Quando uma tarefa é atualizada ou comentada</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.taskUpdates}
                      onChange={(e) => setNotifications({...notifications, taskUpdates: e.target.checked})}
                      className="rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Prazos de Projetos</Label>
                      <p className="text-sm text-muted-foreground">Lembretes de prazos importantes</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.projectDeadlines}
                      onChange={(e) => setNotifications({...notifications, projectDeadlines: e.target.checked})}
                      className="rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Menções da Equipe</Label>
                      <p className="text-sm text-muted-foreground">Quando você for mencionado em comentários</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.teamMentions}
                      onChange={(e) => setNotifications({...notifications, teamMentions: e.target.checked})}
                      className="rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Relatórios Semanais</Label>
                      <p className="text-sm text-muted-foreground">Resumo semanal de atividades</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.weeklyReports}
                      onChange={(e) => setNotifications({...notifications, weeklyReports: e.target.checked})}
                      className="rounded"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Aba Segurança */}
        <TabsContent value="security">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Segurança da Conta</CardTitle>
                <CardDescription>
                  Configure as opções de segurança para proteger sua conta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Autenticação de Dois Fatores</Label>
                      <p className="text-sm text-muted-foreground">Adicione uma camada extra de segurança</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {security.twoFactorAuth && (
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          <Check className="h-3 w-3 mr-1" />
                          Ativo
                        </Badge>
                      )}
                      <input
                        type="checkbox"
                        checked={security.twoFactorAuth}
                        onChange={(e) => setSecurity({...security, twoFactorAuth: e.target.checked})}
                        className="rounded"
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sessionTimeout">Timeout da Sessão (horas)</Label>
                      <Select value={security.sessionTimeout} onValueChange={(value) => setSecurity({...security, sessionTimeout: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 hora</SelectItem>
                          <SelectItem value="2">2 horas</SelectItem>
                          <SelectItem value="4">4 horas</SelectItem>
                          <SelectItem value="8">8 horas</SelectItem>
                          <SelectItem value="24">24 horas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="passwordExpiry">Expiração da Senha (dias)</Label>
                      <Select value={security.passwordExpiry} onValueChange={(value) => setSecurity({...security, passwordExpiry: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 dias</SelectItem>
                          <SelectItem value="60">60 dias</SelectItem>
                          <SelectItem value="90">90 dias</SelectItem>
                          <SelectItem value="180">180 dias</SelectItem>
                          <SelectItem value="365">1 ano</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Notificações de Login</Label>
                      <p className="text-sm text-muted-foreground">Receber alertas sobre novos logins</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={security.loginNotifications}
                      onChange={(e) => setSecurity({...security, loginNotifications: e.target.checked})}
                      className="rounded"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Alterar Senha</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="currentPassword">Senha Atual</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="Digite sua senha atual"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="newPassword">Nova Senha</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="Digite a nova senha"
                      />
                    </div>
                  </div>
                  
                  <Button>
                    <Key className="h-4 w-4 mr-2" />
                    Alterar Senha
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Aba Aparência */}
        <TabsContent value="appearance">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Preferências de Aparência</CardTitle>
                <CardDescription>
                  Personalize a aparência e o comportamento da interface
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Tema</Label>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      <Button
                        variant={appearance.theme === 'light' ? 'default' : 'outline'}
                        className="justify-start"
                        onClick={() => setAppearance({...appearance, theme: 'light'})}
                      >
                        <Sun className="h-4 w-4 mr-2" />
                        Claro
                      </Button>
                      <Button
                        variant={appearance.theme === 'dark' ? 'default' : 'outline'}
                        className="justify-start"
                        onClick={() => setAppearance({...appearance, theme: 'dark'})}
                      >
                        <Moon className="h-4 w-4 mr-2" />
                        Escuro
                      </Button>
                      <Button
                        variant={appearance.theme === 'system' ? 'default' : 'outline'}
                        className="justify-start"
                        onClick={() => setAppearance({...appearance, theme: 'system'})}
                      >
                        <Laptop className="h-4 w-4 mr-2" />
                        Sistema
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="language">Idioma</Label>
                      <Select value={appearance.language} onValueChange={(value) => setAppearance({...appearance, language: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                          <SelectItem value="en-US">English (US)</SelectItem>
                          <SelectItem value="es-ES">Español</SelectItem>
                          <SelectItem value="fr-FR">Français</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="timezone">Fuso Horário</Label>
                      <Select value={appearance.timezone} onValueChange={(value) => setAppearance({...appearance, timezone: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/Sao_Paulo">São Paulo (UTC-3)</SelectItem>
                          <SelectItem value="America/New_York">New York (UTC-5)</SelectItem>
                          <SelectItem value="Europe/London">London (UTC+0)</SelectItem>
                          <SelectItem value="Asia/Tokyo">Tokyo (UTC+9)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="dateFormat">Formato de Data</Label>
                      <Select value={appearance.dateFormat} onValueChange={(value) => setAppearance({...appearance, dateFormat: value})}>
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
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Modo Compacto</Label>
                      <p className="text-sm text-muted-foreground">Interface mais densa com menos espaçamento</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={appearance.compactMode}
                      onChange={(e) => setAppearance({...appearance, compactMode: e.target.checked})}
                      className="rounded"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Aba Sistema */}
        <TabsContent value="system">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Configurações do Sistema
                </CardTitle>
                <CardDescription>
                  Configurações avançadas do sistema e administração
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dataRetention">Retenção de Dados (dias)</Label>
                    <Select value={system.dataRetention} onValueChange={(value) => setSystem({...system, dataRetention: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="90">90 dias</SelectItem>
                        <SelectItem value="180">180 dias</SelectItem>
                        <SelectItem value="365">1 ano</SelectItem>
                        <SelectItem value="730">2 anos</SelectItem>
                        <SelectItem value="-1">Indefinido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="backupFrequency">Frequência de Backup</Label>
                    <Select value={system.backupFrequency} onValueChange={(value) => setSystem({...system, backupFrequency: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">A cada hora</SelectItem>
                        <SelectItem value="daily">Diário</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="monthly">Mensal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="apiRateLimit">Limite de API (req/min)</Label>
                    <Input
                      id="apiRateLimit"
                      value={system.apiRateLimit}
                      onChange={(e) => setSystem({...system, apiRateLimit: e.target.value})}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Modo de Manutenção</Label>
                    <p className="text-sm text-muted-foreground">Ativar para manutenção do sistema</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={system.maintenanceMode}
                    onChange={(e) => setSystem({...system, maintenanceMode: e.target.checked})}
                    className="rounded"
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h4 className="font-medium text-destructive">Zona de Perigo</h4>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button variant="destructive" className="flex-1">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Limpar Cache do Sistema
                    </Button>
                    <Button variant="destructive" className="flex-1">
                      <Database className="h-4 w-4 mr-2" />
                      Resetar Configurações
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
