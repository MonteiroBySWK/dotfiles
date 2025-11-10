export type SortField = 'saleDate' | 'customerName' | 'productName' | 'quantity' | 'unitValue' | 'totalValue';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}