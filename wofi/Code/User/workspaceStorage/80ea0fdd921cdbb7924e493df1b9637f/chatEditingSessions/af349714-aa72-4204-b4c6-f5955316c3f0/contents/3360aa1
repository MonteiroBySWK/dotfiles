/**
 * Página de Controle de Produção
 * Sistema REVIS - REQ-12 a REQ-17
 */

'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
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
        <PageHeader
          title="Controle de Produção"
          subtitle="Planejamento e execução de lotes de produção"
          breadcrumbs={[
            { label: 'Início', href: '/' },
            { label: 'Produção', href: '/producao' },
          ]}
          actions={
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
          }
        />

        <div className="mt-6">
          <TableLotesProducao />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
