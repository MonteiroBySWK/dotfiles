"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  FileText,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
  Edit,
  Plus,
  Filter,
  TrendingUp
} from "lucide-react"
import { PageHeader } from "@/components/layout/PageHeader"
import { StatCard } from "@/components/common"
import { useFinancialStore } from "@/stores/financialStore"

// Status configuration
const statusConfig = {
  paid: { label: "Pago", color: "bg-green-500", variant: "default" as const },
  pending: { label: "Pendente", color: "bg-yellow-500", variant: "secondary" as const },
  overdue: { label: "Vencido", color: "bg-red-500", variant: "destructive" as const },
  draft: { label: "Rascunho", color: "bg-gray-500", variant: "outline" as const },
  cancelled: { label: "Cancelado", color: "bg-gray-400", variant: "outline" as const }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount)
}

const formatDate = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('pt-BR')
}

export default function InvoicingPage() {
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Get invoices from Firebase store
  const { 
    invoices, 
    isInvoicesLoading, 
    fetchInvoices 
  } = useFinancialStore()

  // Load invoices on component mount
  useEffect(() => {
    fetchInvoices()
  }, [fetchInvoices])

  // Calculate stats from Firebase data
  const invoiceStats = {
    totalInvoices: invoices.length,
    pendingInvoices: invoices.filter(inv => inv.status === 'pending').length,
    overdueInvoices: invoices.filter(inv => inv.status === 'overdue').length,
    totalAmount: invoices.reduce((sum, inv) => sum + inv.amount, 0),
    paidAmount: invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0),
    pendingAmount: invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.amount, 0),
    overdueAmount: invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0)
  }

  const filteredInvoices = invoices
    .filter(invoice => {
      const matchesStatus = statusFilter === "all" || invoice.status === statusFilter
      const matchesSearch = !searchTerm || 
        invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.project.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesStatus && matchesSearch
    })

  if (isInvoicesLoading) {
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
          <h1 className="text-3xl font-bold tracking-tight">Faturamento</h1>
          <p className="text-muted-foreground">
            Gerencie suas faturas e recebimentos
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

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total de Faturas"
          value={formatCurrency(invoiceStats.totalAmount)}
          description={`${invoiceStats.totalInvoices} faturas`}
        />

        <StatCard
          title="Faturamento Pago"
          value={formatCurrency(invoiceStats.paidAmount)}
          description={`${Math.round((invoiceStats.paidAmount / invoiceStats.totalAmount) * 100)}% do total`}
          icon={CheckCircle}
          iconColor="text-green-500"
        />

        <StatCard
          title="Pendente"
          value={formatCurrency(invoiceStats.pendingAmount)}
          description={`${invoiceStats.pendingInvoices} faturas pendentes`}
          icon={Clock}
          iconColor="text-yellow-500"
        />

        <StatCard
          title="Em Atraso"
          value={formatCurrency(invoiceStats.overdueAmount)}
          description={`${invoiceStats.overdueInvoices} faturas`}
          icon={AlertCircle}
          iconColor="text-red-500"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Buscar por cliente ou projeto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />

        <Select value={statusFilter} onValueChange={setStatusFilter}>
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

      {/* Invoice List */}
      <div className="space-y-4">
        {filteredInvoices.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">Nenhuma fatura encontrada</p>
            </CardContent>
          </Card>
        ) : (
          filteredInvoices.map((invoice) => (
            <Card key={invoice.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {invoice.number || invoice.id}
                      <Badge variant={statusConfig[invoice.status].variant}>
                        {statusConfig[invoice.status].label}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {invoice.client} • {invoice.project}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {formatCurrency(invoice.amount)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Vencimento: {formatDate(invoice.dueDate)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Criado: {formatDate(invoice.createdDate)}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      Ver
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}