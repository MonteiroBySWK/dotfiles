import { NextResponse } from 'next/server';


type GetParams = {
  params: {
    projectId: string;
  };
};

export async function GET(request: Request, { params }: GetParams) {
  try {
    const { projectId } = params;
    const project = projectsRepo.getById(projectId);

    if (!project) {
      return NextResponse.json(
        { message: `Projeto com ID ${projectId} não encontrado.` },
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