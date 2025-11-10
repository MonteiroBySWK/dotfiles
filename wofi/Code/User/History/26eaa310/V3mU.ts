import { NextRequest, NextResponse } from 'next/server';
import type { ItemRequestBody } from '@/types/sales';

export async function POST(request: NextRequest) {
  try {
    const { data } = await request.json();

    if (!data || !Array.isArray(data)) {
      return NextResponse.json(
        { success: false, error: 'Dados inválidos fornecidos' },
        { status: 400 }
      );
    }

    // Usar os dados exatamente como no Reader.tsx - array de ItemRequestBody
    const requestBody: ItemRequestBody[] = data;

    console.log('Enviando dados para API Java:', requestBody.length, 'registros');

    // Enviar array completo para a API Java (mesmo padrão do Reader.tsx)
    const URL_API = 'http://localhost:8080/venda';
    
    const res = await fetch(URL_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (res.ok) {
      console.log('HTTP STATUS 200/202 - Dados enviados com sucesso');
      
      return NextResponse.json({
        success: true,
        message: `${requestBody.length} registros enviados com sucesso`,
        recordsSent: requestBody.length,
        totalRecords: requestBody.length,
      });
    } else {
      const errorText = await res.text();
      throw new Error(`Erro HTTP: ${res.status} - ${errorText}`);
    }

  } catch (error) {
    console.error('Erro ao enviar o array:', error);
    
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