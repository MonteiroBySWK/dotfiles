import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Extrair parâmetros de query da URL
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '0';
    const size = searchParams.get('size') || '10';
    const sort = searchParams.get('sort') || 'dataVenda';
    
    // Construir URL com parâmetros de paginação
    const apiUrl = new URL('http://localhost:8080/vendas/paginado');
    apiUrl.searchParams.set('page', page);
    apiUrl.searchParams.set('size', size);
    apiUrl.searchParams.set('sort', sort);
    
    console.log('Fazendo requisição paginada para:', apiUrl.toString());
    
    // Proxy para a API Java para evitar problemas de CORS
    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`Erro na API Java: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    
    // Retornar os dados paginados exatamente como vêm da API Java
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Erro ao buscar dados da API Java:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Erro desconhecido ao conectar com a API';
    
    return NextResponse.json(
      { 
        success: false, 
        error: `Falha ao conectar com a API Java: ${errorMessage}`,
        details: 'Verifique se a API na porta 8080 está rodando e acessível'
      },
      { status: 500 }
    );
  }
}