/**
 * Dashboard Principal - Sistema REVIS
 * Página inicial com visão geral do sistema
 */

'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { CardStatistic } from '@/components/dashboard/CardStatistic';
import {
  Package,
  ShoppingCart,
  Factory,
  AlertTriangle,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  return (
    <ProtectedRoute>
      <DashboardLayout title="Dashboard">
        <PageHeader
          title="Dashboard"
          subtitle="Visão geral do sistema e indicadores principais"
          breadcrumbs={[
            { label: 'Início', href: '/' },
          ]}
        />
        
        <div className="mt-6">
          {/* Cards de Estatísticas */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <CardStatistic
          title="Estoque Total"
          value="87"
          description="ingredientes cadastrados"
          icon={Package}
          variant="primary"
        />
        
        <CardStatistic
          title="Pedidos Ativos"
          value="12"
          description="em processamento"
          icon={ShoppingCart}
          trend={{ value: 8, isPositive: true }}
        />
        
        <CardStatistic
          title="Produção Mensal"
          value="2.450"
          description="drinks produzidos"
          icon={Factory}
          trend={{ value: 12, isPositive: true }}
          variant="success"
        />
        
        <CardStatistic
          title="Alertas Ativos"
          value="5"
          description="requerem atenção"
          icon={AlertTriangle}
          variant="warning"
        />
      </div>

      {/* Gráficos e Tabelas */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {/* Estoque Baixo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" aria-hidden="true" />
              Estoque Baixo
            </CardTitle>
            <CardDescription>
              Ingredientes abaixo do estoque mínimo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ingrediente</TableHead>
                  <TableHead className="text-right">Atual</TableHead>
                  <TableHead className="text-right">Mínimo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Vodka</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="destructive">800 ml</Badge>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    1000 ml
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Xarope Morango</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="destructive">150 ml</Badge>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    500 ml
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Limão</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="destructive">5 un</Badge>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    20 un
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Próximos Eventos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" aria-hidden="true" />
              Próximos Eventos
            </CardTitle>
            <CardDescription>
              Eventos programados para este mês
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-foreground">
                    Festival de Verão
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Praia Central
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">15/11</p>
                  <Badge variant="outline">200 drinks</Badge>
                </div>
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-foreground">
                    Show Beneficente
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Teatro Municipal
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">22/11</p>
                  <Badge variant="outline">150 drinks</Badge>
                </div>
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-foreground">
                    Feira Gastronômica
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Parque da Cidade
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">28/11</p>
                  <Badge variant="outline">300 drinks</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance de Vendas */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-success" aria-hidden="true" />
            Performance de Vendas
          </CardTitle>
          <CardDescription>
            Produtos mais vendidos nos últimos 30 dias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead className="text-right">Vendas</TableHead>
                <TableHead className="text-right">Receita</TableHead>
                <TableHead className="text-right">Tendência</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">TROPICANA (270ml)</TableCell>
                <TableCell className="text-right">456</TableCell>
                <TableCell className="text-right">R$ 9.120,00</TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline" className="bg-success/10 text-success">
                    +15%
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">MOGINTO (270ml)</TableCell>
                <TableCell className="text-right">389</TableCell>
                <TableCell className="text-right">R$ 7.780,00</TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline" className="bg-success/10 text-success">
                    +8%
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">CAIPIRINHA (300ml)</TableCell>
                <TableCell className="text-right">312</TableCell>
                <TableCell className="text-right">R$ 6.240,00</TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline" className="bg-muted text-muted-foreground">
                    0%
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

