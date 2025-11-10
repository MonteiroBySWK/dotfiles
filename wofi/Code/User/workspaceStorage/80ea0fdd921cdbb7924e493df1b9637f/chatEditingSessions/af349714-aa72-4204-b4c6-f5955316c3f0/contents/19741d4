/**
 * TablePedidosList - Lista de pedidos com filtros
 * Sistema REVIS - REQ-08
 */

'use client';

import { useState } from 'react';
import { usePedidos } from '@/hooks/usePedidos';
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
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CardPedidoDetalhes } from './CardPedidoDetalhes';
import { Search, Eye, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { Pedido, StatusPedido } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Pagination } from '@/components/ui/pagination';

const ITEMS_PER_PAGE = 10;

export function TablePedidosList() {
  const { data: pedidos, loading } = usePedidos();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Filtrar pedidos
  const filteredPedidos = pedidos.filter((pedido) => {
    const matchSearch = 
      pedido.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.fornecedor?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchStatus = statusFilter === 'todos' || pedido.status === statusFilter;
    
    return matchSearch && matchStatus;
  });

  // Paginação
  const totalPages = Math.ceil(filteredPedidos.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedPedidos = filteredPedidos.slice(startIndex, endIndex);

  // Reset page quando filtros mudam
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleViewDetails = (pedido: Pedido) => {
    setSelectedPedido(pedido);
    setDetailsOpen(true);
  };

  const getStatusBadge = (status: StatusPedido) => {
    const config: Record<StatusPedido, any> = {
      [StatusPedido.SOLICITADO]: {
        variant: 'secondary' as const,
        icon: Clock,
        label: 'Solicitado',
      },
      [StatusPedido.SEPARACAO]: {
        variant: 'default' as const,
        icon: Package,
        label: 'Em Separação',
      },
      [StatusPedido.ENTREGA]: {
        variant: 'default' as const,
        icon: Truck,
        label: 'Em Entrega',
      },
      [StatusPedido.RECEBIDO]: {
        variant: 'outline' as const,
        icon: CheckCircle,
        label: 'Recebido',
        className: 'border-success text-success',
      },
      [StatusPedido.CANCELADO]: {
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
          {/* Filtros */}
          <div className="mb-4 flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por número ou fornecedor..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value={StatusPedido.SOLICITADO}>Solicitado</SelectItem>
                <SelectItem value={StatusPedido.SEPARACAO}>Em Separação</SelectItem>
                <SelectItem value={StatusPedido.ENTREGA}>Em Entrega</SelectItem>
                <SelectItem value={StatusPedido.RECEBIDO}>Recebido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabela */}
          {filteredPedidos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="mb-2 h-12 w-12 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'todos'
                  ? 'Nenhum pedido encontrado'
                  : 'Nenhum pedido cadastrado'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Valor Total</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPedidos.map((pedido) => {
                  const dataSolicitacao = pedido.dataSolicitacao?.toDate
                    ? pedido.dataSolicitacao.toDate()
                    : new Date(pedido.dataSolicitacao as any);

                  return (
                    <TableRow key={pedido.id}>
                      <TableCell className="font-medium">{pedido.numero}</TableCell>
                      <TableCell>{pedido.fornecedor || '-'}</TableCell>
                      <TableCell>
                        {format(dataSolicitacao, 'dd/MM/yyyy', { locale: ptBR })}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        R$ {pedido.valorTotal.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(pedido.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewDetails(pedido)}
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
      {selectedPedido && (
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalhes do Pedido</DialogTitle>
            </DialogHeader>
            <CardPedidoDetalhes
              pedido={selectedPedido}
              onClose={() => setDetailsOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
