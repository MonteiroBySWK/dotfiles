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