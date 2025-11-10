"use client"

import { useState, useEffect } from "react"
import { useFinancialStore } from "@/stores/financialStore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  FileText,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  Download,
  Eye,
  Edit,
  Plus,
  Filter,
  Calendar,
  TrendingUp,
  Users,
  AlertTriangle
} from "lucide-react"
import { PageHeader } from "@/components/layout/PageHeader"
import { StatCard } from "@/components/common"

// Status configuration
const statusConfig = {
  paid: { label: "Pago", color: "bg-green-500", variant: "success" as const },
  pending: { label: "Pendente", color: "bg-yellow-500", variant: "warning" as const },
  overdue: { label: "Vencido", color: "bg-red-500", variant: "destructive" as const },
  draft: { label: "Rascunho", color: "bg-gray-500", variant: "secondary" as const },
  sent: { label: "Enviado", color: "bg-blue-500", variant: "default" as const }
}

// Mock data removed - now using Firebase data
const mockInvoices = [
  {
    id: "INV-2024-001",
    client: {
      name: "TechCorp Solutions",
      email: "contato@techcorp.com",
      avatar: "/avatars/techcorp.jpg",
      initials: "TC"
    },
    project: "Sistema de Gestão Empresarial",
    amount: 125000,
    issueDate: "2024-09-15",
    dueDate: "2024-10-15",
    status: "sent",
    paymentMethod: "Transferência",
    description: "Desenvolvimento de sistema completo de gestão",
    items: [
      { description: "Desenvolvimento Frontend", quantity: 80, unitPrice: 750, total: 60000 },
      { description: "Desenvolvimento Backend", quantity: 60, unitPrice: 850, total: 51000 },
      { description: "Banco de Dados", quantity: 20, unitPrice: 700, total: 14000 }
    ],
    tax: 12500,
    discount: 0,
    lastReminder: "2024-09-20"
  },
  {
    id: "INV-2024-002",
    client: {
      name: "Marketing Plus Ltda",
      email: "financeiro@marketingplus.com",
      avatar: "/avatars/marketing-plus.jpg",
      initials: "MP"
    },
    project: "Campanha Digital Q4",
    amount: 85000,
    issueDate: "2024-09-10", 
    dueDate: "2024-10-10",
    status: "paid",
    paymentMethod: "PIX",
    paymentDate: "2024-09-25",
    description: "Gestão completa de campanhas digitais",
    items: [
      { description: "Planejamento Estratégico", quantity: 40, unitPrice: 800, total: 32000 },
      { description: "Criação de Conteúdo", quantity: 50, unitPrice: 600, total: 30000 },
      { description: "Gestão de Ads", quantity: 30, unitPrice: 750, total: 22500 }
    ],
    tax: 8500,
    discount: 8000,
    paidAmount: 85000
  },
  {
    id: "INV-2024-003",
    client: {
      name: "Varejo Smart",
      email: "pagamentos@varejosmart.com.br",
      avatar: "/avatars/varejo-smart.jpg",
      initials: "VS"
    },
    project: "E-commerce Platform",
    amount: 180000,
    issueDate: "2024-08-20",
    dueDate: "2024-09-20",
    status: "overdue",
    paymentMethod: "Boleto",
    description: "Desenvolvimento de plataforma de e-commerce",
    items: [
      { description: "Desenvolvimento da Plataforma", quantity: 120, unitPrice: 1200, total: 144000 },
      { description: "Integração com Gateways", quantity: 20, unitPrice: 900, total: 18000 },
      { description: "Configuração e Deploy", quantity: 18, unitPrice: 1000, total: 18000 }
    ],
    tax: 18000,
    discount: 0,
    lastReminder: "2024-09-18",
    daysOverdue: 1
  },
  {
    id: "INV-2024-004",
    client: {
      name: "Consultoria Moderna",
      email: "admin@consultoriamoderna.com",
      avatar: "/avatars/consultoria.jpg",
      initials: "CM"
    },
    project: "Sistema CRM Personalizado",
    amount: 95000,
    issueDate: "2024-09-18",
    dueDate: "2024-10-18",
    status: "draft",
    paymentMethod: "Transferência",
    description: "CRM sob medida para gestão de clientes",
    items: [
      { description: "Análise de Requisitos", quantity: 25, unitPrice: 800, total: 20000 },
      { description: "Desenvolvimento CRM", quantity: 75, unitPrice: 900, total: 67500 },
      { description: "Treinamento", quantity: 10, unitPrice: 750, total: 7500 }
    ],
    tax: 9500,
    discount: 9500
  },
  {
    id: "INV-2024-005",
    client: {
      name: "Educação Digital",
      email: "financeiro@educacaodigital.edu.br",
      avatar: "/avatars/educacao.jpg",
      initials: "ED"
    },
    project: "Plataforma de Ensino Online",
    amount: 220000,
    issueDate: "2024-09-12",
    dueDate: "2024-10-12",
    status: "sent",
    paymentMethod: "Transferência",
    description: "LMS completo para educação à distância",
    items: [
      { description: "Desenvolvimento LMS", quantity: 150, unitPrice: 1000, total: 150000 },
      { description: "Sistema de Avaliação", quantity: 40, unitPrice: 1200, total: 48000 },
      { description: "Módulo de Relatórios", quantity: 22, unitPrice: 1000, total: 22000 }
    ],
    tax: 22000,
    discount: 22000,
    lastReminder: "2024-09-19"
  }
]

const recentPayments = [
  {
    id: "PAY-001",
    invoiceId: "INV-2024-002",
    client: "Marketing Plus Ltda",
    amount: 85000,
    method: "PIX",
    date: "2024-09-25",
    status: "confirmed"
  },
  {
    id: "PAY-002", 
    invoiceId: "INV-2024-006",
    client: "Startup Inovadora",
    amount: 45000,
    method: "Transferência",
    date: "2024-09-23",
    status: "confirmed"
  },
  {
    id: "PAY-003",
    invoiceId: "INV-2024-001",
    client: "TechCorp Solutions",
    amount: 62500,
    method: "Transferência",
    date: "2024-09-22",
    status: "pending"
  }
]

export default function InvoicingPage() {
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterClient, setFilterClient] = useState("")
  const [sortBy, setSortBy] = useState("date")

  const filteredInvoices = invoices
    .filter(invoice => {
      const matchesStatus = filterStatus === "all" || invoice.status === filterStatus
      const matchesClient = !filterClient || 
        invoice.client.name.toLowerCase().includes(filterClient.toLowerCase())
      return matchesStatus && matchesClient
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()
      }
      if (sortBy === "amount") {
        return b.amount - a.amount
      }
      return 0
    })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "default"
      case "sent":
        return "secondary"
      case "draft":
        return "outline"
      case "overdue":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "paid":
        return "Pago"
      case "sent":
        return "Enviado"
      case "draft":
        return "Rascunho"
      case "overdue":
        return "Atrasado"
      default:
        return "Pendente"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const handleCreateInvoice = () => {
    console.log("Criar nova fatura")
  }

  const handleViewInvoice = (invoiceId: string) => {
    setSelectedInvoice(invoiceId)
  }

  const handleSendInvoice = (invoiceId: string) => {
    console.log(`Enviar fatura: ${invoiceId}`)
  }

  const handleDownloadInvoice = (invoiceId: string) => {
    console.log(`Baixar fatura: ${invoiceId}`)
  }

  const handleSendReminder = (invoiceId: string) => {
    console.log(`Enviar lembrete: ${invoiceId}`)
  }

  return (
    <>
      <PageHeader
        title="Faturamento"
        description="Gerencie faturas, cobranças e pagamentos"
        actions={[
          {
            label: "Nova Fatura",
            icon: Plus,
            onClick: handleCreateInvoice
          }
        ]}
        badge={{
          label: `${invoiceStats.overduePaidInvoices} em atraso`,
          variant: invoiceStats.overduePaidInvoices > 0 ? "destructive" : "secondary"
        }}
      />

      {/* Estatísticas Principais */}
      {/* Estatísticas do Faturamento - Using new StatCard component with responsive grid */}
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
          description={`${Math.round((invoiceStats.paidAmount / invoiceStats.totalAmount) * 100)}% do total`}
          icon={CheckCircle}
          iconColor="text-green-600"
          className="[&_.text-2xl]:text-green-600"
        />
        <StatCard
          title="A Receber"
          value={formatCurrency(invoiceStats.pendingAmount)}
          description={`${invoiceStats.pendingInvoices} faturas pendentes`}
          icon={Clock}
          iconColor="text-blue-600"
          className="[&_.text-2xl]:text-blue-600"
        />
        <StatCard
          title="Em Atraso"
          value={formatCurrency(invoiceStats.overdueAmount)}
          description={`${invoiceStats.overduePaidInvoices} faturas`}
          icon={AlertTriangle}
          iconColor="text-red-600"
          className="[&_.text-2xl]:text-red-600"
        />
      </div>

      {/* Filtros e Busca */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Buscar cliente..."
            value={filterClient}
            onChange={(e) => setFilterClient(e.target.value)}
            className="w-64"
          />

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="draft">Rascunho</SelectItem>
              <SelectItem value="sent">Enviado</SelectItem>
              <SelectItem value="paid">Pago</SelectItem>
              <SelectItem value="overdue">Atrasado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Ordenar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Data</SelectItem>
              <SelectItem value="amount">Valor</SelectItem>
              <SelectItem value="client">Cliente</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>

        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Faturas */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Faturas</CardTitle>
              <CardDescription>
                Gerencie todas as suas faturas e cobranças
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredInvoices.map((invoice) => (
                <div 
                  key={invoice.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={invoice.client.avatar} />
                      <AvatarFallback>{invoice.client.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{invoice.id}</h4>
                        <Badge variant={getStatusColor(invoice.status)}>
                          {getStatusLabel(invoice.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{invoice.client.name}</p>
                      <p className="text-sm">{invoice.project}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>Emissão: {formatDate(invoice.issueDate)}</span>
                        <span>Vencimento: {formatDate(invoice.dueDate)}</span>
                        {invoice.status === "overdue" && invoice.daysOverdue && (
                          <span className="text-red-600 font-medium">
                            {invoice.daysOverdue} dia(s) em atraso
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-lg font-bold">{formatCurrency(invoice.amount)}</div>
                      <div className="text-xs text-muted-foreground">{invoice.paymentMethod}</div>
                    </div>
                    
                    <div className="flex space-x-1">
                      <Button variant="outline" size="sm" onClick={() => handleViewInvoice(invoice.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {invoice.status === "draft" && (
                        <Button size="sm" onClick={() => handleSendInvoice(invoice.id)}>
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {(invoice.status === "sent" || invoice.status === "overdue") && (
                        <Button variant="outline" size="sm" onClick={() => handleSendReminder(invoice.id)}>
                          <AlertCircle className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <Button variant="outline" size="sm" onClick={() => handleDownloadInvoice(invoice.id)}>
                        <Download className="h-4 w-4" />
                      </Button>
                      
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Detalhes da Fatura Selecionada */}
          {selectedInvoice && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Detalhes da Fatura - {selectedInvoice}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const invoice = invoices.find(inv => inv.id === selectedInvoice)
                  if (!invoice) return null

                  return (
                    <div className="space-y-6">
                      {/* Informações do Cliente */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Cliente</h4>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={invoice.client.avatar} />
                              <AvatarFallback>{invoice.client.initials}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{invoice.client.name}</p>
                              <p className="text-sm text-muted-foreground">{invoice.client.email}</p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Projeto</h4>
                          <p>{invoice.project}</p>
                          <p className="text-sm text-muted-foreground mt-1">{invoice.description}</p>
                        </div>
                      </div>

                      {/* Itens da Fatura */}
                      <div>
                        <h4 className="font-medium mb-3">Itens</h4>
                        <div className="border rounded-lg overflow-hidden">
                          <table className="w-full">
                            <thead className="bg-muted/50">
                              <tr>
                                <th className="text-left p-3">Descrição</th>
                                <th className="text-center p-3">Qtd</th>
                                <th className="text-right p-3">Preço Unit.</th>
                                <th className="text-right p-3">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {invoice.items.map((item, index) => (
                                <tr key={index} className="border-t">
                                  <td className="p-3">{item.description}</td>
                                  <td className="p-3 text-center">{item.quantity}</td>
                                  <td className="p-3 text-right">{formatCurrency(item.unitPrice)}</td>
                                  <td className="p-3 text-right font-medium">{formatCurrency(item.total)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Totais */}
                      <div className="space-y-2 border-t pt-4">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span className="font-medium">
                            {formatCurrency(invoice.amount - invoice.tax + invoice.discount)}
                          </span>
                        </div>
                        {invoice.discount > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Desconto:</span>
                            <span>-{formatCurrency(invoice.discount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Impostos:</span>
                          <span>{formatCurrency(invoice.tax)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold border-t pt-2">
                          <span>Total:</span>
                          <span>{formatCurrency(invoice.amount)}</span>
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Pagamentos e Resumo */}
        <div className="space-y-4">
          {/* Faturas em Atraso */}
          {invoices.filter(inv => inv.status === "overdue").length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                  Faturas em Atraso
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {invoices
                  .filter(inv => inv.status === "overdue")
                  .map((invoice) => (
                    <div key={invoice.id} className="p-3 border border-red-200 rounded-lg bg-red-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-red-800">{invoice.id}</h4>
                          <p className="text-sm text-red-600">{invoice.client.name}</p>
                          <p className="text-xs text-red-500 mt-1">
                            Venceu em {formatDate(invoice.dueDate)}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-red-700">
                            {formatCurrency(invoice.amount)}
                          </div>
                          <Button variant="outline" size="sm" className="mt-1">
                            Lembrete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          )}

          {/* Pagamentos Recentes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                Pagamentos Recentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center space-x-3 p-2 border rounded">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{payment.client}</p>
                    <p className="text-xs text-muted-foreground">
                      {payment.invoiceId} • {formatDate(payment.date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">
                      {formatCurrency(payment.amount)}
                    </div>
                    <div className="text-xs text-muted-foreground">{payment.method}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Resumo por Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Resumo por Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { status: "paid", label: "Pagas", count: invoices.filter(i => i.status === "paid").length },
                { status: "sent", label: "Enviadas", count: invoices.filter(i => i.status === "sent").length },
                { status: "draft", label: "Rascunhos", count: invoices.filter(i => i.status === "draft").length },
                { status: "overdue", label: "Atrasadas", count: invoices.filter(i => i.status === "overdue").length }
              ].map((item) => (
                <div key={item.status} className="flex justify-between items-center">
                  <span className="text-sm">{item.label}</span>
                  <Badge variant={getStatusColor(item.status)}>
                    {item.count}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Métricas de Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Métricas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-700">
                    {invoiceStats.averagePaymentTime}d
                  </div>
                  <div className="text-xs text-blue-600">Tempo Médio</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-700">
                    {Math.round((invoiceStats.paidAmount / invoiceStats.totalAmount) * 100)}%
                  </div>
                  <div className="text-xs text-green-600">Taxa Recebimento</div>
                </div>
              </div>
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
                Nova Fatura
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Send className="h-4 w-4 mr-2" />
                Enviar Lembretes
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Relatório Mensal
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Gerenciar Clientes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {filteredInvoices.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Nenhuma fatura encontrada</h3>
          <p className="mt-2 text-muted-foreground">
            Ajuste os filtros ou crie uma nova fatura.
          </p>
        </div>
      )}
    </>
  )
}
