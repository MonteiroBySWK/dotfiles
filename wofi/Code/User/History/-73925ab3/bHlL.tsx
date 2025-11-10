/**
 * Página de Controle de Produção
 * Sistema REVIS - REQ-12 a REQ-17
 */

'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TableLotesProducao } from '@/components/producao/TableLotesProducao';
import { FormLoteProducao } from '@/components/producao/FormLoteProducao';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { NivelUsuario } from '@/types';

export default function ProducaoPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <ProtectedRoute allowedRoles={[NivelUsuario.ADMIN, NivelUsuario.PRODUCAO]}>
      <DashboardLayout title="Controle de Produção">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-surface px-6 py-4">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Controle de Produção</h1>
              <p className="text-sm text-muted-foreground">
                Planejamento e execução de lotes de produção
              </p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Lote
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Planejar Produção</DialogTitle>
                </DialogHeader>
                <FormLoteProducao onSuccess={() => setDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>

          {/* Conteúdo */}
          <div className="px-6">
            <TableLotesProducao />
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
