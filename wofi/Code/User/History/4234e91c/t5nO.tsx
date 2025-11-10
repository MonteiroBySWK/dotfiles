'use client';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface BacklogProps {
  projectId?: string;
}

export default function Backlog({ projectId }: BacklogProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Backlog{projectId ? ` - Projeto ${projectId}` : ''} - Em Construção</CardTitle>
        <CardDescription>
          Este componente está sendo refatorado para usar a nova arquitetura com hooks e API routes.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
