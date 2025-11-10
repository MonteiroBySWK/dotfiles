/**
 * HeaderMainPage - Cabeçalho principal do dashboard
 * Sistema REVIS
 * 
 * Design baseado em design.instructions.md com cores e padrões atualizados
 * Inclui breadcrumbs, pesquisa centralizada com resultados, notificações e perfil
 */

'use client';

import { Bell, Menu, User, LogOut, Settings, UserCircle2, Search, ChevronRight, Package, ShoppingCart, Factory, Calendar, FileText, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface HeaderMainPageProps {
  title: string;
  onMenuClick?: () => void;
  alertCount?: number;
  breadcrumbs?: Breadcrumb[];
}

// Páginas disponíveis para pesquisa
const searchablePages = [
  { name: 'Dashboard', href: '/', icon: Factory, description: 'Visão geral do sistema' },
  { name: 'Estoque', href: '/estoque', icon: Package, description: 'Gestão de ingredientes e insumos' },
  { name: 'Pedidos', href: '/pedidos', icon: ShoppingCart, description: 'Controle de pedidos a fornecedores' },
  { name: 'Produção', href: '/producao', icon: Factory, description: 'Planejamento e execução de lotes' },
  { name: 'Eventos', href: '/eventos', icon: Calendar, description: 'Cadastro e histórico de eventos' },
  { name: 'Vendas', href: '/vendas', icon: FileText, description: 'Histórico de vendas por evento' },
  { name: 'Relatórios', href: '/relatorios', icon: FileText, description: 'Relatórios e análises' },
  { name: 'Alertas', href: '/alertas', icon: AlertTriangle, description: 'Central de notificações' },
  { name: 'Configurações', href: '/configuracoes', icon: Settings, description: 'Configurações do sistema' },
  { name: 'Perfil', href: '/perfil', icon: UserCircle2, description: 'Meu perfil e preferências' },
];

/**
 * Cabeçalho principal do sistema com navegação, pesquisa e notificações
 * Cores e transições seguem design system oficial
 */
export function HeaderMainPage({ 
  title, 
  onMenuClick,
  alertCount = 0,
  breadcrumbs
}: HeaderMainPageProps) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  // Atalho Ctrl+K / Cmd+K para abrir busca
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <>
      <header className="flex h-16 shrink-0 flex-col border-b border-border bg-card shadow-sm">
        <div className="flex h-full items-center justify-between px-4 md:px-6">
          {/* Menu mobile e Breadcrumbs */}
          <div className="flex items-center gap-4">
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

            {/* Breadcrumbs - Desktop */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <nav aria-label="Breadcrumb" className="hidden lg:flex items-center gap-2 text-sm">
                {breadcrumbs.map((crumb, index) => {
                  const isLast = index === breadcrumbs.length - 1;
                  
                  return (
                    <div key={index} className="flex items-center gap-2">
                      {crumb.href && !isLast ? (
                        <Link
                          href={crumb.href}
                          className="text-muted-foreground transition-colors hover:text-primary"
                        >
                          {crumb.label}
                        </Link>
                      ) : (
                        <span className={cn(
                          isLast ? 'font-medium text-foreground' : 'text-muted-foreground'
                        )}>
                          {crumb.label}
                        </span>
                      )}
                      
                      {!isLast && (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      )}
                    </div>
                  );
                })}
              </nav>
            )}
          </div>

          {/* Barra de Pesquisa - Centralizada */}
          <div className="absolute left-1/2 hidden -translate-x-1/2 md:block">
            <Button
              variant="outline"
              className="w-64 justify-start gap-2 bg-muted/50 text-sm text-muted-foreground hover:bg-muted"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              <span>Pesquisar...</span>
              <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-background px-1.5 text-xs font-medium text-muted-foreground">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
          </div>

          {/* Ações do lado direito */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Botão de busca mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSearchOpen(true)}
              aria-label="Abrir pesquisa"
            >
              <Search className="h-5 w-5" aria-hidden="true" />
            </Button>

            {/* Notificações */}
            {alertCount > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative transition-all hover:bg-accent animate-pulse"
                    aria-label={`${alertCount} notificações não lidas`}
                  >
                    <Bell className="h-5 w-5" aria-hidden="true" />
                    <Badge 
                      variant="destructive" 
                      className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs shadow-md"
                    >
                      {alertCount > 9 ? '9+' : alertCount}
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel className="flex items-center justify-between text-sm font-semibold">
                    <span>Notificações</span>
                    <Badge variant="secondary" className="text-xs">
                      {alertCount}
                    </Badge>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  <div className="max-h-[300px] overflow-y-auto">
                    <DropdownMenuItem 
                      className="cursor-pointer px-4 py-3 transition-colors hover:bg-accent"
                      onClick={() => router.push('/alertas')}
                    >
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-foreground">Estoque baixo</span>
                        <span className="text-xs text-muted-foreground">
                          3 ingredientes abaixo do mínimo
                        </span>
                        <span className="text-xs text-primary">Há 2 horas</span>
                      </div>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem 
                      className="cursor-pointer px-4 py-3 transition-colors hover:bg-accent"
                      onClick={() => router.push('/alertas')}
                    >
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-foreground">Produtos vencendo</span>
                        <span className="text-xs text-muted-foreground">
                          2 produtos vencem em 5 dias
                        </span>
                        <span className="text-xs text-primary">Há 5 horas</span>
                      </div>
                    </DropdownMenuItem>
                  </div>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer justify-center text-xs text-primary hover:bg-primary/10"
                    onClick={() => router.push('/alertas')}
                  >
                    Ver todos os alertas
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

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
              <DropdownMenuContent align="end" className="w-56">
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
                
                <DropdownMenuItem 
                  className="cursor-pointer gap-2 text-sm transition-colors"
                  onClick={() => router.push('/perfil')}
                >
                  <UserCircle2 className="h-4 w-4" aria-hidden="true" />
                  Meu Perfil
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  className="cursor-pointer gap-2 text-sm transition-colors"
                  onClick={() => router.push('/configuracoes')}
                >
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
        </div>
      </header>

      {/* Command Dialog para Pesquisa */}
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Digite para pesquisar páginas..." />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          <CommandGroup heading="Páginas">
            {searchablePages.map((page) => {
              const Icon = page.icon;
              return (
                <CommandItem
                  key={page.href}
                  onSelect={() => {
                    router.push(page.href);
                    setSearchOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <Icon className="mr-2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <div className="flex flex-col">
                    <span className="font-medium">{page.name}</span>
                    <span className="text-xs text-muted-foreground">{page.description}</span>
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

  return (
    <header className="flex h-16 shrink-0 flex-col border-b border-border bg-card shadow-sm">
      <div className="flex h-full items-center justify-between px-4 md:px-6">
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

        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="hidden md:flex items-center gap-2 text-sm">
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              
              return (
                <div key={index} className="flex items-center gap-2">
                  {crumb.href && !isLast ? (
                    <Link
                      href={crumb.href}
                      className="text-muted-foreground transition-colors hover:text-primary"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className={cn(
                      isLast ? 'font-medium text-foreground' : 'text-muted-foreground'
                    )}>
                      {crumb.label}
                    </span>
                  )}
                  
                  {!isLast && (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  )}
                </div>
              );
            })}
          </nav>
        )}

        {/* Barra de Pesquisa */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              type="search"
              placeholder="Pesquisar páginas, produtos, pedidos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 h-9 bg-muted/50 border-muted focus-visible:bg-background transition-colors"
              aria-label="Campo de pesquisa"
            />
          </div>
        </form>

        {/* Ações do lado direito */}
        <div className="flex items-center gap-2 md:gap-3 ml-auto">
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
      </div>
    </header>
  );
}
