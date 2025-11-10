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
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-surface px-4 shadow-sm transition-all duration-200 md:px-6">
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="md:hidden"
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        
        <h1 className="text-xl font-semibold text-foreground md:text-2xl">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Notificações */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label={`${alertCount} notificações não lidas`}
            >
              <Bell className="h-5 w-5" />
              {alertCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full px-1 text-xs"
                >
                  {alertCount > 9 ? '9+' : alertCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel>Notificações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {alertCount === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Nenhuma notificação nova
              </div>
            ) : (
              <>
                <DropdownMenuItem>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">Estoque baixo</span>
                    <span className="text-xs text-muted-foreground">
                      3 ingredientes abaixo do mínimo
                    </span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">Produtos vencendo</span>
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
              aria-label="Menu do usuário"
            >
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Perfil</DropdownMenuItem>
            <DropdownMenuItem>Configurações</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
