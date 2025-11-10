/**
 * Página de Gestão de Estoque
 * Sistema REVIS
 */

'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { TableIngredientList } from '@/components/inventory/TableIngredientList';
import { FormIngredient } from '@/components/inventory/FormIngredient';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Plus, Package } from 'lucide-react';
import { NivelUsuario } from '@/types';

export default function EstoquePage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <ProtectedRoute allowedRoles={[NivelUsuario.ADMIN, NivelUsuario.PRODUCAO, NivelUsuario.PEDIDOS]}>
      <DashboardLayout 
        title="Gestão de Estoque"
        breadcrumbs={[
          { label: 'Início', href: '/' },
          { label: 'Estoque' },
        ]}
      >
        <div className="space-y-6">
          <PageHeader
            title="Gestão de Estoque"
            subtitle="Controle completo de ingredientes e insumos do sistema"
            actions={
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="default" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Adicionar Ingrediente
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Novo Ingrediente</DialogTitle>
                    <DialogDescription>
                      Cadastre um novo ingrediente no sistema de estoque
                    </DialogDescription>
                  </DialogHeader>
                  <FormIngredient onSuccess={() => setDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            }
          />

          <TableIngredientList />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}