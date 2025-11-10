/**
 * TableContainer - Container padrão para tabelas
 * Sistema REVIS
 */

import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TableContainerProps {
  children: ReactNode;
  /** Filtros e busca */
  filters?: ReactNode;
  /** Remove padding interno */
  noPadding?: boolean;
  className?: string;
}

export function TableContainer({
  children,
  filters,
  noPadding = false,
  className,
}: TableContainerProps) {
  return (
    <Card className={cn('shadow-sm', className)}>
      <CardContent className={cn(noPadding ? 'p-0' : 'pt-6')}>
        {filters && (
          <div className={cn('mb-4', noPadding && 'px-6 pt-6')}>
            {filters}
          </div>
        )}
        
        {/* Wrapper com scroll horizontal mobile */}
        <div className={cn(
          'overflow-x-auto',
          noPadding ? 'px-0' : '-mx-6 px-6 md:mx-0 md:px-0'
        )}>
          <div className="min-w-[640px]">
            {children}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
