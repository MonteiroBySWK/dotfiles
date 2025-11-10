/**
 * DashboardLayout - Layout principal do sistema
 * Sistema REVIS
 */

'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { HeaderMainPage } from './HeaderMainPage';
import { SidebarNavigation } from './SidebarNavigation';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  breadcrumbs?: Breadcrumb[];
}

/**
 * Layout principal que combina Header, Sidebar e área de conteúdo
 * Responsivo com suporte a mobile
 * Busca alertas automaticamente do Firebase
 */
export function DashboardLayout({ 
  children, 
  title,
  breadcrumbs
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        // Buscar alertas não lidos
        const alertsRef = collection(db, 'alertas');
        const q = query(alertsRef, where('lido', '==', false));
        const snapshot = await getDocs(q);
        setAlertCount(snapshot.size);
      } catch (error) {
        console.error('Erro ao buscar alertas:', error);
        setAlertCount(0);
      }
    };

    fetchAlerts();

    // Atualizar a cada 5 minutos
    const interval = setInterval(fetchAlerts, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <SidebarNavigation 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Conteúdo principal */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <HeaderMainPage 
          title={title}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          alertCount={alertCount}
          breadcrumbs={breadcrumbs}
        />

        {/* Área de conteúdo com scroll */}
        <main className="flex-1 overflow-y-auto scroll-smooth p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
