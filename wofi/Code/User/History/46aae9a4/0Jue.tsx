/**
 * Página de Alertas
 * Sistema REVIS - REQ-04, REQ-15
 */

'use client';

import { HeaderMainPage } from '@/components/layout/HeaderMainPage';
import { ListaAlertas } from '@/components/alertas/ListaAlertas';

export default function AlertasPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <HeaderMainPage title="Alertas" />
      
      <main className="flex-1 space-y-6 p-6">
        <div>
          <h2 className="text-lg font-medium text-foreground">
            Central de Notificações
          </h2>
          <p className="text-sm text-muted-foreground">
            Acompanhe avisos importantes sobre estoque, validade e perdas
          </p>
        </div>

        <ListaAlertas />
      </main>
    </div>
  );
}
