/**
 * PageHeader - Cabeçalho padronizado para páginas internas
 * Sistema REVIS
 * 
 * Componente reutilizável que segue o design system
 * Suporta título, subtítulo, breadcrumbs e ações
 */

'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  /** Título principal da página */
  title: string;
  /** Subtítulo ou descrição */
  subtitle?: string;
  /** Breadcrumbs de navegação */
  breadcrumbs?: Breadcrumb[];
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
  breadcrumbs,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            
            return (
              <div key={index} className="flex items-center gap-2">
                {crumb.href && !isLast ? (
                  <Link
                    href={crumb.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
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

      {/* Header principal */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {/* Título e subtítulo */}
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-foreground">
            {title}
          </h1>
          
          {subtitle && (
            <p className="text-sm text-muted-foreground max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>

        {/* Ações */}
        {actions && (
          <div className="flex flex-wrap items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
