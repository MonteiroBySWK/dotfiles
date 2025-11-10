"use client"

import { useState } from "react"
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
import { StatCard } from "@/components/common"

// Dados mock financeiros
const financialOverview = {
  totalRevenue: 450000,
  monthlyRevenue: 75000,
  pendingInvoices: 25000,
  expenses: 35000,
  profit: 40000,
  growthRate: 12.5
}

const invoices = [
  {
    id: "INV-001",
    client: "TechCorp Solutions",
    project: "Sistema CRM",
    amount: 25000,
    status: "paid",
    dueDate: "2024-01-15",
    createdDate: "2024-01-01"
  },
  {
    id: "INV-002",
    client: "StartupXYZ",
    project: "App Mobile",
    amount: 15000,
    status: "pending",
    dueDate: "2024-01-20",
    createdDate: "2024-01-05"
  },
  {
    id: "INV-003",
    client: "E-commerce Plus",
    project: "Website Redesign",
    amount: 8000,
    status: "overdue",
    dueDate: "2024-01-10",
    createdDate: "2023-12-20"
  },
  {
    id: "INV-004",
    client: "Digital Agency",
    project: "Consultoria",
    amount: 12000,
    status: "draft",
    dueDate: "2024-01-25",
    createdDate: "2024-01-18"
  }
]

const expenses = [
  {
    id: 1,
    description: "Licenças de Software",
    category: "Tecnologia",
    amount: 2500,
    date: "2024-01-15",
    type: "subscription"
  },
  {
    id: 2,
    description: "Marketing Digital",
    category: "Marketing",
    amount: 8000,
    date: "2024-01-10",
    type: "service"
  },
  {
    id: 3,
    description: "Infraestrutura AWS",
    category: "Tecnologia",
    amount: 1200,
    date: "2024-01-08",
    type: "subscription"
  },
  {
    id: 4,
    description: "Treinamento Equipe",
    category: "Educação",
    amount: 3500,
    date: "2024-01-05",
    type: "training"
  }
]

const budgets = [
  {
    id: 1,
    name: "Projeto CRM - TechCorp",
    totalBudget: 80000,
    spent: 60000,
    remaining: 20000,
    progress: 75,
    status: "on-track"
  },
  {
    id: 2,
    name: "App Mobile - StartupXYZ",
    totalBudget: 120000,
    spent: 25000,
    remaining: 95000,
    progress: 21,
    status: "under-budget"
  },
  {
    id: 3,
    name: "Website - E-commerce",
    totalBudget: 45000,
    spent: 48000,
    remaining: -3000,
    progress: 107,
    status: "over-budget"
  }
]

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

  const filteredInvoices = invoices.filter(invoice => {
    if (invoiceFilter === "all") return true
    return invoice.status === invoiceFilter
  })

  const filteredExpenses = expenses.filter(expense => {
    if (expenseFilter === "all") return true
    return expense.category.toLowerCase() === expenseFilter.toLowerCase()
  })

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

      {/* Resumo Financeiro - Using new StatCard component */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
      </div>

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
