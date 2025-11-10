import { SalesTable } from '@/components/custom/sales-table';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Varejo Rápido</h1>
          <p className="text-muted-foreground mt-2">
            Sistema modernizado de visualização de vendas diárias
          </p>
        </div>
        
        <SalesTable />
      </div>
    </div>
  );
}
