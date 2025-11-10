import { NextRequest, NextResponse } from 'next/server';
import { Reader } from '@/app/Reader';

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

    // Usar o Reader para processar o conteúdo
    const processedData = Reader(fileContent);

    return NextResponse.json({
      success: true,
      data: processedData,
      filename: file.name,
      size: file.size,
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