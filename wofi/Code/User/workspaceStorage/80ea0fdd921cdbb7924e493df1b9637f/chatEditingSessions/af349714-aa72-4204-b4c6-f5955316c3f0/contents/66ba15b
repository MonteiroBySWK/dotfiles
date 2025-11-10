/**
 * HeaderMainPage - Cabeçalho principal do dashboard
 * Sistema REVIS
 * 
 * Design baseado em design.instructions.md
 * Inclui breadcrumbs, pesquisa centralizada com resultados, notificações e perfil
 */

'use client';

import { Bell, Menu, User, LogOut, Settings, UserCircle2, Search, ChevronRight, Package, ShoppingCart, Factory, Calendar, FileText, AlertTriangle, Home } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
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
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';

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
  { name: 'Dashboard', href: '/', icon: Home, description: 'Visão geral do sistema' },
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
 */
export function HeaderMainPage({ 
  title, 
  onMenuClick,
  alertCount = 0,
  breadcrumbs
}: HeaderMainPageProps) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  // Filtrar páginas baseado na pesquisa
  const filteredPages = searchQuery.trim()
    ? searchablePages.filter(page =>
        page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : searchablePages;

  // Fechar resultados ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePageClick = (href: string) => {
    router.push(href);
    setShowResults(false);
    setSearchQuery('');
  };

  return (
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
        <div className="absolute -left-1/2 hidden -translate-x-1/2 md:block" ref={searchRef}>
          <div className="relative">
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <Input
                type="text"
                placeholder="Pesquisar páginas..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
                className="w-2xl pl-9 pr-3 bg-muted/50"
              />
            </div>

            {/* Resultados da Pesquisa */}
            {showResults && (
              <Card className="absolute top-full mt-2 w-80 max-h-96 overflow-y-auto z-50 shadow-lg">
                <div className="p-2">
                  {filteredPages.length > 0 ? (
                    <>
                      <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                        Páginas do Sistema
                      </div>
                      {filteredPages.map((page) => {
                        const Icon = page.icon;
                        return (
                          <button
                            key={page.href}
                            onClick={() => handlePageClick(page.href)}
                            className="w-full flex items-start gap-3 rounded-md px-2 py-2.5 text-left transition-colors hover:bg-accent"
                          >
                            <Icon className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0" aria-hidden="true" />
                            <div className="flex flex-col min-w-0">
                              <span className="text-sm font-medium text-foreground">{page.name}</span>
                              <span className="text-xs text-muted-foreground line-clamp-1">{page.description}</span>
                            </div>
                          </button>
                        );
                      })}
                    </>
                  ) : (
                    <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                      Nenhum resultado encontrado
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Ações do lado direito */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Botão de busca mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => router.push('/alertas')}
            aria-label="Abrir pesquisa"
          >
            <Search className="h-5 w-5" aria-hidden="true" />
          </Button>

          {/* Notificações - Sempre visível */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative transition-all hover:bg-accent"
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
            <DropdownMenuContent align="end" className="w-80">
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
              )}
              
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer justify-center text-xs text-primary hover:bg-primary/10"
                onClick={() => router.push('/alertas')}
              >
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
  );
}
