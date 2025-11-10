/**
 * PublicLayout - Layout para páginas públicas (sem sidebar)
 * Sistema REVIS
 * 
 * Usado em: Login, Acesso Negado, etc.
 */

'use client';

import { ReactNode } from 'react';

interface PublicLayoutProps {
  children: ReactNode;
  /** Adiciona gradiente de fundo decorativo */
  withGradient?: boolean;
  /** Classe adicional para customização */
  className?: string;
}

/**
 * Layout simples e limpo para páginas públicas
 * Sem sidebar, apenas conteúdo centralizado
 */
export function PublicLayout({
  children,
  withGradient = true,
  className = '',
}: PublicLayoutProps) {
  return (
    <div
      className={`
        min-h-screen w-full
        ${withGradient ? 'bg-gradient-surface' : 'bg-background'}
        ${className}
      `}
    >
      {/* Conteúdo centralizado */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full animate-fade-in">
          {children}
        </div>
      </div>

      {/* Footer opcional */}
      <footer className="fixed bottom-0 left-0 right-0 border-t border-border/50 bg-background/80 px-4 py-3 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-xs text-muted-foreground">
            Sistema REVIS © 2025 - Gestão de Estoque e Produção
          </p>
        </div>
      </footer>
    </div>
  );
}
