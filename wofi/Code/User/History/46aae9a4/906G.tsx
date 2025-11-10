/**
 * Página de Alertas
 * Sistema REVIS - REQ-04, REQ-15
 */

'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { ListaAlertas } from '@/components/alertas/ListaAlertas';

export default function AlertasPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout title="Alertas">
        <PageHeader
          title="Central de Notificações"
          subtitle="Acompanhe avisos importantes sobre estoque, validade e perdas"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Alertas' }
          ]}
        />

        <div className="mt-6">
          <ListaAlertas />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
