/**
 * Relatório de Vendas
 * Sistema REVIS - REQ-18
 */

'use client';

import { useVendas } from '@/hooks/useVendas';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function RelatorioVendas() {
  const { data: vendas } = useVendas();

  const exportar = () => {
    toast.success('Exportando relatório de vendas...');
  };

  // Calcular totais
  const totalVendas = vendas.length;
  const totalUnidades = vendas.reduce((acc, v) => acc + v.quantidade, 0);
  const totalReceita = vendas.reduce((acc, v) => acc + v.valor, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Relatório de Vendas</h3>
          <p className="text-sm text-muted-foreground">
            {totalVendas} vendas realizadas
          </p>
        </div>
        <Button onClick={exportar} variant="outline">
          <FileSpreadsheet className="mr-2 h-4 w-4" aria-hidden="true" />
          Exportar CSV
        </Button>
      </div>

      {/* Resumo */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground mb-1">Total de Vendas</p>
          <p className="text-2xl font-bold">{totalVendas}</p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground mb-1">Unidades Vendidas</p>
          <p className="text-2xl font-bold">{totalUnidades}</p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground mb-1">Receita Total</p>
          <p className="text-2xl font-bold text-success">
            R$ {totalReceita.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Tabela */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Data</th>
                <th className="px-4 py-3 text-left font-medium">Evento</th>
                <th className="px-4 py-3 text-left font-medium">Ponto de Venda</th>
                <th className="px-4 py-3 text-left font-medium">Produto</th>
                <th className="px-4 py-3 text-right font-medium">Quantidade</th>
                <th className="px-4 py-3 text-right font-medium">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {vendas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    Nenhuma venda registrada
                  </td>
                </tr>
              ) : (
                vendas.map((venda) => (
                  <tr key={venda.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3">
                      {format(venda.dataVenda.toDate(), 'dd/MM/yyyy', { locale: ptBR })}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{venda.eventoId}</td>
                    <td className="px-4 py-3 text-muted-foreground">{venda.pontoVendaId}</td>
                    <td className="px-4 py-3 font-medium">{venda.produtoId}</td>
                    <td className="px-4 py-3 text-right">{venda.quantidade}</td>
                    <td className="px-4 py-3 text-right font-medium">
                      R$ {venda.valor.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
