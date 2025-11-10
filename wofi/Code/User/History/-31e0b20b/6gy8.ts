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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('🚀 Enviando dados para API Java:', body.length, 'registros');
    console.log('🌐 URL da API:', `${process.env.NEXT_PUBLIC_API_URL}/vendas`);
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30000), // 30 segundos de timeout para POST
    });

    console.log('📊 Response status:', response.status);
    console.log('✅ Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro na API Java:', response.status, errorText);
      return NextResponse.json(
        { error: `Erro ao enviar dados para API Java: ${response.status}` },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log('✅ Dados enviados com sucesso para API Java');
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('❌ Erro ao conectar com API Java:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor - API Java indisponível' },
      { status: 500 }
    );
  }
}