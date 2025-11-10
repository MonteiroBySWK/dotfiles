/**
 * DashboardLayout - Layout principal do sistema
 * Sistema REVIS
 */

'use client';

import { useState } from 'react';
import { HeaderMainPage } from './HeaderMainPage';
import { SidebarNavigation } from './SidebarNavigation';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  alertCount?: number;
  breadcrumbs?: Breadcrumb[];
}

/**
 * Layout principal que combina Header, Sidebar e área de conteúdo
 * Responsivo com suporte a mobile
 */
export function DashboardLayout({ 
  children, 
  title,
  alertCount = 0,
  breadcrumbs
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <SidebarNavigation 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Overlay para mobile quando sidebar está aberta */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden transition-opacity duration-200"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Conteúdo principal */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <HeaderMainPage 
          title={title}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          breadcrumbs={breadcrumbs}
        />

        {/* Área de conteúdo com scroll */}
        <main className="flex-1 overflow-y-auto scroll-smooth p-3 md:p-6 pb-safe">
          {children}
        </main>
      </div>
    </div>
  );
}
