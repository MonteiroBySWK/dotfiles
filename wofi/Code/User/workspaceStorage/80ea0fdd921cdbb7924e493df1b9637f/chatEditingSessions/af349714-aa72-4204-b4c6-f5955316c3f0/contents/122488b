/**
 * Página de Controle de Pedidos
 * Sistema REVIS - REQ-07 a REQ-11
 */

'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TablePedidosList } from '@/components/pedidos/TablePedidosList';
import { FormPedido } from '@/components/pedidos/FormPedido';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { NivelUsuario } from '@/types';

export default function PedidosPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <ProtectedRoute allowedRoles={[NivelUsuario.ADMIN, NivelUsuario.PEDIDOS]}>
      <DashboardLayout title="Controle de Pedidos">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-surface px-6 py-4">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Controle de Pedidos</h1>
              <p className="text-sm text-muted-foreground">
                Gestão completa de pedidos a fornecedores
              </p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Pedido
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Novo Pedido</DialogTitle>
                </DialogHeader>
                <FormPedido onSuccess={() => setDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>

          {/* Conteúdo */}
          <div className="px-6">
            <TablePedidosList />
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
