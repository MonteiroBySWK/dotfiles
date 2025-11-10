"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SaleData, VendaApiResponse, PaginatedResponse } from "@/types/sales";
import { SortConfig, SortField, SortDirection } from "@/types/sorting";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SalesTableSkeleton } from "./sales-table-skeleton";
import { formatCurrency, formatDate } from "@/lib/formatters";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SalesTableProps {
  onDataUploaded?: () => void;
}

export function SalesTable({ onDataUploaded }: SalesTableProps) {
  const [salesData, setSalesData] = useState<SaleData[]>([]);
  const [filteredData, setFilteredData] = useState<SaleData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: "saleDate",
    direction: "desc",
  });

  // Estados para paginação
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  
  // Estado separado para todos os dados (antes da paginação)
  const [allSalesData, setAllSalesData] = useState<SaleData[]>([]);

  // Adicionar efeito para recarregar quando dados são enviados
  useEffect(() => {
    if (onDataUploaded) {
      // Recarregar dados após upload
      const handleStorageChange = () => {
        fetchSalesData();
      };

      window.addEventListener("vendas-updated", handleStorageChange);
      return () =>
        window.removeEventListener("vendas-updated", handleStorageChange);
    }
  }, [onDataUploaded]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Aplicar filtro local nos dados já paginados pelo servidor
  useEffect(() => {
    console.log('🔍 Filter effect - salesData:', salesData.length, 'items, searchTerm:', debouncedSearchTerm);
    
    let filtered = salesData;

    // Apply search filter apenas nos dados já paginados pelo servidor  
    if (debouncedSearchTerm.trim()) {
      filtered = salesData.filter(
        (sale) =>
          sale.customerName
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          sale.productName
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase())
      );
    }

    console.log('✅ Filtered data:', filtered.length, 'items');
    
    // Ordenação é feita pelo servidor, apenas aplicamos filtro local
    setFilteredData(filtered);
  }, [salesData, debouncedSearchTerm]);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching data with params:', { currentPage, pageSize, sortConfig });
      
      // Construir parâmetros para server-side pagination
      const params = new URLSearchParams({
        page: currentPage.toString(),
        size: pageSize.toString(),
        sort: `${sortConfig.field},${sortConfig.direction}`
      });
      
      console.log('🌐 API URL:', `/api/vendas?${params}`);
      
      // Usar rota proxy para paginação (endpoint /vendas/paginado)
      const response = await fetch(`/api/vendas/paginado?${params}`);
      
      let result = null;
      try {
        const text = await response.text();
        result = text ? JSON.parse(text) : [];
      } catch (parseError) {
        console.warn('Resposta da API não é JSON válido, usando array vazio');
        result = [];
      }
      
      console.log('📊 API Response:', result);
      
      if (response.ok && result) {
        // Verificar se é formato Spring Page
        if (result.content && Array.isArray(result.content)) {
          // Spring Page format - usar dados de paginação do servidor
          const dataArray: VendaApiResponse[] = result.content;
          console.log('📋 Raw data from API:', dataArray.length, 'items');
          
          // Converter formato da API Java para formato da tabela
          const convertedData: SaleData[] = dataArray.map((venda: VendaApiResponse) => ({
            id: venda.id.toString(),
            saleDate: venda.dataVenda,
            customerName: venda.cliente.nome,
            productName: venda.produto.nome,
            quantity: venda.quantidade,
            unitValue: venda.valorUnitario,
            totalValue: venda.valorTotalVenda,
          }));
          
          console.log('✅ Converted data:', convertedData.length, 'items');
          console.log('📄 Pagination info:', {
            totalElements: result.totalElements,
            totalPages: result.totalPages,
            first: result.first,
            last: result.last
          });
          
          // Usar dados de paginação do Spring Page
          setSalesData(convertedData);
          setTotalElements(result.totalElements || 0);
          setTotalPages(result.totalPages || 0);
          setHasNext(!result.last);
          setHasPrevious(!result.first);
        } else if (Array.isArray(result)) {
          // Fallback para array simples (client-side pagination)
          console.log('📋 Fallback: Array format with', result.length, 'items');
          const dataArray: VendaApiResponse[] = result;
          const convertedData: SaleData[] = dataArray.map((venda: VendaApiResponse) => ({
            id: venda.id.toString(),
            saleDate: venda.dataVenda,
            customerName: venda.cliente.nome,
            productName: venda.produto.nome,
            quantity: venda.quantidade,
            unitValue: venda.valorUnitario,
            totalValue: venda.valorTotalVenda,
          }));
          
          setAllSalesData(convertedData);
          // Será processado no useEffect de processData
        }
      } else {
        console.log('❌ Response not OK or no result');
        setSalesData([]);
        setTotalElements(0);
        setTotalPages(0);
        setHasNext(false);
        setHasPrevious(false);
      }
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      setError('Erro ao carregar dados de vendas');
      setSalesData([]);
      setTotalElements(0);
      setTotalPages(0);
      setHasNext(false);
      setHasPrevious(false);
    } finally {
      setLoading(false);
    }
  };

  // Função para processar paginação client-side (fallback)
  const processData = useCallback(() => {
    if (allSalesData.length === 0) {
      return;
    }

    // Aplicar ordenação
    const sortedData = [...allSalesData].sort((a, b) => {
      const aValue = a[sortConfig.field];
      const bValue = b[sortConfig.field];

      if (typeof aValue === "string" && typeof bValue === "string") {
        const comparison = aValue.localeCompare(bValue, "pt-BR");
        return sortConfig.direction === "asc" ? comparison : -comparison;
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }

      return 0;
    });

    // Aplicar paginação
    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = sortedData.slice(startIndex, endIndex);

    setSalesData(paginatedData);

    // Atualizar estados de paginação
    const totalElements = allSalesData.length;
    const totalPages = Math.ceil(totalElements / pageSize);
    setTotalElements(totalElements);
    setTotalPages(totalPages);
    setHasNext(currentPage < totalPages - 1);
    setHasPrevious(currentPage > 0);
  }, [allSalesData, currentPage, pageSize, sortConfig]);

  // Effect para buscar dados quando página, tamanho ou ordenação mudarem
  useEffect(() => {
    console.log('🚀 useEffect triggered - fetching data');
    fetchSalesData();
  }, [currentPage, pageSize, sortConfig.field, sortConfig.direction]);

  // Effect para processar dados client-side quando necessário (fallback)
  useEffect(() => {
    if (allSalesData.length > 0) {
      processData();
    }
  }, [processData]);

  const handleSort = (field: SortField) => {
    setSortConfig((prevConfig) => ({
      field,
      direction:
        prevConfig.field === field && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
    setCurrentPage(0); // Reset to first page when sorting
    // fetchSalesData será chamado automaticamente pelo useEffect
  };

  const totalValue = filteredData.reduce(
    (sum, sale) => sum + sale.totalValue,
    0
  );

  const SortableHeader = ({
    field,
    children,
    className = "",
  }: {
    field: SortField;
    children: React.ReactNode;
    className?: string;
  }) => {
    const getSortIcon = () => {
      if (sortConfig.field !== field) {
        return <ChevronsUpDown className="ml-2 h-4 w-4" />;
      }
      return sortConfig.direction === "asc" ? (
        <ChevronUp className="ml-2 h-4 w-4" />
      ) : (
        <ChevronDown className="ml-2 h-4 w-4" />
      );
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
          <Button onClick={() => fetchSalesData()} className="mt-4">
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
              Visualização modernizada dos dados de vendas diárias
            </CardDescription>
          </div>
          <Button
            variant="outline"
            onClick={() => fetchSalesData()}
            disabled={loading}
            size="sm"
          >
            {loading ? "Carregando..." : "Atualizar"}
          </Button>
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
                onClick={() => setSearchTerm("")}
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
              {debouncedSearchTerm &&
                ` (filtrado por "${debouncedSearchTerm}")`}
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
                  {filteredData.length === 0 &&
                    debouncedSearchTerm &&
                    "Nenhuma venda encontrada com os critérios de busca."}
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <SortableHeader field="saleDate">
                      Data da Venda
                    </SortableHeader>
                    <SortableHeader field="customerName">
                      Nome do Cliente
                    </SortableHeader>
                    <SortableHeader field="productName">
                      Nome do Produto
                    </SortableHeader>
                    <SortableHeader field="quantity" className="text-right">
                      Quantidade
                    </SortableHeader>
                    <SortableHeader field="unitValue" className="text-right">
                      Valor Unitário
                    </SortableHeader>
                    <SortableHeader field="totalValue" className="text-right">
                      Valor Total
                    </SortableHeader>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-muted-foreground"
                      >
                        {debouncedSearchTerm
                          ? "Nenhuma venda encontrada."
                          : "Não há vendas para exibir."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredData.map((sale) => (
                      <TableRow key={sale.id} className="hover:bg-muted/50">
                        <TableCell className="whitespace-nowrap">
                          {formatDate(sale.saleDate)}
                        </TableCell>
                        <TableCell className="font-medium">
                          {sale.customerName}
                        </TableCell>
                        <TableCell
                          className="max-w-xs truncate"
                          title={sale.productName}
                        >
                          {sale.productName}
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          {sale.quantity}
                        </TableCell>
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

        {/* Componente de Paginação */}
        <div className="flex items-center justify-between px-4 py-4 border-t">
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Itens por página</p>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(0); // Reset to first page
                }}
                className="h-8 w-[70px] rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Página {currentPage + 1} de {totalPages}
            </div>
            <div className="text-sm text-muted-foreground">
              {totalElements} item(s) no total
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCurrentPage(0);
              }}
              disabled={!hasPrevious}
            >
              Primeira
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCurrentPage((prev) => Math.max(0, prev - 1));
              }}
              disabled={!hasPrevious}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
              }}
              disabled={!hasNext}
            >
              Próxima
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCurrentPage(totalPages - 1);
              }}
              disabled={!hasNext}
            >
              Última
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
