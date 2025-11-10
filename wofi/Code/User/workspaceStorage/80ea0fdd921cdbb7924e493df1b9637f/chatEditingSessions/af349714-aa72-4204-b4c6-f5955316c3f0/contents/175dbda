/**
 * TableLotesProducao - Lista de lotes de produção
 * Sistema REVIS - REQ-12
 */

'use client';

import { useState } from 'react';
import { useLotesProducao } from '@/hooks/useLotesProducao';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CardLoteDetalhes } from './CardLoteDetalhes';
import { Eye, Package, Clock, CheckCircle } from 'lucide-react';
import { LoteProducao, StatusLoteProducao } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function TableLotesProducao() {
  const { data: lotes, loading } = useLotesProducao();
  const [selectedLote, setSelectedLote] = useState<LoteProducao | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleViewDetails = (lote: LoteProducao) => {
    setSelectedLote(lote);
    setDetailsOpen(true);
  };

  const getStatusBadge = (status: StatusLoteProducao) => {
    const config: Record<StatusLoteProducao, any> = {
      [StatusLoteProducao.PLANEJADO]: {
        variant: 'secondary' as const,
        icon: Clock,
        label: 'Planejado',
      },
      [StatusLoteProducao.EM_EXECUCAO]: {
        variant: 'default' as const,
        icon: Package,
        label: 'Em Execução',
      },
      [StatusLoteProducao.EXECUTADO]: {
        variant: 'outline' as const,
        icon: CheckCircle,
        label: 'Executado',
        className: 'border-success text-success',
      },
      [StatusLoteProducao.CANCELADO]: {
        variant: 'destructive' as const,
        icon: Clock,
        label: 'Cancelado',
      },
    };

    const { variant, icon: Icon, label, className } = config[status];

    return (
      <Badge variant={variant} className={className}>
        <Icon className="mr-1 h-3 w-3" />
        {label}
      </Badge>
    );
  };

  // Loading state
  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          {/* Tabela */}
          {lotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="mb-2 h-12 w-12 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">Nenhum lote de produção cadastrado</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data de Produção</TableHead>
                  <TableHead className="text-center">Total de Drinks</TableHead>
                  <TableHead className="text-center">Produtos</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lotes.map((lote) => {
                  const dataProducao = lote.dataProducao?.toDate
                    ? lote.dataProducao.toDate()
                    : new Date(lote.dataProducao as any);

                  const totalProdutos = lote.itensPlanejados.reduce(
                    (sum, item) => sum + item.quantidadeFinal,
                    0
                  );

                  return (
                    <TableRow key={lote.id}>
                      <TableCell className="font-medium">
                        {format(dataProducao, 'dd/MM/yyyy', { locale: ptBR })}
                      </TableCell>
                      <TableCell className="text-center">
                        {lote.configDistribuicao.totalDrinks}
                      </TableCell>
                      <TableCell className="text-center">{totalProdutos}</TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(lote.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewDetails(lote)}
                          aria-label="Ver detalhes"
                          title="Ver detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal de Detalhes */}
      {selectedLote && (
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalhes do Lote de Produção</DialogTitle>
            </DialogHeader>
            <CardLoteDetalhes lote={selectedLote} onClose={() => setDetailsOpen(false)} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
