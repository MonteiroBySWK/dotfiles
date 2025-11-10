import { NextRequest, NextResponse } from 'next/server';
import { convertToVendaApiFormat } from '@/lib/dat-processor';

export async function POST(request: NextRequest) {
  try {
    const { data } = await request.json();

    if (!data || !Array.isArray(data)) {
      return NextResponse.json(
        { success: false, error: 'Dados inválidos fornecidos' },
        { status: 400 }
      );
    }

    // Converter dados para o formato da API Java
    const vendaData = convertToVendaApiFormat(data);

    // Enviar cada venda individualmente para a API
    const promises = vendaData.map(venda => 
      fetch('http://localhost:8080/vendas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(venda),
        signal: AbortSignal.timeout(10000),
      })
    );

    const responses = await Promise.allSettled(promises);
    const successCount = responses.filter(r => r.status === 'fulfilled' && r.value.ok).length;


    return NextResponse.json({
      success: true,
      message: `${successCount} de ${vendaData.length} vendas enviadas com sucesso`,
      recordsSent: successCount,
      totalRecords: vendaData.length,
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