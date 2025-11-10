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
    console.log('URL da API:', `${process.env.NEXT_PUBLIC_API_URL}/vendas`);
    console.log('Dados que serão enviados (primeiros 2):', JSON.stringify(requestBody.slice(0, 2), null, 2));

    // Enviar array completo para a API Java
    const URL_API = `${process.env.NEXT_PUBLIC_API_URL}/vendas`;
    
    console.log('Fazendo requisição para:', URL_API);
    
    const res = await fetch(URL_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Response status:', res.status);
    console.log('Response ok:', res.ok);

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
      console.error('Erro na resposta da API:', errorText);
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