import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Extrair parâmetros de query
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '0';
    const size = searchParams.get('size') || '10';
    const sortBy = searchParams.get('sortBy') || 'id';
    const sortDir = searchParams.get('sortDir') || 'asc';

    // Construir URL da API Java
    const apiUrl = new URL(`${process.env.NEXT_PUBLIC_API_URL}/vendas/paginado`);
    apiUrl.searchParams.set('page', page);
    apiUrl.searchParams.set('size', size);
    apiUrl.searchParams.set('sortBy', sortBy);
    apiUrl.searchParams.set('sortDir', sortDir);
    
    console.log('🌐 Calling Java API:', apiUrl.toString());
    
    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000), // 10 segundos de timeout
    });

    if (!response.ok) {
      console.error('❌ Java API error:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Erro ao buscar vendas paginadas da API Java' },
        { status: response.status }
      );
    }

    const vendas = await response.json();
    console.log('✅ Java API response:', {
      totalElements: vendas.totalElements,
      totalPages: vendas.totalPages,
      currentPage: vendas.number,
      size: vendas.size,
      contentLength: vendas.content?.length
    });
    
    return NextResponse.json(vendas);
  } catch (error) {
    console.error('❌ Error connecting to Java API:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor - API Java indisponível' },
      { status: 500 }
    );
  }
}