import { NextRequest, NextResponse } from 'next/server';
import { processDatFileContent, convertToSalesData } from '@/lib/dat-processor';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Nenhum arquivo fornecido' },
        { status: 400 }
      );
    }

    if (!file.name.toLowerCase().endsWith('.dat')) {
      return NextResponse.json(
        { success: false, error: 'Apenas arquivos .dat são aceitos' },
        { status: 400 }
      );
    }

    // Converter o arquivo para Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Converter Buffer para string (assumindo encoding UTF-8, pode precisar ajustar)
    const fileContent = buffer.toString('utf-8');

    // Processar o conteúdo do arquivo .dat usando a mesma lógica do Reader
    const datData = processDatFileContent(fileContent);
    
    // Converter para o formato da tabela de vendas
    const salesData = convertToSalesData(datData);

    // Enviar dados para a API externa (mesmo endpoint que o Reader usava)
    try {
      const sendResponse = await fetch('http://localhost:8080/send_vendas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datData), // Enviar dados no formato original
        signal: AbortSignal.timeout(10000), // 10 segundos timeout
      });

      if (!sendResponse.ok) {
        console.warn(`Aviso: Falha ao enviar dados para API externa: ${sendResponse.status}`);
        // Não falha o processo, apenas registra o aviso
      }
    } catch (sendError) {
      console.warn('Aviso: Erro ao enviar dados para API externa:', sendError);
      // Não falha o processo, apenas registra o aviso
    }

    return NextResponse.json({
      success: true,
      data: salesData,
      originalData: datData, // Dados no formato original do .dat
      filename: file.name,
      size: file.size,
      recordsProcessed: salesData.length,
    });

  } catch (error) {
    console.error('Erro ao processar arquivo .dat:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro interno do servidor' 
      },
      { status: 500 }
    );
  }
}