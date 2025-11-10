'use client';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Backlog() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Backlog - Em Construção</CardTitle>
        <CardDescription>
          Este componente está sendo refatorado para usar a nova arquitetura com hooks e API routes.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
