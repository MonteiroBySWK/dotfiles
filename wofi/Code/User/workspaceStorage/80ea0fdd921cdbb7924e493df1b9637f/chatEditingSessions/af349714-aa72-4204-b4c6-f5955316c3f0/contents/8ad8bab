/**
 * Relatório de Produção
 * Sistema REVIS - REQ-18
 */

'use client';

import { useLotesProducao } from '@/hooks/useLotesProducao';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function RelatorioProducao() {
  const { data: lotes } = useLotesProducao();

  const exportar = () => {
    toast.success('Exportando relatório de produção...');
  };

  // Calcular totais
  const totalLotes = lotes.length;
  const totalItens = lotes.reduce(
    (acc, lote) => acc + lote.itensPlanejados.reduce((s, i) => s + i.quantidadeFinal, 0),
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Relatório de Produção</h3>
          <p className="text-sm text-muted-foreground">
            {totalLotes} lotes produzidos ({totalItens} itens)
          </p>
        </div>
        <Button onClick={exportar} variant="outline">
          <FileSpreadsheet className="mr-2 h-4 w-4" aria-hidden="true" />
          Exportar CSV
        </Button>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Data</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Total Produzido</th>
                <th className="px-4 py-3 text-left font-medium">Produtos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {lotes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                    Nenhum lote de produção registrado
                  </td>
                </tr>
              ) : (
                lotes.map((lote) => {
                  const total = lote.itensPlanejados.reduce((s, i) => s + i.quantidadeFinal, 0);
                  return (
                    <tr key={lote.id} className="hover:bg-muted/50">
                      <td className="px-4 py-3">
                        {format(lote.dataProducao.toDate(), 'dd/MM/yyyy', { locale: ptBR })}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            lote.status === 'executado' ? 'default' : 'outline'
                          }
                        >
                          {lote.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right font-medium">{total} unidades</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {lote.itensPlanejados.map(i => i.produtoNome).join(', ')}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
