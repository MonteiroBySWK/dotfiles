"use client"

import { useState, useMemo } from "react"
import {
  DollarSign,
  CheckCircle,
  Clock,
  AlertTriangle,
  Filter,
  Plus,
  Download,
  Eye,
  Edit,
  FileText,
  Search,
} from "lucide-react"
import { useFinancials } from "@/hooks/useFinancials"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StatCard } from "@/components/common"
import { LoadingOverlay } from "@/components/custom/loading"
import { PageHeader } from "@/components/layout/PageHeader"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount)
}

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
}

const statusConfig = {
  paid: { label: "Pago", color: "success" as const, icon: CheckCircle },
  pending: { label: "Pendente", color: "warning" as const, icon: Clock },
  overdue: { label: "Vencido", color: "destructive" as const, icon: AlertTriangle },
  draft: { label: "Rascunho", color: "secondary" as const, icon: Edit },
}

export default function InvoicingPage() {
  const { invoices, loading } = useFinancials()
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const invoiceStats = useMemo(() => {
    const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0)
    const paidAmount = invoices.filter(i => i.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0)
    const pendingAmount = invoices.filter(i => i.status === 'pending').reduce((sum, inv) => sum + inv.amount, 0)
    const overdueAmount = invoices.filter(i => i.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0)
    
    return {
      totalInvoices: invoices.length,
      totalAmount,
      paidAmount,
      pendingAmount,
      overdueAmount,
      pendingInvoices: invoices.filter(i => i.status === 'pending').length,
      overdueInvoices: invoices.filter(i => i.status === 'overdue').length,
    }
  }, [invoices])

  const filteredInvoices = useMemo(() => {
    return invoices
      .filter(invoice => {
        if (filter !== "all" && invoice.status !== filter) return false
        if (searchTerm && !invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) && !invoice.project.toLowerCase().includes(searchTerm.toLowerCase())) return false
        return true
      })
      .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
  }, [invoices, filter, searchTerm])

  if (loading) {
    return <LoadingOverlay isLoading={true} message="Carregando faturas..." ><div/></LoadingOverlay>
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <PageHeader
        title="Faturamento"
        description="Gerencie faturas, cobranças e pagamentos."
        actions={[
          { label: "Nova Fatura", icon: Plus, onClick: () => {} },
          { label: "Exportar", icon: Download, onClick: () => {}, variant: "outline" },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Faturado"
          value={formatCurrency(invoiceStats.totalAmount)}
          description={`${invoiceStats.totalInvoices} faturas`}
          icon={DollarSign}
          iconColor="text-blue-600"
        />
        <StatCard
          title="Valores Recebidos"
          value={formatCurrency(invoiceStats.paidAmount)}
          description={`${Math.round((invoiceStats.paidAmount / (invoiceStats.totalAmount || 1)) * 100)}% do total`}
          icon={CheckCircle}
          iconColor="text-green-600"
          className="[&_.text-2xl]:text-green-600"
        />
        <StatCard
          title="A Receber"
          value={formatCurrency(invoiceStats.pendingAmount)}
          description={`${invoiceStats.pendingInvoices} faturas pendentes`}
          icon={Clock}
          iconColor="text-yellow-600"
          className="[&_.text-2xl]:text-yellow-600"
        />
        <StatCard
          title="Em Atraso"
          value={formatCurrency(invoiceStats.overdueAmount)}
          description={`${invoiceStats.overdueInvoices} faturas`}
          icon={AlertTriangle}
          iconColor="text-red-600"
          className="[&_.text-2xl]:text-red-600"
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista de Faturas</CardTitle>
              <CardDescription>
                {filteredInvoices.length} faturas encontradas.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar por cliente ou projeto..."
                  className="pl-8 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="paid">Pago</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="overdue">Vencido</SelectItem>
                  <SelectItem value="draft">Rascunho</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredInvoices.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Nenhuma fatura encontrada</h3>
                <p className="mt-2 text-muted-foreground">
                  Ajuste os filtros ou crie uma nova fatura.
                </p>
              </div>
            ) : (
              filteredInvoices.map((invoice) => (
                <Card key={invoice.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          {invoice.id}
                          <Badge variant={statusConfig[invoice.status].color}>
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
        </CardContent>
      </Card>
    </div>
  )
}