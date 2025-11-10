import { NextResponse } from 'next/server';

export interface SaleData {
  id: string;
  saleDate: string;
  customerName: string;
  productName: string;
  quantity: number;
  unitValue: number;
  totalValue: number;
}

// Mock data for demonstration
const mockSalesData: SaleData[] = [
  {
    id: '1',
    saleDate: '2024-10-01',
    customerName: 'João Silva',
    productName: 'Smartphone Samsung Galaxy',
    quantity: 1,
    unitValue: 1200.00,
    totalValue: 1200.00,
  },
  {
    id: '2',
    saleDate: '2024-10-01',
    customerName: 'Maria Santos',
    productName: 'Fones de Ouvido Bluetooth',
    quantity: 2,
    unitValue: 150.00,
    totalValue: 300.00,
  },
  {
    id: '3',
    saleDate: '2024-10-02',
    customerName: 'Pedro Oliveira',
    productName: 'Tablet iPad',
    quantity: 1,
    unitValue: 2500.00,
    totalValue: 2500.00,
  },
  {
    id: '4',
    saleDate: '2024-10-02',
    customerName: 'Ana Costa',
    productName: 'Carregador Portátil',
    quantity: 3,
    unitValue: 80.00,
    totalValue: 240.00,
  },
  {
    id: '5',
    saleDate: '2024-10-02',
    customerName: 'Carlos Ferreira',
    productName: 'Smartphone iPhone',
    quantity: 1,
    unitValue: 3500.00,
    totalValue: 3500.00,
  },
  {
    id: '6',
    saleDate: '2024-10-03',
    customerName: 'Lucia Mendes',
    productName: 'Smartwatch Apple',
    quantity: 1,
    unitValue: 1800.00,
    totalValue: 1800.00,
  },
  {
    id: '7',
    saleDate: '2024-10-03',
    customerName: 'Roberto Lima',
    productName: 'Capa Protetora',
    quantity: 5,
    unitValue: 25.00,
    totalValue: 125.00,
  },
  {
    id: '8',
    saleDate: '2024-10-03',
    customerName: 'Fernanda Rocha',
    productName: 'Mouse Wireless',
    quantity: 2,
    unitValue: 120.00,
    totalValue: 240.00,
  },
];

export async function GET() {
  try {
    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return NextResponse.json({
      success: true,
      data: mockSalesData,
      total: mockSalesData.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sales data' },
      { status: 500 }
    );
  }
}