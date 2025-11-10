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

export async function GET() {
  try {
    // Conectar com a API externa na porta 8080
    const response = await fetch('http://localhost:8080/vendas', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Adicionar timeout para evitar travamento
      signal: AbortSignal.timeout(10000), // 10 segundos
    });

    if (!response.ok) {
      throw new Error(`Erro na API externa: ${response.status} - ${response.statusText}`);
    }

    const externalData = await response.json();
    
    // Assumindo que a API externa retorna dados no formato esperado
    // Se o formato for diferente, adapte aqui
    const salesData: SaleData[] = Array.isArray(externalData) 
      ? externalData.map((item: any, index: number) => ({
          id: item.id || `api-${index + 1}`,
          saleDate: item.saleDate || item.data_venda || '',
          customerName: item.customerName || item.nome_cliente || '',
          productName: item.productName || item.nome_produto || '',
          quantity: item.quantity || item.qtd_vendida || 0,
          unitValue: item.unitValue || item.valor_unit || 0,
          totalValue: item.totalValue || (item.qtd_vendida * item.valor_unit) || 0,
        }))
      : [];
    
    return NextResponse.json({
      success: true,
      data: salesData,
      total: salesData.length,
    });
  } catch (error) {
    console.error('Erro ao buscar dados da API externa:', error);
    
    // Retornar erro mais específico
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Erro desconhecido ao conectar com a API';
    
    return NextResponse.json(
      { 
        success: false, 
        error: `Falha ao conectar com a API de vendas: ${errorMessage}`,
        details: 'Verifique se a API na porta 8080 está rodando e acessível'
      },
      { status: 500 }
    );
  }
}