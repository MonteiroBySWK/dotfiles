/**
 * Página de Controle de Pedidos
 * Sistema REVIS - REQ-07 a REQ-11
 */

'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { TablePedidosList } from '@/components/pedidos/TablePedidosList';
import { FormPedido } from '@/components/pedidos/FormPedido';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { NivelUsuario } from '@/types';

export default function PedidosPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <ProtectedRoute allowedRoles={[NivelUsuario.ADMIN, NivelUsuario.PEDIDOS]}>
      <DashboardLayout 
        title="Controle de Pedidos"
        breadcrumbs={[
          { label: 'Início', href: '/' },
          { label: 'Pedidos' },
        ]}
      >
        <div className="space-y-6">
          <PageHeader
            title="Controle de Pedidos"
            subtitle="Gestão completa de pedidos a fornecedores"
            actions={
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="default" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Novo Pedido
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Novo Pedido</DialogTitle>
                    <DialogDescription>
                      Crie um pedido de compra com múltiplos ingredientes
                    </DialogDescription>
                  </DialogHeader>
                  <FormPedido onSuccess={() => setDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            }
          />

          <TablePedidosList />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
