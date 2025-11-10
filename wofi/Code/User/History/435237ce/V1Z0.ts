import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Extrair parâmetros de query da URL
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    
    if (!query || query.trim() === '') {
      return NextResponse.json(
        { error: 'Parâmetro query é obrigatório' },
        { status: 400 }
      );
    }
    
    // Construir URL para o endpoint de busca da API Java
    const apiUrl = new URL('http://localhost:8080/vendas/buscar');
    apiUrl.searchParams.set('query', query.trim());
    
    console.log('🔍 Calling Java search API:', apiUrl.toString());
    
    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000), // 10 segundos de timeout
    });

    if (!response.ok) {
      console.error('❌ Java API search error:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Erro ao buscar vendas na API Java' },
        { status: response.status }
      );
    }

    const vendas = await response.json();
    console.log('✅ Java search API response:', {
      query,
      resultsCount: Array.isArray(vendas) ? vendas.length : 0
    });
    
    return NextResponse.json(vendas);
  } catch (error) {
    console.error('❌ Error connecting to Java search API:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor - API Java indisponível' },
      { status: 500 }
    );
  }
}