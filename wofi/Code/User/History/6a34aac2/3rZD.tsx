/**
 * Página de Relatórios
 * Sistema REVIS - REQ-18
 */

'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RelatorioEstoque } from '@/components/relatorios/RelatorioEstoque';
import { RelatorioPerdas } from '@/components/relatorios/RelatorioPerdas';
import { RelatorioProducao } from '@/components/relatorios/RelatorioProducao';
import { RelatorioVendas } from '@/components/relatorios/RelatorioVendas';
import { FileText, TrendingDown, Factory, DollarSign } from 'lucide-react';

export default function RelatoriosPage() {
  const [activeTab, setActiveTab] = useState('estoque');

  return (
    <ProtectedRoute>
      <DashboardLayout title="Relatórios">
        {/* Header */}
        <PageHeader
          title="Relatórios e Análises"
          subtitle="Visualize e exporte relatórios de estoque, produção, vendas e perdas"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Relatórios' }
          ]}
        />

        <div className="mt-6 space-y-6">
          {/* Cards de Métricas Rápidas */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Ingredientes</p>
                  <p className="text-lg font-semibold">Cadastrados</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                  <TrendingDown className="h-5 w-5 text-warning" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Perdas</p>
                  <p className="text-lg font-semibold">Registradas</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                  <Factory className="h-5 w-5 text-success" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Produção</p>
                  <p className="text-lg font-semibold">Lotes Criados</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                  <DollarSign className="h-5 w-5 text-accent" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Vendas</p>
                  <p className="text-lg font-semibold">Total Período</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Tabs de Relatórios */}
          <Card className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="estoque">
                  <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
                  Estoque
                </TabsTrigger>
                <TabsTrigger value="perdas">
                  <TrendingDown className="mr-2 h-4 w-4" aria-hidden="true" />
                  Perdas
                </TabsTrigger>
                <TabsTrigger value="producao">
                  <Factory className="mr-2 h-4 w-4" aria-hidden="true" />
                  Produção
                </TabsTrigger>
                <TabsTrigger value="vendas">
                  <DollarSign className="mr-2 h-4 w-4" aria-hidden="true" />
                  Vendas
                </TabsTrigger>
              </TabsList>

              <TabsContent value="estoque" className="mt-6">
                <RelatorioEstoque />
              </TabsContent>

              <TabsContent value="perdas" className="mt-6">
                <RelatorioPerdas />
              </TabsContent>

              <TabsContent value="producao" className="mt-6">
                <RelatorioProducao />
              </TabsContent>

              <TabsContent value="vendas" className="mt-6">
                <RelatorioVendas />
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
