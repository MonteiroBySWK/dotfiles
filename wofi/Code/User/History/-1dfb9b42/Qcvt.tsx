"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  CreditCard,
  DollarSign,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Download,
  Eye,
  Plus,
  Filter,
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  Banknote,
  Receipt,
  RefreshCw
} from "lucide-react"
import { PageHeader } from "@/components/layout/PageHeader"
import { PageContainer } from "@/components/layout/page-container"
import { StatCard } from "@/components/common"

// Dados mockados para pagamentos
const paymentStats = {
  totalPayments: 125,
  totalAmount: 2850000,
  receivedAmount: 2340000,
  pendingAmount: 425000,
  overdueAmount: 85000,
  thisMonthReceived: 680000,
  thisMonthPaid: 245000,
  averagePaymentTime: 16 // dias
}

const payments = [
  {
    id: "PAY-2024-001",
    type: "received",
    client: {
      name: "TechCorp Solutions",
      email: "contato@techcorp.com",
      avatar: "/avatars/techcorp.jpg",
      initials: "TC"
    },
    amount: 125000,
    method: "Transferência Bancária",
    status: "completed",
    date: "2024-09-21",
    invoiceId: "INV-2024-001",
    reference: "Sistema de Gestão Empresarial",
    bankAccount: "Banco do Brasil - 1234-5",
    fees: 250,
    netAmount: 124750
  },
  {
    id: "PAY-2024-002",
    type: "sent",
    supplier: {
      name: "AWS Cloud Services",
      email: "billing@aws.amazon.com",
      avatar: "/avatars/aws.jpg",
      initials: "AWS"
    },
    amount: 8500,
    method: "Cartão de Crédito",
    status: "completed",
    date: "2024-09-20",
    category: "Infraestrutura",
    reference: "Serviços de Cloud - Setembro",
    fees: 85,
    netAmount: 8585
  },
  {
    id: "PAY-2024-003",
    type: "received",
    client: {
      name: "Marketing Plus Ltda",
      email: "financeiro@marketingplus.com",
      avatar: "/avatars/marketing-plus.jpg",
      initials: "MP"
    },
    amount: 85000,
    method: "PIX",
    status: "pending",
    date: "2024-09-25",
    invoiceId: "INV-2024-002",
    reference: "Campanha Digital Q4",
    expectedDate: "2024-09-25",
    fees: 0,
    netAmount: 85000
  },
  {
    id: "PAY-2024-004",
    type: "sent",
    supplier: {
      name: "Adobe Creative Suite",
      email: "billing@adobe.com",
      avatar: "/avatars/adobe.jpg",
      initials: "AD"
    },
    amount: 1200,
    method: "Débito Automático",
    status: "scheduled",
    date: "2024-09-25",
    category: "Software",
    reference: "Licenças mensais - Design",
    fees: 0,
    netAmount: 1200
  },
  {
    id: "PAY-2024-005",
    type: "received",
    client: {
      name: "Varejo Smart",
      email: "pagamentos@varejosmart.com.br",
      avatar: "/avatars/varejo-smart.jpg",
      initials: "VS"
    },
    amount: 180000,
    method: "Boleto Bancário",
    status: "overdue",
    date: "2024-09-20",
    dueDate: "2024-09-20",
    invoiceId: "INV-2024-003",
    reference: "E-commerce Platform",
    daysOverdue: 1,
    fees: 450,
    netAmount: 179550
  },
  {
    id: "PAY-2024-006",
    type: "sent",
    supplier: {
      name: "Slack Technologies",
      email: "billing@slack.com",
      avatar: "/avatars/slack.jpg",
      initials: "SL"
    },
    amount: 850,
    method: "Cartão de Crédito",
    status: "completed",
    date: "2024-09-18",
    category: "Software",
    reference: "Plano Business - 25 usuários",
    fees: 25,
    netAmount: 875
  }
]

const paymentMethods = [
  {
    id: "bank-transfer",
    name: "Transferência Bancária",
    type: "bank",
    isDefault: true,
    lastUsed: "2024-09-21",
    fees: "R$ 2,50 por transferência",
    icon: Banknote
  },
  {
    id: "pix",
    name: "PIX",
    type: "instant",
    isDefault: false,
    lastUsed: "2024-09-20",
    fees: "Gratuito",
    icon: DollarSign
  },
  {
    id: "credit-card",
    name: "Cartão de Crédito **** 1234",
    type: "card",
    isDefault: false,
    lastUsed: "2024-09-18",
    fees: "2,9% + R$ 0,39",
    icon: CreditCard
  },
  {
    id: "boleto",
    name: "Boleto Bancário",
    type: "boleto",
    isDefault: false,
    lastUsed: "2024-09-15",
    fees: "R$ 3,45 por boleto",
    icon: Receipt
  }
]

const upcomingPayments = [
  {
    id: "UP-001",
    description: "Salários da equipe",
    amount: 45000,
    dueDate: "2024-09-25",
    type: "sent",
    priority: "high"
  },
  {
    id: "UP-002",
    description: "Aluguel do escritório",
    amount: 8500,
    dueDate: "2024-09-28",
    type: "sent",
    priority: "medium"
  },
  {
    id: "UP-003",
    description: "Fatura - Consultoria Moderna",
    amount: 95000,
    dueDate: "2024-10-02",
    type: "received",
    priority: "high"
  }
]

export default function PaymentsPage() {
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterMethod, setFilterMethod] = useState("all")
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null)

  const filteredPayments = payments.filter(payment => {
    const matchesType = filterType === "all" || payment.type === filterType
    const matchesStatus = filterStatus === "all" || payment.status === filterStatus
    const matchesMethod = filterMethod === "all" || payment.method.toLowerCase().includes(filterMethod.toLowerCase())
    return matchesType && matchesStatus && matchesMethod
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "pending":
        return "secondary"
      case "scheduled":
        return "outline"
      case "overdue":
        return "destructive"
      case "failed":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Concluído"
      case "pending":
        return "Pendente"
      case "scheduled":
        return "Agendado"
      case "overdue":
        return "Atrasado"
      case "failed":
        return "Falhou"
      default:
        return "Processando"
    }
  }

  const getTypeIcon = (type: string) => {
    return type === "received" ? 
      <ArrowDownLeft className="h-4 w-4 text-green-600" /> : 
      <ArrowUpRight className="h-4 w-4 text-red-600" />
  }

  const getTypeLabel = (type: string) => {
    return type === "received" ? "Recebido" : "Enviado"
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

  const handleCreatePayment = () => {
    console.log("Criar novo pagamento")
  }

  const handleViewPayment = (paymentId: string) => {
    setSelectedPayment(paymentId)
  }

  const handleRetryPayment = (paymentId: string) => {
    console.log(`Tentar novamente: ${paymentId}`)
  }

  return (
    <PageContainer>
      <PageHeader
        title="Pagamentos"
        description="Gerencie recebimentos, pagamentos e métodos"
        actions={[
          {
            label: "Novo Pagamento",
            icon: Plus,
            onClick: handleCreatePayment
          }
        ]}
        badge={{
          label: `${formatCurrency(paymentStats.thisMonthReceived)} este mês`,
          variant: "secondary"
        }}
      />

      {/* Estatísticas Principais - Using new StatCard component with responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Movimentado"
          value={formatCurrency(paymentStats.totalAmount)}
          description={`${paymentStats.totalPayments} transações`}
          icon={DollarSign}
          iconColor="text-blue-600"
        />
        <StatCard
          title="Recebido"
          value={formatCurrency(paymentStats.receivedAmount)}
          description="+15% vs mês anterior"
          icon={ArrowDownLeft}
          iconColor="text-green-600"
          className="[&_.text-2xl]:text-green-600"
        />
        <StatCard
          title="A Receber"
          value={formatCurrency(paymentStats.pendingAmount)}
          description={`Tempo médio: ${paymentStats.averagePaymentTime} dias`}
          icon={Clock}
          iconColor="text-blue-600"
          className="[&_.text-2xl]:text-blue-600"
        />
        <StatCard
          title="Em Atraso"
          value={formatCurrency(paymentStats.overdueAmount)}
          description="Requer atenção"
          icon={AlertTriangle}
          iconColor="text-red-600"
          className="[&_.text-2xl]:text-red-600"
        />
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="received">Recebidos</SelectItem>
              <SelectItem value="sent">Enviados</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="completed">Concluído</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="scheduled">Agendado</SelectItem>
              <SelectItem value="overdue">Atrasado</SelectItem>
            </SelectContent>
          </Select>

          <Input 
            placeholder="Buscar por método..."
            value={filterMethod === "all" ? "" : filterMethod}
            onChange={(e) => setFilterMethod(e.target.value || "all")}
            className="w-48"
          />

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
        {/* Lista de Pagamentos */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Pagamentos</CardTitle>
              <CardDescription>
                Todas as transações financeiras da empresa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredPayments.map((payment) => (
                <div 
                  key={payment.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(payment.type)}
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={payment.type === "received" ? payment.client?.avatar : payment.supplier?.avatar} />
                        <AvatarFallback>
                          {payment.type === "received" ? payment.client?.initials : payment.supplier?.initials}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{payment.id}</h4>
                        <Badge variant={getStatusColor(payment.status)}>
                          {getStatusLabel(payment.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {payment.type === "received" ? payment.client?.name : payment.supplier?.name}
                      </p>
                      <p className="text-sm">{payment.reference}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>{getTypeLabel(payment.type)}</span>
                        <span>{payment.method}</span>
                        <span>Data: {formatDate(payment.date)}</span>
                        {payment.status === "overdue" && payment.daysOverdue && (
                          <span className="text-red-600 font-medium">
                            {payment.daysOverdue} dia(s) em atraso
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        payment.type === "received" ? "text-green-600" : "text-red-600"
                      }`}>
                        {payment.type === "received" ? "+" : "-"}{formatCurrency(payment.amount)}
                      </div>
                      {payment.fees > 0 && (
                        <div className="text-xs text-muted-foreground">
                          Taxa: {formatCurrency(payment.fees)}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-1">
                      <Button variant="outline" size="sm" onClick={() => handleViewPayment(payment.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {payment.status === "failed" && (
                        <Button size="sm" onClick={() => handleRetryPayment(payment.id)}>
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Métodos de Pagamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Métodos de Pagamento
              </CardTitle>
              <CardDescription>
                Configure e gerencie suas formas de pagamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethods.map((method) => {
                  const IconComponent = method.icon
                  
                  return (
                    <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{method.name}</h4>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>Última uso: {formatDate(method.lastUsed)}</span>
                            <span>{method.fees}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {method.isDefault && (
                          <Badge variant="secondary">Padrão</Badge>
                        )}
                        <Button variant="outline" size="sm">
                          Configurar
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Próximos Pagamentos e Resumo */}
        <div className="space-y-4">
          {/* Próximos Pagamentos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Próximos Pagamentos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingPayments.map((payment) => (
                <div key={payment.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(payment.type)}
                      <span className="font-medium text-sm">{payment.description}</span>
                    </div>
                    <Badge variant={payment.priority === "high" ? "destructive" : "secondary"}>
                      {payment.priority === "high" ? "Alta" : "Média"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Vence em: {formatDate(payment.dueDate)}
                    </span>
                    <span className={`font-bold ${
                      payment.type === "received" ? "text-green-600" : "text-red-600"
                    }`}>
                      {formatCurrency(payment.amount)}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Resumo Mensal */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Resumo do Mês
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm text-green-600">Entradas</p>
                    <p className="font-bold text-green-700">
                      {formatCurrency(paymentStats.thisMonthReceived)}
                    </p>
                  </div>
                  <ArrowDownLeft className="h-6 w-6 text-green-600" />
                </div>
                
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="text-sm text-red-600">Saídas</p>
                    <p className="font-bold text-red-700">
                      {formatCurrency(paymentStats.thisMonthPaid)}
                    </p>
                  </div>
                  <ArrowUpRight className="h-6 w-6 text-red-600" />
                </div>
                
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm text-blue-600">Saldo Líquido</p>
                    <p className="font-bold text-blue-700">
                      {formatCurrency(paymentStats.thisMonthReceived - paymentStats.thisMonthPaid)}
                    </p>
                  </div>
                  <DollarSign className="h-6 w-6 text-blue-600" />
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
                Novo Pagamento
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <CreditCard className="h-4 w-4 mr-2" />
                Configurar Método
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Relatório Financeiro
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Agendar Pagamento
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {filteredPayments.length === 0 && (
        <div className="text-center py-12">
          <DollarSign className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Nenhum pagamento encontrado</h3>
          <p className="mt-2 text-muted-foreground">
            Ajuste os filtros ou registre um novo pagamento.
          </p>
        </div>
      )}
    </PageContainer>
  )
}
