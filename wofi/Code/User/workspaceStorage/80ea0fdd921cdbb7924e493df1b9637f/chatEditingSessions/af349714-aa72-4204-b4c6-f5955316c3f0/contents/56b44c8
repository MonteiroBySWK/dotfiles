/**
 * HeaderMainPage - Cabeçalho principal do dashboard
 * Sistema REVIS
 */

import { Bell, Menu, User } from 'lucide-react';
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

interface HeaderMainPageProps {
  title: string;
  onMenuClick?: () => void;
  alertCount?: number;
}

/**
 * Cabeçalho principal do sistema com navegação e notificações
 * Seguindo design.instructions.md - Seção 10 (Exemplo Padrão)
 * 
 * @param title - Título da página atual
 * @param onMenuClick - Callback para abrir/fechar sidebar em mobile
 * @param alertCount - Número de alertas não lidos
 */
export function HeaderMainPage({ 
  title, 
  onMenuClick,
  alertCount = 0 
}: HeaderMainPageProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6 py-4">
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="md:hidden"
            aria-label="Abrir menu de navegação"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </Button>
        )}
        
        <h1 className="text-2xl font-semibold text-foreground">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Notificações */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label={alertCount > 0 ? `${alertCount} notificações não lidas` : 'Sem notificações'}
            >
              <Bell className="h-5 w-5" aria-hidden="true" />
              {alertCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs"
                >
                  {alertCount > 9 ? '9+' : alertCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="text-sm font-semibold">
              Notificações
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {alertCount === 0 ? (
              <div className="px-4 py-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Nenhuma notificação nova
                </p>
              </div>
            ) : (
              <>
                <DropdownMenuItem className="cursor-pointer px-4 py-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-foreground">Estoque baixo</span>
                    <span className="text-xs text-muted-foreground">
                      3 ingredientes abaixo do mínimo
                    </span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer px-4 py-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-foreground">Produtos vencendo</span>
                    <span className="text-xs text-muted-foreground">
                      2 produtos vencem em 5 dias
                    </span>
                  </div>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Perfil do usuário */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Abrir menu de usuário"
            >
              <User className="h-5 w-5" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-sm font-semibold">
              Minha Conta
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-sm">
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-sm">
              Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-sm text-destructive">
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
