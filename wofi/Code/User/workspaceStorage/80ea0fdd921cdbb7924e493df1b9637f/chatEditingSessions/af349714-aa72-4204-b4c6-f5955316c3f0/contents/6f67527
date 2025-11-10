/**
 * Tabela de Listagem de Vendas
 * Sistema REVIS
 */

'use client';

import { useState } from 'react';
import { useVendas } from '@/hooks/useVendas';
import { useEventos } from '@/hooks/useEventos';
import { usePontosVenda } from '@/hooks/usePontosVenda';
import { useProdutos } from '@/hooks/useProdutos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, TrendingUp, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function TableVendasList() {
  const [search, setSearch] = useState('');
  const [eventoFiltro, setEventoFiltro] = useState<string>('todos');
  const [pontoVendaFiltro, setPontoVendaFiltro] = useState<string>('todos');

  // Buscar dados
  const { vendas, loading } = useVendas();
  const { eventos } = useEventos();
  const { pontosVenda } = usePontosVenda(false); // Incluir inativos para histórico
  const { data: produtos } = useProdutos();

  // Criar maps para lookup rápido
  const eventosMap = new Map(eventos.map(e => [e.id, e]));
  const pontosVendaMap = new Map(pontosVenda.map(p => [p.id, p]));
  const produtosMap = new Map(produtos.map(p => [p.id, p]));

  // Filtros
  const vendasFiltradas = vendas.filter((venda) => {
    const evento = eventosMap.get(venda.eventoId);
    const pontoVenda = pontosVendaMap.get(venda.pontoVendaId);
    const produto = produtosMap.get(venda.produtoId);

    const matchSearch = 
      evento?.nome.toLowerCase().includes(search.toLowerCase()) ||
      pontoVenda?.nome.toLowerCase().includes(search.toLowerCase()) ||
      produto?.nome.toLowerCase().includes(search.toLowerCase());

    const matchEvento = eventoFiltro === 'todos' || venda.eventoId === eventoFiltro;
    const matchPontoVenda = pontoVendaFiltro === 'todos' || venda.pontoVendaId === pontoVendaFiltro;

    return matchSearch && matchEvento && matchPontoVenda;
  });

  // Cálculos de totais
  const totalQuantidade = vendasFiltradas.reduce((acc, v) => acc + v.quantidade, 0);
  const totalValor = vendasFiltradas.reduce((acc, v) => acc + v.valor, 0);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="flex-1">
          <Input
            placeholder="Buscar por evento, ponto de venda ou produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="h-4 w-4" aria-hidden="true" />}
          />
        </div>
        
        <Select value={eventoFiltro} onValueChange={setEventoFiltro}>
          <SelectTrigger className="w-full md:w-[200px]" aria-label="Filtrar por evento">
            <SelectValue placeholder="Todos os eventos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os eventos</SelectItem>
            {eventos.map((evento) => (
              <SelectItem key={evento.id} value={evento.id}>
                {evento.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={pontoVendaFiltro} onValueChange={setPontoVendaFiltro}>
          <SelectTrigger className="w-full md:w-[200px]" aria-label="Filtrar por ponto de venda">
            <SelectValue placeholder="Todos os pontos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os pontos</SelectItem>
            {pontosVenda.map((ponto) => (
              <SelectItem key={ponto.id} value={ponto.id}>
                {ponto.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" aria-hidden="true" />
            Total de Vendas
          </div>
          <div className="mt-2 text-2xl font-semibold text-foreground">
            {totalQuantidade} unidades
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="h-4 w-4" aria-hidden="true" />
            Valor Total
          </div>
          <div className="mt-2 text-2xl font-semibold text-foreground">
            R$ {totalValor.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data/Hora</TableHead>
              <TableHead>Evento</TableHead>
              <TableHead>Ponto de Venda</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead className="text-right">Quantidade</TableHead>
              <TableHead className="text-right">Valor Unit.</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendasFiltradas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  Nenhuma venda encontrada
                </TableCell>
              </TableRow>
            ) : (
              vendasFiltradas.map((venda) => {
                const evento = eventosMap.get(venda.eventoId);
                const pontoVenda = pontosVendaMap.get(venda.pontoVendaId);
                const produto = produtosMap.get(venda.produtoId);

                return (
                  <TableRow key={venda.id}>
                    <TableCell className="font-medium">
                      {format(venda.dataVenda.toDate(), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </TableCell>
                    <TableCell>{evento?.nome || '-'}</TableCell>
                    <TableCell>{pontoVenda?.nome || '-'}</TableCell>
                    <TableCell>{produto?.nome || '-'}</TableCell>
                    <TableCell className="text-right">{venda.quantidade}</TableCell>
                    <TableCell className="text-right">
                      R$ {venda.valor.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      R$ {(venda.quantidade * venda.valor).toFixed(2)}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
