import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Extrair parâmetros da URL da requisição
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '0';
    const size = searchParams.get('size') || '10';
    const sort = searchParams.get('sort') || 'id,desc';
    
    // Fazer proxy da requisição para a API Java
    const apiUrl = new URL(`${process.env.NEXT_PUBLIC_API_URL}/vendas`);
    apiUrl.searchParams.set('page', page);
    apiUrl.searchParams.set('size', size);
    apiUrl.searchParams.set('sort', sort);
    
    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000), // 10 segundos de timeout
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Erro ao buscar vendas da API Java' },
        { status: response.status }
      );
    }

    const vendas = await response.json();
    return NextResponse.json(vendas);
  } catch (error) {
    console.error('Erro ao conectar com API Java:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor - API Java indisponível' },
      { status: 500 }
    );
  }
}