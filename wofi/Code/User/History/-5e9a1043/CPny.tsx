'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SaleData, SalesApiResponse } from '@/types/sales';
import { SortConfig, SortField, SortDirection } from '@/types/sorting';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SalesTableSkeleton } from './sales-table-skeleton';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

interface SalesTableProps {
  uploadedData?: SaleData[] | null;
}

export function SalesTable({ uploadedData }: SalesTableProps) {
  const [salesData, setSalesData] = useState<SaleData[]>([]);
  const [filteredData, setFilteredData] = useState<SaleData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'saleDate',
    direction: 'desc'
  });

  useEffect(() => {
    if (uploadedData) {
      // Se há dados carregados, usar eles ao invés de buscar da API
      setSalesData(uploadedData);
      setFilteredData(uploadedData);
      setLoading(false);
      setError(null);
    } else {
      // Se não há dados carregados, buscar da API
      fetchSalesData();
    }
  }, [uploadedData]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    filterAndSortData();
  }, [debouncedSearchTerm, salesData, sortConfig]);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/vendas');
      const result: SalesApiResponse = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch sales data');
      }
      
      setSalesData(result.data);
      setFilteredData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortData = () => {
    let filtered = salesData;

    // Apply search filter
    if (debouncedSearchTerm.trim()) {
      filtered = salesData.filter(
        (sale) =>
          sale.customerName.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          sale.productName.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      const aValue = a[sortConfig.field];
      const bValue = b[sortConfig.field];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue, 'pt-BR');
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        const comparison = aValue - bValue;
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      }

      return 0;
    });

    setFilteredData(sorted);
  };

  const handleSort = (field: SortField) => {
    setSortConfig(prevConfig => ({
      field,
      direction: prevConfig.field === field && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const totalValue = filteredData.reduce((sum, sale) => sum + sale.totalValue, 0);

  const SortableHeader = ({ field, children, className = '' }: { 
    field: SortField; 
    children: React.ReactNode; 
    className?: string;
  }) => {
    const getSortIcon = () => {
      if (sortConfig.field !== field) {
        return <ChevronsUpDown className="ml-2 h-4 w-4" />;
      }
      return sortConfig.direction === 'asc' ? 
        <ChevronUp className="ml-2 h-4 w-4" /> : 
        <ChevronDown className="ml-2 h-4 w-4" />;
    };

    return (
      <TableHead 
        className={`cursor-pointer hover:bg-muted/50 ${className}`}
        onClick={() => handleSort(field)}
      >
        <div className="flex items-center whitespace-nowrap">
          {children}
          {getSortIcon()}
        </div>
      </TableHead>
    );
  };

  if (loading) {
    return <SalesTableSkeleton />;
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Resumo de Vendas Diárias</CardTitle>
          <CardDescription>Erro ao carregar dados</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={fetchSalesData} className="mt-4">
            Tentar Novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Resumo de Vendas Diárias</CardTitle>
            <CardDescription>
              {uploadedData 
                ? 'Dados carregados do arquivo .dat' 
                : 'Visualização modernizada dos dados de vendas diárias'
              }
            </CardDescription>
          </div>
          {!uploadedData && (
            <Button
              variant="outline"
              onClick={fetchSalesData}
              disabled={loading}
              size="sm"
            >
              {loading ? 'Carregando...' : 'Atualizar'}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search Field */}
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Buscar por cliente ou produto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            {searchTerm && (
              <Button
                variant="outline"
                onClick={() => setSearchTerm('')}
                size="sm"
              >
                Limpar
              </Button>
            )}
          </div>

          {/* Results Info */}
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>
              {filteredData.length} de {salesData.length} vendas
              {debouncedSearchTerm && ` (filtrado por "${debouncedSearchTerm}")`}
            </span>
            <span className="font-semibold">
              Total: {formatCurrency(totalValue)}
            </span>
          </div>

          {/* Sales Table */}
          <div className="border rounded-md overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableCaption>
                  {filteredData.length === 0 && debouncedSearchTerm
                    ? 'Nenhuma venda encontrada com os critérios de busca.'
                    : 'Lista de vendas do período selecionado'}
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <SortableHeader field="saleDate">Data da Venda</SortableHeader>
                    <SortableHeader field="customerName">Nome do Cliente</SortableHeader>
                    <SortableHeader field="productName">Nome do Produto</SortableHeader>
                    <SortableHeader field="quantity" className="text-right">Quantidade</SortableHeader>
                    <SortableHeader field="unitValue" className="text-right">Valor Unitário</SortableHeader>
                    <SortableHeader field="totalValue" className="text-right">Valor Total</SortableHeader>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        {debouncedSearchTerm ? 'Nenhuma venda encontrada.' : 'Não há vendas para exibir.'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredData.map((sale) => (
                      <TableRow key={sale.id} className="hover:bg-muted/50">
                        <TableCell className="whitespace-nowrap">{formatDate(sale.saleDate)}</TableCell>
                        <TableCell className="font-medium">{sale.customerName}</TableCell>
                        <TableCell className="max-w-xs truncate" title={sale.productName}>
                          {sale.productName}
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">{sale.quantity}</TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          {formatCurrency(sale.unitValue)}
                        </TableCell>
                        <TableCell className="text-right font-medium whitespace-nowrap">
                          {formatCurrency(sale.totalValue)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}