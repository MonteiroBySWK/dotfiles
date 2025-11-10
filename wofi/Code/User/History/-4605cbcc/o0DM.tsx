/**
 * Página de Gestão de Eventos
 * Sistema REVIS
 */

'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TableEventos } from '@/components/eventos/TableEventos';
import { FormEvento } from '@/components/eventos/FormEvento';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { NivelUsuario } from '@/types';

export default function EventosPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <ProtectedRoute allowedRoles={[NivelUsuario.ADMIN, NivelUsuario.PRODUCAO]}>
      <DashboardLayout title="Gestão de Eventos">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-surface px-6 py-4">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Gestão de Eventos</h1>
              <p className="text-sm text-muted-foreground">
                Cadastro e histórico de eventos
              </p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Evento
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Novo Evento</DialogTitle>
                </DialogHeader>
                <FormEvento onSuccess={() => setDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>

          {/* Conteúdo */}
          <div className="px-6">
            <TableEventos />
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
