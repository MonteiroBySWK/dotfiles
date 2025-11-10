/**
 * Relatório de Estoque
 * Sistema REVIS - REQ-18
 */

'use client';

import { useIngredientes } from '@/hooks/useIngredientes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function RelatorioEstoque() {
  const { data: ingredientes, loading } = useIngredientes();

  const exportarExcel = () => {
    // TODO: Implementar exportação real com biblioteca xlsx
    toast.success('Exportando para Excel...');
    
    // Simulação de dados CSV
    const headers = ['Nome', 'Categoria', 'Estoque Atual', 'Estoque Mínimo', 'Unidade', 'Status'];
    const rows = ingredientes.map(ing => [
      ing.nome,
      ing.categoria,
      ing.estoqueAtual,
      ing.estoqueMinimo,
      ing.unidade,
      ing.estoqueAtual < ing.estoqueMinimo ? 'BAIXO' : 'OK'
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.join(';'))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_estoque_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  const exportarPDF = () => {
    // TODO: Implementar exportação PDF com jsPDF
    toast.info('Exportação PDF em desenvolvimento');
  };

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Ações */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Relatório de Estoque</h3>
          <p className="text-sm text-muted-foreground">
            Gerado em {format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportarExcel} variant="outline">
            <FileSpreadsheet className="mr-2 h-4 w-4" aria-hidden="true" />
            Excel/CSV
          </Button>
          <Button onClick={exportarPDF} variant="outline">
            <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
            PDF
          </Button>
        </div>
      </div>

      {/* Tabela */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Nome</th>
                <th className="px-4 py-3 text-left font-medium">Categoria</th>
                <th className="px-4 py-3 text-right font-medium">Estoque Atual</th>
                <th className="px-4 py-3 text-right font-medium">Estoque Mínimo</th>
                <th className="px-4 py-3 text-center font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ingredientes.map((ing) => {
                const isBaixo = ing.estoqueAtual < ing.estoqueMinimo;
                return (
                  <tr key={ing.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium">{ing.nome}</td>
                    <td className="px-4 py-3 text-muted-foreground">{ing.categoria}</td>
                    <td className="px-4 py-3 text-right">
                      {ing.estoqueAtual} {ing.unidade}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {ing.estoqueMinimo} {ing.unidade}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={isBaixo ? 'destructive' : 'default'}>
                        {isBaixo ? 'BAIXO' : 'OK'}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resumo */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground mb-1">Total de Ingredientes</p>
          <p className="text-2xl font-bold">{ingredientes.length}</p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground mb-1">Estoque Baixo</p>
          <p className="text-2xl font-bold text-destructive">
            {ingredientes.filter(i => i.estoqueAtual < i.estoqueMinimo).length}
          </p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground mb-1">Estoque OK</p>
          <p className="text-2xl font-bold text-success">
            {ingredientes.filter(i => i.estoqueAtual >= i.estoqueMinimo).length}
          </p>
        </div>
      </div>
    </div>
  );
}
