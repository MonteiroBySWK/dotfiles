/**/**

 * HeaderMainPage - Cabeçalho principal do dashboard * HeaderMainPage - Cabeçalho principal do dashboard

 * Sistema REVIS * Sistema REVIS

 *  * 

 * Design baseado em design.instructions.md * Design baseado em design.instructions.md

 * Inclui breadcrumbs, pesquisa centralizada com resultados, notificações e perfil * Inclui breadcrumbs, pesquisa centralizada com resultados, notificações e perfil

 */ */



'use client';'use client';



import { Bell, Menu, User, LogOut, Settings, UserCircle2, Search, ChevronRight, Package, ShoppingCart, Factory, Calendar, FileText, AlertTriangle, Home } from 'lucide-react';import { Bell, Menu, User, LogOut, Settings, UserCircle2, Search, ChevronRight, Package, ShoppingCart, Factory, Calendar, FileText, AlertTriangle, Home } from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';import { useAuth } from '@/hooks/useAuth';

import { useRouter } from 'next/navigation';import { useRouter } from 'next/navigation';

import Link from 'next/link';import Link from 'next/link';

import { Button } from '@/components/ui/button';import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';import { Input } from '@/components/ui/input';

import {import {

  DropdownMenu,  DropdownMenu,

  DropdownMenuContent,  DropdownMenuContent,

  DropdownMenuItem,  DropdownMenuItem,

  DropdownMenuLabel,  DropdownMenuLabel,

  DropdownMenuSeparator,  DropdownMenuSeparator,

  DropdownMenuTrigger,  DropdownMenuTrigger,

} from '@/components/ui/dropdown-menu';} from '@/components/ui/dropdown-menu';

import { Badge } from '@/components/ui/badge';import { Badge } from '@/components/ui/badge';

import { Card } from '@/components/ui/card';import { Card } from '@/components/ui/card';

import { cn } from '@/lib/utils';import { cn } from '@/lib/utils';

import { useState, useRef, useEffect } from 'react';import { useState, useRef, useEffect } from 'react';



interface Breadcrumb {interface Breadcrumb {

  label: string;  label: string;

  href?: string;  href?: string;

}}



interface HeaderMainPageProps {interface HeaderMainPageProps {

  title: string;  title: string;

  onMenuClick?: () => void;  onMenuClick?: () => void;

  alertCount?: number;  alertCount?: number;

  breadcrumbs?: Breadcrumb[];  breadcrumbs?: Breadcrumb[];

}}



// Páginas disponíveis para pesquisa// Páginas disponíveis para pesquisa

const searchablePages = [const searchablePages = [

  { name: 'Dashboard', href: '/', icon: Home, description: 'Visão geral do sistema' },  { name: 'Dashboard', href: '/', icon: Home, description: 'Visão geral do sistema' },

  { name: 'Estoque', href: '/estoque', icon: Package, description: 'Gestão de ingredientes e insumos' },  { name: 'Estoque', href: '/estoque', icon: Package, description: 'Gestão de ingredientes e insumos' },

  { name: 'Pedidos', href: '/pedidos', icon: ShoppingCart, description: 'Controle de pedidos a fornecedores' },  { name: 'Pedidos', href: '/pedidos', icon: ShoppingCart, description: 'Controle de pedidos a fornecedores' },

  { name: 'Produção', href: '/producao', icon: Factory, description: 'Planejamento e execução de lotes' },  { name: 'Produção', href: '/producao', icon: Factory, description: 'Planejamento e execução de lotes' },

  { name: 'Eventos', href: '/eventos', icon: Calendar, description: 'Cadastro e histórico de eventos' },  { name: 'Eventos', href: '/eventos', icon: Calendar, description: 'Cadastro e histórico de eventos' },

  { name: 'Vendas', href: '/vendas', icon: FileText, description: 'Histórico de vendas por evento' },  { name: 'Vendas', href: '/vendas', icon: FileText, description: 'Histórico de vendas por evento' },

  { name: 'Relatórios', href: '/relatorios', icon: FileText, description: 'Relatórios e análises' },  { name: 'Relatórios', href: '/relatorios', icon: FileText, description: 'Relatórios e análises' },

  { name: 'Alertas', href: '/alertas', icon: AlertTriangle, description: 'Central de notificações' },  { name: 'Alertas', href: '/alertas', icon: AlertTriangle, description: 'Central de notificações' },

  { name: 'Configurações', href: '/configuracoes', icon: Settings, description: 'Configurações do sistema' },  { name: 'Configurações', href: '/configuracoes', icon: Settings, description: 'Configurações do sistema' },

  { name: 'Perfil', href: '/perfil', icon: UserCircle2, description: 'Meu perfil e preferências' },  { name: 'Perfil', href: '/perfil', icon: UserCircle2, description: 'Meu perfil e preferências' },

];];



/**/**

 * Cabeçalho principal do sistema com navegação, pesquisa e notificações * Cabeçalho principal do sistema com navegação, pesquisa e notificações

 */ */

export function HeaderMainPage({ export function HeaderMainPage({ 

  title,   title, 

  onMenuClick,  onMenuClick,

  alertCount = 0,  alertCount = 0,

  breadcrumbs  breadcrumbs

}: HeaderMainPageProps) {}: HeaderMainPageProps) {

  const { user, signOut } = useAuth();  const { user, signOut } = useAuth();

  const router = useRouter();  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');  const [searchQuery, setSearchQuery] = useState('');

  const [showResults, setShowResults] = useState(false);  const [showResults, setShowResults] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);  const searchRef = useRef<HTMLDivElement>(null);



  const handleSignOut = async () => {  const handleSignOut = async () => {

    await signOut();    await signOut();

    router.push('/login');    router.push('/login');

  };  };



  // Filtrar páginas baseado na pesquisa  // Filtrar páginas baseado na pesquisa

  const filteredPages = searchQuery.trim()  const filteredPages = searchQuery.trim()

    ? searchablePages.filter(page =>    ? searchablePages.filter(page =>

        page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||        page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||

        page.description.toLowerCase().includes(searchQuery.toLowerCase())        page.description.toLowerCase().includes(searchQuery.toLowerCase())

      )      )

    : searchablePages;    : searchablePages;



  // Fechar resultados ao clicar fora  // Fechar resultados ao clicar fora

  useEffect(() => {  useEffect(() => {

    const handleClickOutside = (event: MouseEvent) => {    const handleClickOutside = (event: MouseEvent) => {

      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {

        setShowResults(false);        setShowResults(false);

      }      }

    };    };



    document.addEventListener('mousedown', handleClickOutside);    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);    return () => document.removeEventListener('mousedown', handleClickOutside);

  }, []);  }, []);



  const handlePageClick = (href: string) => {  const handlePageClick = (href: string) => {

    router.push(href);    router.push(href);

    setShowResults(false);    setShowResults(false);

    setSearchQuery('');    setSearchQuery('');

  };  };



  return (  return (

    <header className="flex h-16 shrink-0 flex-col border-b border-border bg-card shadow-sm">    <header className="flex h-16 shrink-0 flex-col border-b border-border bg-card shadow-sm">

      <div className="flex h-full items-center justify-between px-4 md:px-6">      <div className="flex h-full items-center justify-between px-4 md:px-6">

        {/* Menu mobile e Breadcrumbs */}        {/* Menu mobile e Breadcrumbs */}

        <div className="flex items-center gap-4">        <div className="flex items-center gap-4">

          {onMenuClick && (          {onMenuClick && (

            <Button            <Button

              variant="ghost"              variant="ghost"

              size="icon"              size="icon"

              onClick={onMenuClick}              onClick={onMenuClick}

              className="md:hidden transition-transform hover:scale-105 active:scale-95"              className="md:hidden transition-transform hover:scale-105 active:scale-95"

              aria-label="Abrir menu de navegação"              aria-label="Abrir menu de navegação"

            >            >

              <Menu className="h-5 w-5" aria-hidden="true" />              <Menu className="h-5 w-5" aria-hidden="true" />

            </Button>            </Button>

          )}          )}



          {/* Breadcrumbs - Desktop */}          {/* Breadcrumbs - Desktop */}

          {breadcrumbs && breadcrumbs.length > 0 && (          {breadcrumbs && breadcrumbs.length > 0 && (

            <nav aria-label="Breadcrumb" className="hidden lg:flex items-center gap-2 text-sm">            <nav aria-label="Breadcrumb" className="hidden lg:flex items-center gap-2 text-sm">

              {breadcrumbs.map((crumb, index) => {              {breadcrumbs.map((crumb, index) => {

                const isLast = index === breadcrumbs.length - 1;                const isLast = index === breadcrumbs.length - 1;

                                

                return (                return (

                  <div key={index} className="flex items-center gap-2">                  <div key={index} className="flex items-center gap-2">

                    {crumb.href && !isLast ? (                    {crumb.href && !isLast ? (

                      <Link                      <Link

                        href={crumb.href}                        href={crumb.href}

                        className="text-muted-foreground transition-colors hover:text-primary"                        className="text-muted-foreground transition-colors hover:text-primary"

                      >                      >

                        {crumb.label}                        {crumb.label}

                      </Link>                      </Link>

                    ) : (                    ) : (

                      <span className={cn(                      <span className={cn(

                        isLast ? 'font-medium text-foreground' : 'text-muted-foreground'                        isLast ? 'font-medium text-foreground' : 'text-muted-foreground'

                      )}>                      )}>

                        {crumb.label}                        {crumb.label}

                      </span>                      </span>

                    )}                    )}

                                        

                    {!isLast && (                    {!isLast && (

                      <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />                      <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />

                    )}                    )}

                  </div>                  </div>

                );                );

              })}              })}

            </nav>            </nav>

          )}          )}

        </div>        </div>



        {/* Barra de Pesquisa - Centralizada */}        {/* Barra de Pesquisa - Centralizada */}

        <div className="absolute left-1/2 hidden -translate-x-1/2 md:block" ref={searchRef}>        <div className="absolute left-1/2 hidden -translate-x-1/2 md:block" ref={searchRef}>

          <div className="relative">          <div className="relative">

            <div className="relative flex items-center">            <div className="relative flex items-center">

              <Search className="absolute left-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />              <Search className="absolute left-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />

              <Input              <Input

                type="text"                type="text"

                placeholder="Pesquisar páginas..."                placeholder="Pesquisar páginas..."

                value={searchQuery}                value={searchQuery}

                onChange={(e) => {                onChange={(e) => {

                  setSearchQuery(e.target.value);                  setSearchQuery(e.target.value);

                  setShowResults(true);                  setShowResults(true);

                }}                }}

                onFocus={() => setShowResults(true)}                onFocus={() => setShowResults(true)}

                className="w-64 pl-9 pr-3 bg-muted/50"                className="w-64 pl-9 pr-3 bg-muted/50"

              />              />

            </div>            </div>



            {/* Resultados da Pesquisa */}            {/* Resultados da Pesquisa */}

            {showResults && (            {showResults && (

              <Card className="absolute top-full mt-2 w-80 max-h-96 overflow-y-auto z-50 shadow-lg">              <Card className="absolute top-full mt-2 w-80 max-h-96 overflow-y-auto z-50 shadow-lg">

                <div className="p-2">                <div className="p-2">

                  {filteredPages.length > 0 ? (                  {filteredPages.length > 0 ? (

                    <>                    <>

                      <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">                      <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">

                        Páginas do Sistema                        Páginas do Sistema

                      </div>                      </div>

                      {filteredPages.map((page) => {                      {filteredPages.map((page) => {

                        const Icon = page.icon;                        const Icon = page.icon;

                        return (                        return (

                          <button                          <button

                            key={page.href}                            key={page.href}

                            onClick={() => handlePageClick(page.href)}                            onClick={() => handlePageClick(page.href)}

                            className="w-full flex items-start gap-3 rounded-md px-2 py-2.5 text-left transition-colors hover:bg-accent"                            className="w-full flex items-start gap-3 rounded-md px-2 py-2.5 text-left transition-colors hover:bg-accent"

                          >                          >

                            <Icon className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0" aria-hidden="true" />                            <Icon className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0" aria-hidden="true" />

                            <div className="flex flex-col min-w-0">                            <div className="flex flex-col min-w-0">

                              <span className="text-sm font-medium text-foreground">{page.name}</span>                              <span className="text-sm font-medium text-foreground">{page.name}</span>

                              <span className="text-xs text-muted-foreground line-clamp-1">{page.description}</span>                              <span className="text-xs text-muted-foreground line-clamp-1">{page.description}</span>

                            </div>                            </div>

                          </button>                          </button>

                        );                        );

                      })}                      })}

                    </>                    </>

                  ) : (                  ) : (

                    <div className="px-2 py-6 text-center text-sm text-muted-foreground">                    <div className="px-2 py-6 text-center text-sm text-muted-foreground">

                      Nenhum resultado encontrado                      Nenhum resultado encontrado

                    </div>                    </div>

                  )}                  )}

                </div>                </div>

              </Card>              </Card>

            )}            )}

          </div>          </div>

        </div>        </div>



        {/* Ações do lado direito */}        {/* Ações do lado direito */}

        <div className="flex items-center gap-2 md:gap-3">        <div className="flex items-center gap-2 md:gap-3">

          {/* Botão de busca mobile */}          {/* Botão de busca mobile */}

          <Button          <Button

            variant="ghost"            variant="ghost"

            size="icon"            size="icon"

            className="md:hidden"            className="md:hidden"

            onClick={() => router.push('/alertas')}            onClick={() => router.push('/alertas')}

            aria-label="Abrir pesquisa"            aria-label="Abrir pesquisa"

          >          >

            <Search className="h-5 w-5" aria-hidden="true" />            <Search className="h-5 w-5" aria-hidden="true" />

          </Button>          </Button>



          {/* Notificações */}          {/* Notificações */}

          {alertCount > 0 && (          {alertCount > 0 && (

            <DropdownMenu>            <DropdownMenu>

              <DropdownMenuTrigger asChild>              <DropdownMenuTrigger asChild>

                <Button                <Button

                  variant="ghost"                  variant="ghost"

                  size="icon"                  size="icon"

                  className="relative transition-all hover:bg-accent"                  className="relative transition-all hover:bg-accent"

                  aria-label={`${alertCount} notificações não lidas`}                  aria-label={`${alertCount} notificações não lidas`}

                >                >

                  <Bell className="h-5 w-5" aria-hidden="true" />                  <Bell className="h-5 w-5" aria-hidden="true" />

                  <Badge                   <Badge 

                    variant="destructive"                     variant="destructive" 

                    className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs shadow-md"                    className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs shadow-md"

                  >                  >

                    {alertCount > 9 ? '9+' : alertCount}                    {alertCount > 9 ? '9+' : alertCount}

                  </Badge>                  </Badge>

                </Button>                </Button>

              </DropdownMenuTrigger>              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-80">              <DropdownMenuContent align="end" className="w-80">

                <DropdownMenuLabel className="flex items-center justify-between text-sm font-semibold">                <DropdownMenuLabel className="flex items-center justify-between text-sm font-semibold">

                  <span>Notificações</span>                  <span>Notificações</span>

                  <Badge variant="secondary" className="text-xs">                  <Badge variant="secondary" className="text-xs">

                    {alertCount}                    {alertCount}

                  </Badge>                  </Badge>

                </DropdownMenuLabel>                </DropdownMenuLabel>

                <DropdownMenuSeparator />                <DropdownMenuSeparator />

                                

                <div className="max-h-[300px] overflow-y-auto">                <div className="max-h-[300px] overflow-y-auto">

                  <DropdownMenuItem                   <DropdownMenuItem 

                    className="cursor-pointer px-4 py-3 transition-colors hover:bg-accent"                    className="cursor-pointer px-4 py-3 transition-colors hover:bg-accent"

                    onClick={() => router.push('/alertas')}                    onClick={() => router.push('/alertas')}

                  >                  >

                    <div className="flex flex-col gap-1">                    <div className="flex flex-col gap-1">

                      <span className="text-sm font-medium text-foreground">Estoque baixo</span>                      <span className="text-sm font-medium text-foreground">Estoque baixo</span>

                      <span className="text-xs text-muted-foreground">                      <span className="text-xs text-muted-foreground">

                        3 ingredientes abaixo do mínimo                        3 ingredientes abaixo do mínimo

                      </span>                      </span>

                      <span className="text-xs text-primary">Há 2 horas</span>                      <span className="text-xs text-primary">Há 2 horas</span>

                    </div>                    </div>

                  </DropdownMenuItem>                  </DropdownMenuItem>

                                    

                  <DropdownMenuItem                   <DropdownMenuItem 

                    className="cursor-pointer px-4 py-3 transition-colors hover:bg-accent"                    className="cursor-pointer px-4 py-3 transition-colors hover:bg-accent"

                    onClick={() => router.push('/alertas')}                    onClick={() => router.push('/alertas')}

                  >                  >

                    <div className="flex flex-col gap-1">                    <div className="flex flex-col gap-1">

                      <span className="text-sm font-medium text-foreground">Produtos vencendo</span>                      <span className="text-sm font-medium text-foreground">Produtos vencendo</span>

                      <span className="text-xs text-muted-foreground">                      <span className="text-xs text-muted-foreground">

                        2 produtos vencem em 5 dias                        2 produtos vencem em 5 dias

                      </span>                      </span>

                      <span className="text-xs text-primary">Há 5 horas</span>                      <span className="text-xs text-primary">Há 5 horas</span>

                    </div>                    </div>

                  </DropdownMenuItem>                  </DropdownMenuItem>

                </div>                </div>

                                

                <DropdownMenuSeparator />                <DropdownMenuSeparator />

                <DropdownMenuItem                 <DropdownMenuItem 

                  className="cursor-pointer justify-center text-xs text-primary hover:bg-primary/10"                  className="cursor-pointer justify-center text-xs text-primary hover:bg-primary/10"

                  onClick={() => router.push('/alertas')}                  onClick={() => router.push('/alertas')}

                >                >

                  Ver todos os alertas                  Ver todos os alertas

                </DropdownMenuItem>                </DropdownMenuItem>

              </DropdownMenuContent>              </DropdownMenuContent>

            </DropdownMenu>            </DropdownMenu>

          )}          )}



          {/* Perfil do usuário */}          {/* Perfil do usuário */}

          <DropdownMenu>          <DropdownMenu>

            <DropdownMenuTrigger asChild>            <DropdownMenuTrigger asChild>

              <Button              <Button

                variant="ghost"                variant="ghost"

                size="icon"                size="icon"

                className="transition-all hover:bg-accent"                className="transition-all hover:bg-accent"

                aria-label="Abrir menu de usuário"                aria-label="Abrir menu de usuário"

              >              >

                <User className="h-5 w-5" aria-hidden="true" />                <User className="h-5 w-5" aria-hidden="true" />

              </Button>              </Button>

            </DropdownMenuTrigger>            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">            <DropdownMenuContent align="end" className="w-56">

              <DropdownMenuLabel className="text-sm">              <DropdownMenuLabel className="text-sm">

                <div className="flex flex-col space-y-1">                <div className="flex flex-col space-y-1">

                  <p className="font-semibold text-foreground">Minha Conta</p>                  <p className="font-semibold text-foreground">Minha Conta</p>

                  {user?.email && (                  {user?.email && (

                    <p className="text-xs text-muted-foreground truncate">                    <p className="text-xs text-muted-foreground truncate">

                      {user.email}                      {user.email}

                    </p>                    </p>

                  )}                  )}

                </div>                </div>

              </DropdownMenuLabel>              </DropdownMenuLabel>

              <DropdownMenuSeparator />              <DropdownMenuSeparator />

                            

              <DropdownMenuItem               <DropdownMenuItem 

                className="cursor-pointer gap-2 text-sm transition-colors"                className="cursor-pointer gap-2 text-sm transition-colors"

                onClick={() => router.push('/perfil')}                onClick={() => router.push('/perfil')}

              >              >

                <UserCircle2 className="h-4 w-4" aria-hidden="true" />                <UserCircle2 className="h-4 w-4" aria-hidden="true" />

                Meu Perfil                Meu Perfil

              </DropdownMenuItem>              </DropdownMenuItem>

                            

              <DropdownMenuItem               <DropdownMenuItem 

                className="cursor-pointer gap-2 text-sm transition-colors"                className="cursor-pointer gap-2 text-sm transition-colors"

                onClick={() => router.push('/configuracoes')}                onClick={() => router.push('/configuracoes')}

              >              >

                <Settings className="h-4 w-4" aria-hidden="true" />                <Settings className="h-4 w-4" aria-hidden="true" />

                Configurações                Configurações

              </DropdownMenuItem>              </DropdownMenuItem>

                            

              <DropdownMenuSeparator />              <DropdownMenuSeparator />

                            

              <DropdownMenuItem               <DropdownMenuItem 

                className="cursor-pointer gap-2 text-sm text-destructive transition-colors hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive"                className="cursor-pointer gap-2 text-sm text-destructive transition-colors hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive"

                onClick={handleSignOut}                onClick={handleSignOut}

              >              >

                <LogOut className="h-4 w-4" aria-hidden="true" />                <LogOut className="h-4 w-4" aria-hidden="true" />

                Sair do Sistema                Sair do Sistema

              </DropdownMenuItem>              </DropdownMenuItem>

            </DropdownMenuContent>            </DropdownMenuContent>

          </DropdownMenu>          </DropdownMenu>

        </div>        </div>

      </div>      </div>

    </header>    </header>

  );  );

}}


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
