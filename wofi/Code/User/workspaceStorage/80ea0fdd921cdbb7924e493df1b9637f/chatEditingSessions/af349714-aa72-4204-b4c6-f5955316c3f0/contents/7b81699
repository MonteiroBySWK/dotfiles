/**
 * Página de Vendas
 * Sistema REVIS
 */

'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { FormVenda } from '@/components/vendas/FormVenda';
import { TableVendasList } from '@/components/vendas/TableVendasList';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

export default function VendasPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <ProtectedRoute>
      <DashboardLayout 
        title="Vendas"
        breadcrumbs={[
          { label: 'Início', href: '/' },
          { label: 'Vendas', href: '/vendas' }
        ]}
      >
        {/* Header com ação */}
        <PageHeader
          title="Histórico de Vendas"
          subtitle="Registre e acompanhe as vendas por evento e ponto de venda"
          actions={
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
              Registrar Venda
            </Button>
          }
        />

        {/* Tabela de vendas */}
        <div className="mt-6">
          <TableVendasList />
        </div>

        {/* Dialog de nova venda */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Registrar Nova Venda</DialogTitle>
              <DialogDescription>
                Registre uma nova venda vinculada a um evento e ponto de venda
              </DialogDescription>
            </DialogHeader>
            <FormVenda onSuccess={() => setDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
