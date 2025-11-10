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
import { useAlertas } from '@/hooks/useAlertas';
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
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
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
  breadcrumbs
}: HeaderMainPageProps) {
  const { user, signOut } = useAuth();
  const { alertasNaoLidos, loading: loadingAlertas } = useAlertas({ apenasNaoLidos: true });
  const alertCount = alertasNaoLidos.length;
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  // Normalizar texto (remover acentos, converter para minúsculas)
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD') // Decompor caracteres acentuados
      .replace(/[\u0300-\u036f]/g, '') // Remover diacríticos
      .replace(/[^a-z0-9\s]/g, ''); // Remover caracteres especiais
  };

  // Calcular similaridade entre strings (Levenshtein simplificado)
  const calculateSimilarity = (str1: string, str2: string): number => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    // Se shorter está contido em longer, é uma boa correspondência
    if (longer.includes(shorter)) return 0.8;
    
    // Calcular distância de edição simples
    const editDistance = (s1: string, s2: string): number => {
      const costs: number[] = [];
      for (let i = 0; i <= s1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= s2.length; j++) {
          if (i === 0) {
            costs[j] = j;
          } else if (j > 0) {
            let newValue = costs[j - 1];
            if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
              newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
            }
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
        if (i > 0) costs[s2.length] = lastValue;
      }
      return costs[s2.length];
    };
    
    return (longer.length - editDistance(longer, shorter)) / longer.length;
  };

  // Filtrar páginas com busca tolerante
  const filteredPages = searchQuery.trim()
    ? searchablePages
        .map(page => {
          const normalizedQuery = normalizeText(searchQuery);
          const normalizedName = normalizeText(page.name);
          const normalizedDesc = normalizeText(page.description);
          
          // Pontuação: maior é melhor
          let score = 0;
          
          // Match exato tem prioridade máxima
          if (normalizedName.includes(normalizedQuery)) {
            score = 100;
          } else if (normalizedDesc.includes(normalizedQuery)) {
            score = 80;
          } else {
            // Calcular similaridade fuzzy
            const nameSimilarity = calculateSimilarity(normalizedQuery, normalizedName);
            const descSimilarity = calculateSimilarity(normalizedQuery, normalizedDesc);
            score = Math.max(nameSimilarity, descSimilarity) * 70;
          }
          
          return { ...page, score };
        })
        .filter(page => page.score > 30) // Apenas correspondências razoáveis (>30%)
        .sort((a, b) => b.score - a.score) // Ordenar por relevância
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
    setShowMobileSearch(false);
    setSearchQuery('');
  };

  return (
    <header className="flex h-14 md:h-16 shrink-0 flex-col border-b border-border bg-card shadow-sm relative z-40">
      <div className="flex h-full items-center justify-between px-3 md:px-6 gap-2 md:gap-4">
        {/* Menu mobile e Breadcrumbs */}
        <div className="flex items-center gap-2 md:gap-4 min-w-0 shrink-0">
          {onMenuClick && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              className="md:hidden transition-transform hover:scale-105 active:scale-95 shrink-0"
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

        {/* Barra de Pesquisa - Centralizada Desktop (Flexbox) */}
        <div className="hidden lg:flex flex-1 justify-center max-w-2xl mx-auto" ref={searchRef}>
          <div className="relative w-full max-w-md">
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
              <Input
                type="text"
                placeholder="Pesquisar páginas..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
                className="w-full pl-9 pr-3 bg-muted/50"
              />
            </div>

            {/* Resultados da Pesquisa */}
            {showResults && (
              <Card className="absolute top-full mt-2 w-full max-h-96 overflow-y-auto z-50 shadow-2xl border-2">
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
        <div className="flex items-center gap-1 md:gap-3 shrink-0">
          {/* Botão de busca mobile - abre modal */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-9 w-9"
            onClick={() => setShowMobileSearch(true)}
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
                className="relative transition-all hover:bg-accent h-9 w-9"
                aria-label={alertCount > 0 ? `${alertCount} notificações não lidas` : 'Sem notificações'}
              >
                <Bell className="h-5 w-5" aria-hidden="true" />
                {alertCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] md:text-xs shadow-md"
                  >
                    {alertCount > 9 ? '9+' : alertCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[calc(100vw-2rem)] md:w-80 max-w-sm">
              <DropdownMenuLabel className="flex items-center justify-between text-sm font-semibold">
                <span>Notificações</span>
                {alertCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {alertCount}
                  </Badge>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {alertCount === 0 || loadingAlertas ? (
                <div className="px-4 py-8 text-center">
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Bell className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <p className="text-sm font-medium text-foreground">Tudo em ordem!</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {loadingAlertas ? 'Carregando...' : 'Nenhuma notificação nova'}
                  </p>
                </div>
              ) : (
                <div className="max-h-[300px] overflow-y-auto">
                  {alertasNaoLidos.slice(0, 5).map((alerta) => {
                    const horasAtras = Math.floor(
                      (new Date().getTime() - alerta.criadoEm.toDate().getTime()) / (1000 * 60 * 60)
                    );
                    const tempoTexto = horasAtras < 1 
                      ? 'Agora mesmo' 
                      : horasAtras === 1 
                        ? 'Há 1 hora' 
                        : `Há ${horasAtras} horas`;

                    return (
                      <DropdownMenuItem 
                        key={alerta.id}
                        className="cursor-pointer px-4 py-3 transition-colors hover:bg-accent"
                        onClick={() => router.push('/alertas')}
                      >
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-medium text-foreground">{alerta.titulo}</span>
                          <span className="text-xs text-muted-foreground line-clamp-2">
                            {alerta.mensagem}
                          </span>
                          <span className="text-xs text-primary">{tempoTexto}</span>
                        </div>
                      </DropdownMenuItem>
                    );
                  })}
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
                className="transition-all hover:bg-accent h-9 w-9"
                aria-label="Abrir menu de usuário"
              >
                <User className="h-5 w-5" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[calc(100vw-2rem)] md:w-56 max-w-xs">
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

      {/* Modal de Pesquisa Mobile */}
      <Dialog open={showMobileSearch} onOpenChange={setShowMobileSearch}>
        <DialogContent className="top-[10%] translate-y-0 max-w-[calc(100vw-2rem)] p-0">
          <DialogTitle className="sr-only">Pesquisar no sistema</DialogTitle>
          <div className="p-4">
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
              <Input
                type="text"
                placeholder="Pesquisar páginas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full pl-9 pr-3"
              />
            </div>

            <div className="mt-4 max-h-[60vh] overflow-y-auto">
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
                        className="w-full flex items-start gap-3 rounded-md px-2 py-3 text-left transition-colors hover:bg-accent active:bg-accent/80"
                      >
                        <Icon className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0" aria-hidden="true" />
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-medium text-foreground">{page.name}</span>
                          <span className="text-xs text-muted-foreground line-clamp-2">{page.description}</span>
                        </div>
                      </button>
                    );
                  })}
                </>
              ) : (
                <div className="px-2 py-12 text-center text-sm text-muted-foreground">
                  Nenhum resultado encontrado
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
