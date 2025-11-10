/**
 * Página de Gestão de Estoque
 * Sistema REVIS
 */

'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TableIngredientList } from '@/components/inventory/TableIngredientList';
import { FormIngredient } from '@/components/inventory/FormIngredient';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

export default function EstoquePage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <ProtectedRoute allowedRoles={['administrador', 'producao', 'pedidos']}>
      <DashboardLayout title="Gestão de Estoque">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-surface px-6 py-4">
            <h1 className="text-2xl font-semibold text-foreground">Gestão de Estoque</h1>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Ingrediente
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Novo Ingrediente</DialogTitle>
                </DialogHeader>
                <FormIngredient onSuccess={() => setDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>

          {/* Conteúdo */}
          <div className="px-6">
            <TableIngredientList />
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

