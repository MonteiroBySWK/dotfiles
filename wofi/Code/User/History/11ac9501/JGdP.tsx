import { 
  Box, 
  Clock, 
  Code, 
  Users, 
  TrendingUp, 
  DollarSign, 
  GitBranch, 
  Bug, 
  CheckCircle,
  AlertTriangle,
  Calendar,
  Target
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export default function MainDashboard() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Geral</h1>
          <p className="text-muted-foreground">
            Visão geral dos projetos e métricas da empresa
          </p>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Projetos Ativos
            </CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 desde o último mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Projetos Concluídos
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">
              +5 este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Desenvolvedores
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              4 sênior, 4 pleno
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Receita Mensal
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 85.4K</div>
            <p className="text-xs text-muted-foreground">
              +12% desde o último mês
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cartões de Detalhes */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Status dos Projetos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Em Desenvolvimento</span>
              <span className="text-sm font-medium">8</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Em Testes</span>
              <span className="text-sm font-medium">3</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Aguardando Deploy</span>
              <span className="text-sm font-medium">1</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Manutenção</span>
              <span className="text-sm font-medium">2</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              Atividade de Desenvolvimento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Commits esta semana</span>
              <span className="text-sm font-medium">156</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Pull Requests abertos</span>
              <span className="text-sm font-medium">23</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Issues abertas</span>
              <span className="text-sm font-medium">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Bugs críticos</span>
              <span className="text-sm font-medium text-red-600">3</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Prazos e Entregas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Prazo médio</span>
              <span className="text-sm font-medium">18 dias</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Entregas no prazo</span>
              <span className="text-sm font-medium text-green-600">89%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Entregas pendentes</span>
              <span className="text-sm font-medium">4</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Próximo deadline</span>
              <span className="text-sm font-medium">3 dias</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas e Notificações */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Alertas Importantes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
              <Bug className="h-4 w-4 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium">3 bugs críticos</p>
                <p className="text-xs text-muted-foreground">
                  Requerem atenção imediata
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <Calendar className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Projeto App Mobile</p>
                <p className="text-xs text-muted-foreground">
                  Deadline em 3 dias
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Performance da Equipe
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Produtividade</span>
              <span className="text-sm font-medium text-green-600">+15%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Satisfação do cliente</span>
              <span className="text-sm font-medium text-green-600">4.8/5.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Tempo médio de desenvolvimento</span>
              <span className="text-sm font-medium">12 dias</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Taxa de retrabalho</span>
              <span className="text-sm font-medium text-green-600">8%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
