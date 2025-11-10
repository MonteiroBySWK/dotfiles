/**
 * Página de Vendas
 * Sistema REVIS
 */

'use client';

import { useState } from 'react';
import { HeaderMainPage } from '@/components/layout/HeaderMainPage';
import { FormVenda } from '@/components/vendas/FormVenda';
import { TableVendasList } from '@/components/vendas/TableVendasList';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

export default function VendasPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <HeaderMainPage title="Vendas" />
      
      <main className="flex-1 space-y-6 p-6">
        {/* Header com ação */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-foreground">
              Histórico de Vendas
            </h2>
            <p className="text-sm text-muted-foreground">
              Registre e acompanhe as vendas por evento e ponto de venda
            </p>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            Registrar Venda
          </Button>
        </div>

        {/* Tabela de vendas */}
        <TableVendasList />

        {/* Dialog de nova venda */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Registrar Nova Venda</DialogTitle>
            </DialogHeader>
            <FormVenda onSuccess={() => setDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
