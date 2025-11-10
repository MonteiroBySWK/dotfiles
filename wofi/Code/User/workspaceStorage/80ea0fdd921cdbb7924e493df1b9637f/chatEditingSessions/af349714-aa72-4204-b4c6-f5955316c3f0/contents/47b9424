/**
 * PageHeader - Cabeçalho padronizado para páginas internas
 * Sistema REVIS
 * 
 * Componente reutilizável que segue o design system
 * Suporta título, subtítulo e ações
 * 
 * Nota: Breadcrumbs foram movidos para o HeaderMainPage no topo
 */

'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  /** Título principal da página */
  title: string;
  /** Subtítulo ou descrição */
  subtitle?: string;
  /** Ações no lado direito do header (botões, filtros, etc) */
  actions?: ReactNode;
  /** Classe adicional para customização */
  className?: string;
}

/**
 * Header padronizado para todas as páginas do sistema
 * Segue hierarquia tipográfica do design system
 */
export function PageHeader({
  title,
  subtitle,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-3 md:gap-4 sm:flex-row sm:items-start sm:justify-between', className)}>
      {/* Título e subtítulo */}
      <div className="space-y-1 min-w-0 flex-1">
        <h1 className="text-xl md:text-2xl font-semibold text-foreground truncate">
          {title}
        </h1>
        
        {subtitle && (
          <p className="text-xs md:text-sm text-muted-foreground max-w-2xl line-clamp-2">
            {subtitle}
          </p>
        )}
      </div>

      {/* Ações */}
      {actions && (
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}
