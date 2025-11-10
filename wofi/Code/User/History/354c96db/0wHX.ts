export interface SaleData {
  id: string;
  saleDate: string;
  customerName: string;
  productName: string;
  quantity: number;
  unitValue: number;
  totalValue: number;
}

export interface SalesApiResponse {
  success: boolean;
  data: SaleData[];
  total: number;
  error?: string;
}

// Tipos para processamento de arquivos .dat (baseados no Reader.tsx)
export type ProductRequestBody = {
  id: number;
  nome_produto: string;
  valor_unit: number;
};

export type ClientRequestBody = {
  id_cliente: number;
  nome_cliente: string;
};

export type ItemRequestBody = {
  data_venda: string;
  qtd_vendida: number;
  produto: ProductRequestBody;
  cliente: ClientRequestBody;
};

// Tipos para o novo formato da API Java
export interface VendaApiResponse {
  id: number;
  dataVenda: string;
  quantidade: number;
  valorUnitario: number;
  valorTotalVenda: number;
  produto: {
    id: string;
    nome: string;
    valorUnitario: number;
  };
  cliente: {
    id: string;
    nome: string;
  };
}