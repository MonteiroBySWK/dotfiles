import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { data } = await request.json();

    if (!data || !Array.isArray(data)) {
      return NextResponse.json(
        { success: false, error: 'Dados inválidos fornecidos' },
        { status: 400 }
      );
    }

    // Enviar dados para a API externa
    const sendResponse = await fetch('http://localhost:8080/send_vendas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(10000), // 10 segundos timeout
    });

    if (!sendResponse.ok) {
      throw new Error(`Erro na API externa: ${sendResponse.status} - ${sendResponse.statusText}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Dados enviados com sucesso para a API',
      recordsSent: data.length,
    });

  } catch (error) {
    console.error('Erro ao enviar dados para API externa:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Erro desconhecido ao enviar dados';
    
    return NextResponse.json(
      { 
        success: false, 
        error: `Falha ao enviar dados: ${errorMessage}`,
        details: 'Verifique se a API na porta 8080 está rodando e acessível'
      },
      { status: 500 }
    );
  }
}