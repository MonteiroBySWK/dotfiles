import { NextResponse } from 'next/server';
import { mockProjects } from '@/data';

type GetParams = {
  params: {
    id: string;
  };
};

export async function GET(request: Request, { params }: GetParams) {
  try {
    const { id } = params;
    const project = mockProjects.find((p) => p.id === id);

    if (!project) {
      return NextResponse.json(
        { message: `Projeto com ID ${id} não encontrado.` },
        { status: 404 }
      );
    }

    // Retorna o projeto dentro do envelope 'data'
    return NextResponse.json({ data: project });
  } catch (error) {
    console.error('[PROJECT_ID_GET]', error);
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
}