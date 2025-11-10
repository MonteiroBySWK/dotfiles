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
import { NivelUsuario } from '@/types';

export default function EstoquePage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <ProtectedRoute allowedRoles={[NivelUsuario.ADMIN, NivelUsuario.PRODUCAO]}>
      <DashboardLayout title="Gestão de Estoque">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-foreground">
              Ingredientes Cadastrados
            </h2>
            <p className="text-sm text-muted-foreground">
              Gerencie os insumos e matérias-primas
            </p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Ingrediente
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Cadastrar Ingrediente</DialogTitle>
              </DialogHeader>
              <FormIngredient onSuccess={() => setDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        <TableIngredientList />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
