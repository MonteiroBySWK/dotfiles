import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Extrair parâmetros de query
    const { searchParams } = new URL(request.url);
    const termo = searchParams.get('termo');
    const page = searchParams.get('page') || '0';
    const size = searchParams.get('size') || '10';
    
    if (!termo) {
      return NextResponse.json(
        { success: false, error: 'Termo de busca é obrigatório' },
        { status: 400 }
      );
    }

    // Construir URL da API Java
    const apiUrl = new URL(`${process.env.NEXT_PUBLIC_API_URL}/vendas/buscar`);
    apiUrl.searchParams.set('termo', termo);
    apiUrl.searchParams.set('page', page);
    apiUrl.searchParams.set('size', size);
    
    console.log('🔍 Calling Java search API:', apiUrl.toString());
    
    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000), // 10 segundos de timeout
    });

    if (!response.ok) {
      console.error('❌ Java search API error:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Erro ao buscar vendas na API Java' },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log('✅ Java search API response:', {
      query: termo,
      resultsCount: result.content?.length || 0
    });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('❌ Error in search API:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor - API Java indisponível' },
      { status: 500 }
    );
  }
}