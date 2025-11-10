/**
 * Relatório de Perdas
 * Sistema REVIS - REQ-06, REQ-18
 */

'use client';

import { useIngredientes } from '@/hooks/useIngredientes';
import { Button } from '@/components/ui/button';
import { TipoMovimentacao } from '@/types';
import { FileSpreadsheet, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function RelatorioPerdas() {
  const { data: ingredientes } = useIngredientes();

  // Filtrar movimentações de perda
  const perdas = ingredientes.flatMap(ing =>
    ing.historico
      .filter(h => h.tipo === TipoMovimentacao.PERDA)
      .map(h => ({
        ingrediente: ing.nome,
        quantidade: h.quantidade,
        unidade: ing.unidade,
        data: h.data.toDate(),
        observacao: h.observacao || '-',
      }))
  ).sort((a, b) => b.data.getTime() - a.data.getTime());

  const exportar = () => {
    toast.success('Exportando relatório de perdas...');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Relatório de Perdas</h3>
          <p className="text-sm text-muted-foreground">
            Total de {perdas.length} registros de perda
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportar} variant="outline">
            <FileSpreadsheet className="mr-2 h-4 w-4" aria-hidden="true" />
            Exportar CSV
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Data</th>
                <th className="px-4 py-3 text-left font-medium">Ingrediente</th>
                <th className="px-4 py-3 text-right font-medium">Quantidade</th>
                <th className="px-4 py-3 text-left font-medium">Observação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {perdas.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                    Nenhuma perda registrada
                  </td>
                </tr>
              ) : (
                perdas.map((perda, idx) => (
                  <tr key={idx} className="hover:bg-muted/50">
                    <td className="px-4 py-3">
                      {format(perda.data, 'dd/MM/yyyy', { locale: ptBR })}
                    </td>
                    <td className="px-4 py-3 font-medium">{perda.ingrediente}</td>
                    <td className="px-4 py-3 text-right text-destructive">
                      -{perda.quantidade} {perda.unidade}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{perda.observacao}</td>
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
