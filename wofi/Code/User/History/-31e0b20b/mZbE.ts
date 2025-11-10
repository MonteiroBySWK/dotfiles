import { NextResponse } from 'next/server';import { NextResponse } from 'next/server';



export async function GET() {export interface SaleData {

  try {  id: string;

    // Proxy para a API Java para evitar problemas de CORS  saleDate: string;

    const response = await fetch('http://localhost:8080/vendas', {  customerName: string;

      method: 'GET',  productName: string;

      headers: {  quantity: number;

        'Content-Type': 'application/json',  unitValue: number;

      },  totalValue: number;

      signal: AbortSignal.timeout(10000), // 10 segundos timeout}

    });

export async function GET() {

    if (!response.ok) {  try {

      throw new Error(`Erro na API Java: ${response.status} - ${response.statusText}`);    // Conectar com a API externa na porta 8080

    }    const response = await fetch('http://localhost:8080/vendas', {

      method: 'GET',

    const data = await response.json();      headers: {

            'Content-Type': 'application/json',

    // Retornar os dados exatamente como vêm da API Java      },

    return NextResponse.json(data);      // Adicionar timeout para evitar travamento

          signal: AbortSignal.timeout(10000), // 10 segundos

  } catch (error) {    });

    console.error('Erro ao buscar dados da API Java:', error);

        if (!response.ok) {

    const errorMessage = error instanceof Error       throw new Error(`Erro na API externa: ${response.status} - ${response.statusText}`);

      ? error.message     }

      : 'Erro desconhecido ao conectar com a API';

        const externalData = await response.json();

    return NextResponse.json(    

      {     // Assumindo que a API externa retorna dados no formato esperado

        success: false,     // Se o formato for diferente, adapte aqui

        error: `Falha ao conectar com a API Java: ${errorMessage}`,    const salesData: SaleData[] = Array.isArray(externalData) 

        details: 'Verifique se a API na porta 8080 está rodando e acessível'      ? externalData.map((item: any, index: number) => ({

      },          id: item.id || `api-${index + 1}`,

      { status: 500 }          saleDate: item.saleDate || item.data_venda || '',

    );          customerName: item.customerName || item.nome_cliente || '',

  }          productName: item.productName || item.nome_produto || '',

}          quantity: item.quantity || item.qtd_vendida || 0,
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