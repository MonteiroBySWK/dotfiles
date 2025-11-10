"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Target,
  Calendar,
  Plus,
  Edit,
  Eye,
  Filter,
  Download,
  PieChart,
  BarChart3,
  Clock,
  CheckCircle
} from "lucide-react"
import { PageHeader } from "@/components/layout/PageHeader"
import { StatCard } from "@/components/common"
import { useFinancialStore } from "@/stores/financialStore"


export default function BudgetsPage() {
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [filterPeriod, setFilterPeriod] = useState("all")

  const { 
    budgets, 
    loading: budgetsLoading, 
    error: budgetsError, 
    fetchBudgets,
    getBudgetStats,
    getBudgetsByCategory,
  } = useFinancialStore()

  useEffect(() => {
    fetchBudgets()
  }, [fetchBudgets])

  const budgetStats = getBudgetStats()
  const budgetCategories = getBudgetsByCategory()

  const filteredBudgets = budgets.filter(budget => {
    const matchesStatus = filterStatus === "all" || budget.status === filterStatus
    const matchesDepartment = filterDepartment === "all" || budget.department === filterDepartment
    const matchesPeriod = filterPeriod === "all" || budget.period === filterPeriod
    return matchesStatus && matchesDepartment && matchesPeriod
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-track":
        return "default"
      case "under-budget":
        return "secondary"
      case "over-budget":
        return "destructive"
      case "completed":
        return "outline"
      default:
        return "outline"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "on-track":
        return "No Prazo"
      case "under-budget":
        return "Abaixo do Orçamento"
      case "over-budget":
        return "Acima do Orçamento"
      case "completed":
        return "Concluído"
      default:
        return "Em Análise"
    }
  }

  const getPercentageColor = (percentage: number) => {
    if (percentage > 100) return "text-red-600"
    if (percentage > 90) return "text-orange-600"
    if (percentage > 75) return "text-yellow-600"
    return "text-green-600"
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const handleCreateBudget = () => {
    console.log("Criar novo orçamento")
  }

  const handleViewBudget = (budgetId: string) => {
    setSelectedBudget(budgetId)
  }

  const handleEditBudget = (budgetId: string) => {
    console.log(`Editar orçamento: ${budgetId}`)
  }

  return (
    <>
      <PageHeader
        title="Orçamentos"
        description="Gerencie e monitore orçamentos departamentais"
        actions={[
          {
            label: "Novo Orçamento",
            icon: Plus,
            onClick: handleCreateBudget
          }
        ]}
        badge={{
          label: `${budgetStats.overBudget} acima do limite`,
          variant: budgetStats.overBudget > 0 ? "destructive" : "secondary"
        }}
      />

      {/* Estatísticas Principais - Using new StatCard component with responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Orçamento Total"
          value={formatCurrency(budgetStats.totalBudget)}
          description={`${budgetStats.activeBudgets} orçamentos ativos`}
          icon={DollarSign}
          iconColor="text-blue-600"
        />
        <StatCard
          title="Valor Gasto"
          value={formatCurrency(budgetStats.spentAmount)}
          description={`${budgetStats.spentPercentage}% do total`}
          icon={TrendingUp}
          iconColor="text-orange-600"
        />
        <StatCard
          title="Disponível"
          value={formatCurrency(budgetStats.remainingAmount)}
          description="Restante para uso"
          icon={Target}
          iconColor="text-green-600"
          className="[&_.text-2xl]:text-green-600"
        />
        <StatCard
          title="Alertas"
          value={budgetStats.overBudget.toString()}
          description="Acima do orçamento"
          icon={AlertTriangle}
          iconColor="text-red-600"
          className="[&_.text-2xl]:text-red-600"
        />
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="on-track">No Prazo</SelectItem>
              <SelectItem value="under-budget">Abaixo</SelectItem>
              <SelectItem value="over-budget">Acima</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterDepartment} onValueChange={setFilterDepartment}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Departamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Tecnologia">Tecnologia</SelectItem>
              <SelectItem value="RH">RH</SelectItem>
              <SelectItem value="Comercial">Comercial</SelectItem>
              <SelectItem value="P&D">P&D</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterPeriod} onValueChange={setFilterPeriod}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Q4 2024">Q4 2024</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros Avançados
          </Button>
        </div>

        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Exportar Relatório
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Orçamentos */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Orçamentos Ativos</CardTitle>
              <CardDescription>
                Acompanhe o progresso e gastos de cada orçamento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredBudgets.map((budget) => (
                <div 
                  key={budget.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{budget.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{budget.department}</span>
                          <span>{budget.category}</span>
                          <span>{budget.period}</span>
                        </div>
                      </div>
                      <Badge variant={getStatusColor(budget.status)}>
                        {getStatusLabel(budget.status)}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Progresso:</span>
                        <span className={`font-medium ${getPercentageColor(budget.spentPercentage)}`}>
                          {budget.spentPercentage}%
                        </span>
                      </div>
                      <Progress 
                        value={budget.spentPercentage} 
                        className="h-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Gasto: {formatCurrency(budget.spentAmount)}</span>
                        <span>Restante: {formatCurrency(budget.remainingAmount)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Gestor: {budget.manager}
                      </span>
                      <span className="text-muted-foreground">
                        Atualizado: {new Date(budget.lastUpdate).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <Button variant="outline" size="sm" onClick={() => handleViewBudget(budget.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEditBudget(budget.id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Despesas por Categoria */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Despesas por Categoria
              </CardTitle>
              <CardDescription>
                Distribuição dos gastos por categoria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budgetCategories.map((category, index) => {
                  const percentage = (category.spent / category.total) * 100
                  
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{category.name}</h4>
                        <div className="text-right">
                          <span className="text-sm font-medium">
                            {formatCurrency(category.spent)}
                          </span>
                          <span className="text-xs text-muted-foreground ml-2">
                            de {formatCurrency(category.total)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={percentage} className="flex-1" />
                        <span className={`text-sm font-medium ${getPercentageColor(percentage)}`}>
                          {Math.round(percentage)}%
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Resumo e Alertas */}
        <div className="space-y-4">
          {/* Orçamentos com Alerta */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                Alertas de Orçamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {budgets
                .filter(b => b.status === "over-budget" || b.spentPercentage > 90)
                .map((budget) => (
                  <div key={budget.id} className="p-3 border border-red-200 rounded-lg bg-red-50">
                    <h4 className="font-medium text-red-800">{budget.name}</h4>
                    <p className="text-sm text-red-600">{budget.department}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm font-medium text-red-700">
                        {budget.spentPercentage}% gasto
                      </span>
                      {budget.remainingAmount < 0 && (
                        <Badge variant="destructive" className="text-xs">
                          Excedeu {formatCurrency(Math.abs(budget.remainingAmount))}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}

              {budgets.filter(b => b.status === "over-budget" || b.spentPercentage > 90).length === 0 && (
                <div className="text-center py-4">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Nenhum alerta de orçamento
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Próximos Vencimentos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Próximos Vencimentos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {budgets
                .filter(b => new Date(b.endDate) > new Date())
                .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
                .slice(0, 4)
                .map((budget) => {
                  const daysRemaining = Math.ceil(
                    (new Date(budget.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                  )
                  
                  return (
                    <div key={budget.id} className="flex items-center space-x-3 p-2 border rounded">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{budget.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {budget.department} • {daysRemaining} dias restantes
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {formatCurrency(budget.remainingAmount)}
                        </div>
                        <div className="text-xs text-muted-foreground">disponível</div>
                      </div>
                    </div>
                  )
                })}
            </CardContent>
          </Card>

          {/* Performance por Departamento */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Por Departamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {["Marketing", "Tecnologia", "Comercial", "RH", "P&D"].map((dept) => {
                const deptBudgets = budgets.filter(b => b.department === dept)
                const totalBudget = deptBudgets.reduce((sum, b) => sum + b.totalAmount, 0)
                const totalSpent = deptBudgets.reduce((sum, b) => sum + b.spentAmount, 0)
                const percentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

                return (
                  <div key={dept}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{dept}</span>
                      <span className="font-medium">{Math.round(percentage)}%</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{formatCurrency(totalSpent)}</span>
                      <span>{formatCurrency(totalBudget)}</span>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Ações Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Criar Orçamento
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Relatório Financeiro
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Clock className="h-4 w-4 mr-2" />
                Agendar Revisão
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Configurar Alertas
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {filteredBudgets.length === 0 && (
        <div className="text-center py-12">
          <DollarSign className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Nenhum orçamento encontrado</h3>
          <p className="mt-2 text-muted-foreground">
            Ajuste os filtros ou crie um novo orçamento.
          </p>
        </div>
      )}
    </>
  )
}
