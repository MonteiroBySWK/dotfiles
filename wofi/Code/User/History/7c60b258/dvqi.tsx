/**
 * HistoricoMovimentacao - Exibe histórico de movimentações de um ingrediente
 * Sistema REVIS - REQ-05
 */

'use client';

import { HistoricoMovimentacao, TipoMovimentacao } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  TrendingDown,
  TrendingUp,
  Package,
  AlertCircle,
  Calendar,
  User,
  FileText,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface HistoricoMovimentacaoProps {
  historico: HistoricoMovimentacao[];
  ingredienteNome: string;
  unidade: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HistoricoMovimentacaoList({
  historico,
  ingredienteNome,
  unidade,
  open,
  onOpenChange,
}: HistoricoMovimentacaoProps) {
  // Ordenar por data decrescente
  const historicoOrdenado = [...historico].sort((a, b) => {
    const dataA = a.data.toMillis ? a.data.toMillis() : Number(a.data);
    const dataB = b.data.toMillis ? b.data.toMillis() : Number(b.data);
    return Number(dataB) - Number(dataA);
  });

  const getIconByTipo = (tipo: TipoMovimentacao) => {
    switch (tipo) {
      case TipoMovimentacao.ENTRADA:
        return <TrendingUp className="h-4 w-4 text-success" />;
      case TipoMovimentacao.SAIDA:
        return <TrendingDown className="h-4 w-4 text-warning" />;
      case TipoMovimentacao.PERDA:
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case TipoMovimentacao.AJUSTE:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getBadgeVariant = (tipo: TipoMovimentacao) => {
    switch (tipo) {
      case TipoMovimentacao.ENTRADA:
        return 'default';
      case TipoMovimentacao.SAIDA:
        return 'secondary';
      case TipoMovimentacao.PERDA:
        return 'destructive';
      case TipoMovimentacao.AJUSTE:
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const formatTipo = (tipo: TipoMovimentacao): string => {
    const labels = {
      [TipoMovimentacao.ENTRADA]: 'Entrada',
      [TipoMovimentacao.SAIDA]: 'Saída',
      [TipoMovimentacao.PERDA]: 'Perda',
      [TipoMovimentacao.AJUSTE]: 'Ajuste',
    };
    return labels[tipo] || tipo;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Histórico de Movimentações</DialogTitle>
          <p className="text-sm text-muted-foreground">{ingredienteNome}</p>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          {historicoOrdenado.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="mb-2 h-12 w-12 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">Nenhuma movimentação registrada</p>
            </div>
          ) : (
            <div className="space-y-3 pr-4">
              {historicoOrdenado.map((item, index) => {
                const dataFormatada = item.data.toMillis
                  ? format(item.data.toMillis(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
                  : 'Data não disponível';

                return (
                  <div
                    key={index}
                    className="flex gap-3 rounded-lg border border-border bg-surface p-4 transition-colors hover:bg-muted/50"
                  >
                    {/* Ícone */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                      {getIconByTipo(item.tipo)}
                    </div>

                    {/* Conteúdo */}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <Badge variant={getBadgeVariant(item.tipo)}>
                          {formatTipo(item.tipo)}
                        </Badge>
                        <span className="text-lg font-semibold">
                          {item.quantidade} {unidade}
                        </span>
                      </div>

                      {item.observacao && (
                        <p className="text-sm text-foreground">{item.observacao}</p>
                      )}

                      {item.origem && (
                        <p className="text-xs text-muted-foreground">
                          Origem: {item.origem}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {dataFormatada}
                        </div>
                        {item.usuario && (
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {item.usuario}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
