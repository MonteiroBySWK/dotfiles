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