import { NextRequest, NextResponse } from 'next/server';
import { convertToVendaApiFormat, extractUniqueProducts, extractUniqueClients } from '@/lib/dat-processor';

export async function POST(request: NextRequest) {
  try {
    const { data } = await request.json();

    if (!data || !Array.isArray(data)) {
      return NextResponse.json(
        { success: false, error: 'Dados inválidos fornecidos' },
        { status: 400 }
      );
    }

    // Extrair produtos e clientes únicos
    const uniqueProducts = extractUniqueProducts(data);
    const uniqueClients = extractUniqueClients(data);

    // 1. Criar produtos primeiro
    const productPromises = uniqueProducts.map(produto => 
      fetch('http://localhost:8080/produtos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(produto),
        signal: AbortSignal.timeout(10000),
      }).catch(err => ({ ok: false, error: err.message }))
    );

    // 2. Criar clientes
    const clientPromises = uniqueClients.map(cliente => 
      fetch('http://localhost:8080/clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cliente),
        signal: AbortSignal.timeout(10000),
      }).catch(err => ({ ok: false, error: err.message }))
    );

    // Aguardar criação de produtos e clientes
    await Promise.allSettled([...productPromises, ...clientPromises]);

    // 3. Converter dados para o formato da API Java
    const vendaData = convertToVendaApiFormat(data);

    // 4. Criar vendas
    const vendaPromises = vendaData.map(venda => 
      fetch('http://localhost:8080/vendas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(venda),
        signal: AbortSignal.timeout(10000),
      }).catch(err => ({ ok: false, error: err.message }))
    );

    const vendaResponses = await Promise.allSettled(vendaPromises);
    const successCount = vendaResponses.filter(r => r.status === 'fulfilled' && r.value?.ok).length;


    return NextResponse.json({
      success: true,
      message: `Processamento concluído: ${successCount} vendas, ${uniqueProducts.length} produtos, ${uniqueClients.length} clientes`,
      vendas: {
        sent: successCount,
        total: vendaData.length
      },
      produtos: {
        total: uniqueProducts.length
      },
      clientes: {
        total: uniqueClients.length
      }
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