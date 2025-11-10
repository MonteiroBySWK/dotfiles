"use client"

import { useState, useEffect } from "react"
import { 
  DollarSign, 
  TrendingUp, 
  Download,
  Filter,
  Plus,
  Eye,
  Edit,
  MoreVertical,
  Receipt,
  Target
} from "lucide-react"
import { useFinancialStore } from "@/stores/financialStore"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

// Import new reusable components
import { StatCard, StatsGrid } from "@/components/common"

// Status mapping for display
const statusMap = {
  paid: { label: "Pago", color: "bg-green-500" },
  pending: { label: "Pendente", color: "bg-yellow-500" },
  overdue: { label: "Vencido", color: "bg-red-500" },
  draft: { label: "Rascunho", color: "bg-gray-500" }
}

const budgetStatusMap = {
  "on-track": { label: "No Prazo", color: "text-green-600" },
  "under-budget": { label: "Abaixo do Orçamento", color: "text-blue-600" },
  "over-budget": { label: "Acima do Orçamento", color: "text-red-600" }
}

export default function FinancialPage() {
  const [invoiceFilter, setInvoiceFilter] = useState("all")
  const [expenseFilter, setExpenseFilter] = useState("all")

  // Get financial data from store
  const {
    invoices,
    expenses,
    budgets,
    financialOverview,
    isLoading,
    fetchAllFinancialData
  } = useFinancialStore()

  // Load financial data on component mount
  useEffect(() => {
    fetchAllFinancialData()
  }, [fetchAllFinancialData])

  const filteredInvoices = invoices.filter(invoice => {
    if (invoiceFilter === "all") return true
    return invoice.status === invoiceFilter
  })

  const filteredExpenses = expenses.filter(expense => {
    if (expenseFilter === "all") return true
    return expense.category.toLowerCase() === expenseFilter.toLowerCase()
  })

  // Loading state
  if (isLoading || !financialOverview) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financeiro</h1>
          <p className="text-muted-foreground">
            Controle financeiro e relatórios da empresa
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Fatura
          </Button>
        </div>
      </div>

      {/* Resumo Financeiro - Using new StatCard component with responsive grid */}
      <StatsGrid>
        <StatCard
          title="Receita Total"
          value={`R$ ${financialOverview.totalRevenue.toLocaleString()}`}
          description={`+${financialOverview.growthRate}% em relação ao mês anterior`}
          icon={DollarSign}
        />

        <StatCard
          title="Receita Mensal"
          value={`R$ ${financialOverview.monthlyRevenue.toLocaleString()}`}
          description="Receita do mês atual"
          icon={TrendingUp}
          iconColor="text-green-500"
        />

        <StatCard
          title="Faturas Pendentes"
          value={`R$ ${financialOverview.pendingInvoices.toLocaleString()}`}
          description="Aguardando pagamento"
          icon={Receipt}
          iconColor="text-yellow-500"
        />

        <StatCard
          title="Lucro Líquido"
          value={`R$ ${financialOverview.profit.toLocaleString()}`}
          description="Lucro após despesas"
          icon={Target}
          iconColor="text-blue-500"
        />
      </StatsGrid>

      {/* Conteúdo com Tabs */}
      <Tabs defaultValue="invoices" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="invoices">Faturas</TabsTrigger>
          <TabsTrigger value="expenses">Despesas</TabsTrigger>
          <TabsTrigger value="budgets">Orçamentos</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        {/* Tab de Faturas */}
        <TabsContent value="invoices" className="space-y-4">
          <div className="flex items-center gap-4">
            <Select value={invoiceFilter} onValueChange={setInvoiceFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="paid">Pagos</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="overdue">Vencidos</SelectItem>
                <SelectItem value="draft">Rascunhos</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {filteredInvoices.map((invoice) => (
              <Card key={invoice.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {invoice.id}
                        <div className={`h-2 w-2 rounded-full ${statusMap[invoice.status as keyof typeof statusMap].color}`} />
                        <Badge variant="outline">
                          {statusMap[invoice.status as keyof typeof statusMap].label}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        {invoice.client} • {invoice.project}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">
                        R$ {invoice.amount.toLocaleString()}
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            Marcar como Pago
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Criado: {new Date(invoice.createdDate).toLocaleDateString()}</span>
                    <span>Vencimento: {new Date(invoice.dueDate).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab de Despesas */}
        <TabsContent value="expenses" className="space-y-4">
          <div className="flex items-center gap-4">
            <Select value={expenseFilter} onValueChange={setExpenseFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="tecnologia">Tecnologia</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="educação">Educação</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {filteredExpenses.map((expense) => (
              <Card key={expense.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{expense.description}</CardTitle>
                      <CardDescription>{expense.category}</CardDescription>
                    </div>
                    <Badge variant="outline">
                      {expense.type === "subscription" ? "Assinatura" : 
                       expense.type === "service" ? "Serviço" : "Treinamento"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold">
                      R$ {expense.amount.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(expense.date).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab de Orçamentos */}
        <TabsContent value="budgets" className="space-y-4">
          <div className="space-y-4">
            {budgets.map((budget) => (
              <Card key={budget.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{budget.name}</CardTitle>
                      <CardDescription className={budgetStatusMap[budget.status as keyof typeof budgetStatusMap].color}>
                        {budgetStatusMap[budget.status as keyof typeof budgetStatusMap].label}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        R$ {budget.totalBudget.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Orçamento Total
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progresso</span>
                      <span>{budget.progress}%</span>
                    </div>
                    <Progress value={budget.progress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Gasto:</span>
                      <div className="font-medium">R$ {budget.spent.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Restante:</span>
                      <div className={`font-medium ${budget.remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        R$ {Math.abs(budget.remaining).toLocaleString()}
                        {budget.remaining < 0 && " (excesso)"}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Eficiência:</span>
                      <div className="font-medium">
                        {budget.progress <= 100 ? "✓ Dentro do prazo" : "⚠ Acima do orçamento"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab de Relatórios */}
        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Relatório Mensal</CardTitle>
                <CardDescription>
                  Resumo financeiro do mês atual
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Baixar PDF
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Análise de Projetos</CardTitle>
                <CardDescription>
                  Performance financeira por projeto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Baixar Excel
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fluxo de Caixa</CardTitle>
                <CardDescription>
                  Projeção de entrada e saída
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Baixar Relatório
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Impostos e Tributos</CardTitle>
                <CardDescription>
                  Relatório para contabilidade
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Baixar Demonstrativo
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
