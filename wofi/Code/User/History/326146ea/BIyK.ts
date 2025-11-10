import { NextResponse } from 'next/server';
import { projectRepository } from '@/data';

type GetParams = {
  params: {
    id: string;
  };
};

export async function GET(request: Request, { params }: GetParams) {
  try {
    const { id } = params;
    console.log(id)
    // A ideia é que aqui venha da API na realidade
    const project = await projectRepository.getById(id);

    if (!project) {
      return NextResponse.json(
        { message: `Projeto com ID ${id} não encontrado.` },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: project });
  } catch (error) {
    console.error('[PROJECT_ID_GET]', error);
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
}