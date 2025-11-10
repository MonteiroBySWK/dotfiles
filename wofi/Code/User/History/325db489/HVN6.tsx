/**
 * Tabela de Listagem de Vendas
 * Sistema REVIS
 */

'use client';

import { useState, useMemo } from 'react';
import { useVendas } from '@/hooks/useVendas';
import { useEventos } from '@/hooks/useEventos';
import { usePontosVenda } from '@/hooks/usePontosVenda';
import { useProdutos } from '@/hooks/useProdutos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Search, TrendingUp, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ITEMS_PER_PAGE = 10;

export function TableVendasList() {
  const [search, setSearch] = useState('');
  const [eventoFiltro, setEventoFiltro] = useState<string>('todos');
  const [pontoVendaFiltro, setPontoVendaFiltro] = useState<string>('todos');
  const [currentPage, setCurrentPage] = useState(1);

  // Buscar dados
  const { vendas, loading } = useVendas();
  const { eventos } = useEventos();
  const { pontosVenda } = usePontosVenda(false); // Incluir inativos para histórico
  const { data: produtos } = useProdutos();

  // Criar maps para lookup rápido
  const eventosMap = useMemo(() => new Map(eventos.map(e => [e.id, e])), [eventos]);
  const pontosVendaMap = useMemo(() => new Map(pontosVenda.map(p => [p.id, p])), [pontosVenda]);
  const produtosMap = useMemo(() => new Map(produtos.map(p => [p.id, p])), [produtos]);

  // Filtros
  const vendasFiltradas = useMemo(() => {
    return vendas.filter((venda) => {
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
  }, [vendas, search, eventoFiltro, pontoVendaFiltro, eventosMap, pontosVendaMap, produtosMap]);

  // Paginação
  const totalPages = Math.ceil(vendasFiltradas.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const vendasPaginadas = vendasFiltradas.slice(startIndex, endIndex);

  // Cálculos de totais
  const totalQuantidade = vendasFiltradas.reduce((acc, v) => acc + v.quantidade, 0);
  const totalValor = vendasFiltradas.reduce((acc, v) => acc + v.valor, 0);

  // Reset página ao filtrar
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

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
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            placeholder="Buscar por evento, ponto de venda ou produto..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              handleFilterChange();
            }}
            className="pl-9"
          />
        </div>
        
        <Select value={eventoFiltro} onValueChange={(value) => {
          setEventoFiltro(value);
          handleFilterChange();
        }}>
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

        <Select value={pontoVendaFiltro} onValueChange={(value) => {
          setPontoVendaFiltro(value);
          handleFilterChange();
        }}>
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuantidade} unidades</div>
            <p className="text-xs text-muted-foreground">
              {vendasFiltradas.length} {vendasFiltradas.length === 1 ? 'registro' : 'registros'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalValor.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Média: R$ {vendasFiltradas.length > 0 ? (totalValor / vendasFiltradas.length).toFixed(2) : '0.00'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Vendas</CardTitle>
          <CardDescription>
            Mostrando {startIndex + 1} a {Math.min(endIndex, vendasFiltradas.length)} de {vendasFiltradas.length} vendas
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              {vendasPaginadas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    Nenhuma venda encontrada
                  </TableCell>
                </TableRow>
              ) : (
                vendasPaginadas.map((venda) => {
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

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Próxima
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            placeholder="Buscar por evento, ponto de venda ou produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
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
