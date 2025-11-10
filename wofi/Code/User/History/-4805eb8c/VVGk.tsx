'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { Save, Camera, Key } from 'lucide-react';

export default function PerfilPage() {
  const { user } = useAuth();

  return (
    <DashboardLayout 
      title="Meu Perfil"
      breadcrumbs={[
        { label: 'Início', href: '/' },
        { label: 'Meu Perfil' }
      ]}
    >
      <PageHeader
        title="Meu Perfil"
        subtitle="Gerencie suas informações pessoais e preferências"
      />

      <div className="mt-6 space-y-6">
        {/* Informações do Perfil */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>
              Atualize seus dados pessoais e foto de perfil
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Foto do Perfil */}
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <p className="text-sm font-medium">Foto de perfil</p>
                <Button variant="outline" size="sm" className="gap-2">
                  <Camera className="h-4 w-4" />
                  Alterar Foto
                </Button>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG ou GIF. Máximo 2MB
                </p>
              </div>
            </div>

            {/* Campos do Perfil */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <Input 
                  id="nome" 
                  placeholder="Seu nome completo" 
                  defaultValue="Admin Sistema" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="seu@email.com"
                  defaultValue={user?.email || ''}
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  O e-mail não pode ser alterado
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input 
                  id="telefone" 
                  placeholder="(11) 99999-9999"
                  defaultValue="(11) 98765-4321"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cargo">Cargo</Label>
                <Input 
                  id="cargo" 
                  placeholder="Seu cargo"
                  defaultValue="Administrador do Sistema"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline">Cancelar</Button>
              <Button className="gap-2">
                <Save className="h-4 w-4" />
                Salvar Alterações
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Segurança */}
        <Card>
          <CardHeader>
            <CardTitle>Segurança</CardTitle>
            <CardDescription>
              Gerencie sua senha e configurações de segurança
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="senha-atual">Senha Atual</Label>
              <Input id="senha-atual" type="password" placeholder="••••••••" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="senha-nova">Nova Senha</Label>
                <Input id="senha-nova" type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="senha-confirma">Confirmar Nova Senha</Label>
                <Input id="senha-confirma" type="password" placeholder="••••••••" />
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              A senha deve ter no mínimo 8 caracteres, incluindo letras e números
            </p>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline">Cancelar</Button>
              <Button className="gap-2">
                <Key className="h-4 w-4" />
                Atualizar Senha
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Informações da Conta */}
        <Card>
          <CardHeader>
            <CardTitle>Informações da Conta</CardTitle>
            <CardDescription>
              Detalhes sobre sua conta no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Tipo de Conta</span>
                <Badge variant="default">Administrador</Badge>
              </div>
              <div className="flex items-center justify-between py-2 border-t">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant="default">Ativo</Badge>
              </div>
              <div className="flex items-center justify-between py-2 border-t">
                <span className="text-sm text-muted-foreground">Membro desde</span>
                <span className="text-sm font-medium">Janeiro de 2024</span>
              </div>
              <div className="flex items-center justify-between py-2 border-t">
                <span className="text-sm text-muted-foreground">Último acesso</span>
                <span className="text-sm font-medium">Hoje às 10:30</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
