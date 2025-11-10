/**
 * HeaderMainPage - Cabeçalho principal do dashboard
 * Sistema REVIS
 * 
 * Design baseado em design.instructions.md com cores e padrões atualizados
 */

'use client';

import { Bell, Menu, User, LogOut, Settings, UserCircle2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface HeaderMainPageProps {
  title: string;
  onMenuClick?: () => void;
  alertCount?: number;
}

/**
 * Cabeçalho principal do sistema com navegação e notificações
 * Cores e transições seguem design system oficial
 */
export function HeaderMainPage({ 
  title, 
  onMenuClick,
  alertCount = 0 
}: HeaderMainPageProps) {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-4 py-3 shadow-sm md:px-6">
      <div className="flex items-center gap-4">
        {/* Menu mobile */}
        {onMenuClick && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="md:hidden transition-transform hover:scale-105 active:scale-95"
            aria-label="Abrir menu de navegação"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </Button>
        )}
        
        {/* Título da página */}
        <h1 className="text-xl font-semibold text-foreground md:text-2xl">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {/* Notificações */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'relative transition-all hover:bg-accent',
                alertCount > 0 && 'animate-pulse'
              )}
              aria-label={alertCount > 0 ? `${alertCount} notificações não lidas` : 'Sem notificações'}
            >
              <Bell className="h-5 w-5" aria-hidden="true" />
              {alertCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs shadow-md"
                >
                  {alertCount > 9 ? '9+' : alertCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 animate-slide-up">
            <DropdownMenuLabel className="flex items-center justify-between text-sm font-semibold">
              <span>Notificações</span>
              {alertCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {alertCount}
                </Badge>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {alertCount === 0 ? (
              <div className="px-4 py-8 text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Bell className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
                </div>
                <p className="text-sm font-medium text-foreground">Tudo em ordem!</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Nenhuma notificação nova
                </p>
              </div>
            ) : (
              <div className="max-h-[300px] overflow-y-auto">
                <DropdownMenuItem className="cursor-pointer px-4 py-3 transition-colors hover:bg-accent">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-foreground">Estoque baixo</span>
                    <span className="text-xs text-muted-foreground">
                      3 ingredientes abaixo do mínimo
                    </span>
                    <span className="text-xs text-primary">Há 2 horas</span>
                  </div>
                </DropdownMenuItem>
                
                <DropdownMenuItem className="cursor-pointer px-4 py-3 transition-colors hover:bg-accent">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-foreground">Produtos vencendo</span>
                    <span className="text-xs text-muted-foreground">
                      2 produtos vencem em 5 dias
                    </span>
                    <span className="text-xs text-primary">Há 5 horas</span>
                  </div>
                </DropdownMenuItem>
              </div>
            )}
            
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer justify-center text-xs text-primary hover:bg-primary/10">
              Ver todos os alertas
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Perfil do usuário */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="transition-all hover:bg-accent"
              aria-label="Abrir menu de usuário"
            >
              <User className="h-5 w-5" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 animate-slide-up">
            <DropdownMenuLabel className="text-sm">
              <div className="flex flex-col space-y-1">
                <p className="font-semibold text-foreground">Minha Conta</p>
                {user?.email && (
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem className="cursor-pointer gap-2 text-sm transition-colors">
              <UserCircle2 className="h-4 w-4" aria-hidden="true" />
              Perfil
            </DropdownMenuItem>
            
            <DropdownMenuItem className="cursor-pointer gap-2 text-sm transition-colors">
              <Settings className="h-4 w-4" aria-hidden="true" />
              Configurações
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              className="cursor-pointer gap-2 text-sm text-destructive transition-colors hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sair do Sistema
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
