"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { 
  FileText,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Users,
  Building,
  Download,
  Eye,
  Edit,
  Plus,
  Filter,
  TrendingUp,
  Shield,
  Target
} from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { PageContainer } from "@/components/layout/page-container"
import { StatCard } from "@/components/common"

// Dados mockados para contratos
const contractStats = {
  totalContracts: 28,
  activeContracts: 18,
  renewalsDue: 5,
  totalValue: 3250000,
  avgContractValue: 116071,
  renewalRate: 87,
  expiringThisMonth: 3
}

const contracts = [
  {
    id: "CONT-2024-001",
    title: "Sistema de Gestão Empresarial",
    client: {
      name: "TechCorp Solutions",
      email: "contrato@techcorp.com",
      avatar: "/avatars/techcorp.jpg",
      initials: "TC",
      type: "enterprise"
    },
    value: 450000,
    type: "development",
    status: "active",
    startDate: "2024-03-15",
    endDate: "2025-03-15",
    renewalDate: "2025-02-15",
    duration: 12, // meses
    progress: 65,
    paymentTerms: "Mensal",
    manager: "Carlos Oliveira",
    description: "Desenvolvimento completo de sistema de gestão empresarial com módulos financeiro, RH e vendas.",
    milestones: [
      { name: "Análise de Requisitos", status: "completed", date: "2024-04-15" },
      { name: "Desenvolvimento Backend", status: "completed", date: "2024-06-30" },
      { name: "Desenvolvimento Frontend", status: "in-progress", date: "2024-09-30" },
      { name: "Testes e Homologação", status: "pending", date: "2024-11-30" },
      { name: "Deploy e Treinamento", status: "pending", date: "2025-01-15" }
    ]
  },
  {
    id: "CONT-2024-002",
    title: "Campanha de Marketing Digital",
    client: {
      name: "Marketing Plus Ltda",
      email: "contrato@marketingplus.com",
      avatar: "/avatars/marketing-plus.jpg",
      initials: "MP",
      type: "business"
    },
    value: 180000,
    type: "marketing",
    status: "active",
    startDate: "2024-07-01",
    endDate: "2024-12-31",
    renewalDate: "2024-11-30",
    duration: 6,
    progress: 80,
    paymentTerms: "Trimestral",
    manager: "Laura Lima",
    description: "Gestão completa de campanhas digitais incluindo Google Ads, Facebook e Instagram.",
    milestones: [
      { name: "Estratégia e Planejamento", status: "completed", date: "2024-07-15" },
      { name: "Criação de Campanhas", status: "completed", date: "2024-08-15" },
      { name: "Otimização Q3", status: "completed", date: "2024-09-30" },
      { name: "Relatório Final", status: "in-progress", date: "2024-12-15" }
    ]
  },
  {
    id: "CONT-2024-003",
    title: "Suporte Técnico Anual",
    client: {
      name: "Varejo Smart",
      email: "suporte@varejosmart.com.br",
      avatar: "/avatars/varejo-smart.jpg",
      initials: "VS",
      type: "enterprise"
    },
    value: 120000,
    type: "support",
    status: "renewal-due",
    startDate: "2023-10-01",
    endDate: "2024-09-30",
    renewalDate: "2024-09-01",
    duration: 12,
    progress: 100,
    paymentTerms: "Anual",
    manager: "Pedro Santos",
    description: "Suporte técnico 24/7 para infraestrutura de e-commerce.",
    daysUntilExpiry: 9
  },
  {
    id: "CONT-2024-004",
    title: "Desenvolvimento de App Mobile",
    client: {
      name: "Startup Inovadora",
      email: "dev@startup.com",
      avatar: "/avatars/startup.jpg",
      initials: "SI",
      type: "startup"
    },
    value: 85000,
    type: "development",
    status: "pending",
    startDate: "2024-10-01",
    endDate: "2025-04-01",
    duration: 6,
    progress: 0,
    paymentTerms: "Mensal",
    manager: "Ana Costa",
    description: "Aplicativo mobile nativo para iOS e Android.",
    milestones: [
      { name: "UI/UX Design", status: "pending", date: "2024-11-15" },
      { name: "Desenvolvimento iOS", status: "pending", date: "2025-01-30" },
      { name: "Desenvolvimento Android", status: "pending", date: "2025-02-28" },
      { name: "Testes e Publicação", status: "pending", date: "2025-03-30" }
    ]
  },
  {
    id: "CONT-2024-005",
    title: "Consultoria em Transformação Digital",
    client: {
      name: "Indústria Tradicional SA",
      email: "digital@industria.com.br",
      avatar: "/avatars/industria.jpg",
      initials: "IT",
      type: "enterprise"
    },
    value: 320000,
    type: "consulting",
    status: "active",
    startDate: "2024-06-01",
    endDate: "2025-06-01",
    renewalDate: "2025-05-01",
    duration: 12,
    progress: 35,
    paymentTerms: "Bimestral",
    manager: "Roberto Silva",
    description: "Consultoria estratégica para transformação digital da operação industrial.",
    milestones: [
      { name: "Diagnóstico Atual", status: "completed", date: "2024-07-15" },
      { name: "Estratégia Digital", status: "in-progress", date: "2024-10-30" },
      { name: "Implementação Fase 1", status: "pending", date: "2025-02-28" },
      { name: "Implementação Fase 2", status: "pending", date: "2025-05-30" }
    ]
  },
  {
    id: "CONT-2024-006",
    title: "Licenciamento de Software",
    client: {
      name: "Corporação Global",
      email: "licences@global.com",
      avatar: "/avatars/global.jpg",
      initials: "CG",
      type: "enterprise"
    },
    value: 95000,
    type: "licensing",
    status: "expired",
    startDate: "2023-01-01",
    endDate: "2024-01-01",
    duration: 12,
    progress: 100,
    paymentTerms: "Anual",
    manager: "Helena Costa",
    description: "Licenças anuais para uso do software proprietário.",
    expiredDays: 263
  }
]

const contractTypes = [
  { type: "development", label: "Desenvolvimento", count: 8, color: "bg-blue-500" },
  { type: "marketing", label: "Marketing", count: 6, color: "bg-green-500" },
  { type: "support", label: "Suporte", count: 5, color: "bg-yellow-500" },
  { type: "consulting", label: "Consultoria", count: 4, color: "bg-purple-500" },
  { type: "licensing", label: "Licenciamento", count: 3, color: "bg-orange-500" },
  { type: "maintenance", label: "Manutenção", count: 2, color: "bg-red-500" }
]

export default function ContractsPage() {
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedContract, setSelectedContract] = useState<string | null>(null)

  const filteredContracts = contracts.filter(contract => {
    const matchesStatus = filterStatus === "all" || contract.status === filterStatus
    const matchesType = filterType === "all" || contract.type === filterType
    const matchesSearch = !searchQuery || 
      contract.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.client.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesType && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "pending":
        return "secondary"
      case "renewal-due":
        return "destructive"
      case "expired":
        return "outline"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo"
      case "pending":
        return "Pendente"
      case "renewal-due":
        return "Renovação Pendente"
      case "expired":
        return "Expirado"
      case "cancelled":
        return "Cancelado"
      default:
        return "Em Análise"
    }
  }

  const getTypeColor = (type: string) => {
    const typeConfig = contractTypes.find(t => t.type === type)
    return typeConfig?.color || "bg-gray-500"
  }

  const getTypeLabel = (type: string) => {
    const typeConfig = contractTypes.find(t => t.type === type)
    return typeConfig?.label || type
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

  const calculateTimeRemaining = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diffTime = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return "Expirado"
    if (diffDays === 0) return "Expira hoje"
    if (diffDays === 1) return "Expira amanhã"
    if (diffDays <= 30) return `${diffDays} dias restantes`
    if (diffDays <= 365) return `${Math.ceil(diffDays / 30)} meses restantes`
    return `${Math.ceil(diffDays / 365)} anos restantes`
  }

  const handleCreateContract = () => {
    console.log("Criar novo contrato")
  }

  const handleViewContract = (contractId: string) => {
    setSelectedContract(contractId)
  }

  const handleEditContract = (contractId: string) => {
    console.log(`Editar contrato: ${contractId}`)
  }

  const handleRenewContract = (contractId: string) => {
    console.log(`Renovar contrato: ${contractId}`)
  }

  return (
    <PageContainer>
      <PageHeader
        title="Contratos"
        description="Gerencie contratos, renovações e marcos"
        actions={[
          {
            label: "Novo Contrato",
            icon: Plus,
            onClick: handleCreateContract
          }
        ]}
        badge={{
          label: `${contractStats.renewalsDue} renovações pendentes`,
          variant: contractStats.renewalsDue > 0 ? "destructive" : "secondary"
        }}
      />

      {/* Estatísticas Principais - Using new StatCard component with responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total de Contratos"
          value={contractStats.totalContracts.toString()}
          description={`${contractStats.activeContracts} ativos`}
          icon={FileText}
          iconColor="text-blue-600"
        />
        <StatCard
          title="Valor Total"
          value={formatCurrency(contractStats.totalValue)}
          description={`Média: ${formatCurrency(contractStats.avgContractValue)}`}
          icon={DollarSign}
          iconColor="text-green-600"
        />
        <StatCard
          title="Taxa de Renovação"
          value={`${contractStats.renewalRate}%`}
          icon={TrendingUp}
          iconColor="text-green-600"
          className="[&_.text-2xl]:text-green-600"
        />
        <StatCard
          title="Expiram Este Mês"
          value={contractStats.expiringThisMonth.toString()}
          description="Requerem atenção"
          icon={AlertTriangle}
          iconColor="text-red-600"
          className="[&_.text-2xl]:text-red-600"
        />
      </div>

      {/* Filtros e Busca */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Buscar contratos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="renewal-due">Renovação</SelectItem>
              <SelectItem value="expired">Expirado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="development">Desenvolvimento</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="support">Suporte</SelectItem>
              <SelectItem value="consulting">Consultoria</SelectItem>
              <SelectItem value="licensing">Licenciamento</SelectItem>
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
        {/* Lista de Contratos */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contratos Ativos</CardTitle>
              <CardDescription>
                Gerencie todos os contratos e seus status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredContracts.map((contract) => (
                <div 
                  key={contract.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={contract.client.avatar} />
                      <AvatarFallback>{contract.client.initials}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{contract.title}</h4>
                        <Badge variant={getStatusColor(contract.status)}>
                          {getStatusLabel(contract.status)}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{contract.client.name}</p>
                      <p className="text-sm">{contract.description}</p>
                      
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span className={`px-2 py-1 rounded text-white ${getTypeColor(contract.type)}`}>
                          {getTypeLabel(contract.type)}
                        </span>
                        <span>Início: {formatDate(contract.startDate)}</span>
                        <span>Fim: {formatDate(contract.endDate)}</span>
                        {contract.status === "active" && (
                          <span className="font-medium">
                            {calculateTimeRemaining(contract.endDate)}
                          </span>
                        )}
                      </div>

                      {contract.status === "active" && contract.progress !== undefined && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Progresso:</span>
                            <span className="font-medium">{contract.progress}%</span>
                          </div>
                          <Progress value={contract.progress} className="h-2" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-lg font-bold">{formatCurrency(contract.value)}</div>
                      <div className="text-xs text-muted-foreground">{contract.paymentTerms}</div>
                      <div className="text-xs text-muted-foreground">
                        Gestor: {contract.manager}
                      </div>
                    </div>
                    
                    <div className="flex space-x-1">
                      <Button variant="outline" size="sm" onClick={() => handleViewContract(contract.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Button variant="outline" size="sm" onClick={() => handleEditContract(contract.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      {contract.status === "renewal-due" && (
                        <Button size="sm" onClick={() => handleRenewContract(contract.id)}>
                          Renovar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Tipos de Contrato */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Contratos por Categoria
              </CardTitle>
              <CardDescription>
                Distribuição dos contratos por tipo de serviço
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {contractTypes.map((type) => (
                  <div key={type.type} className="text-center p-4 border rounded-lg">
                    <div className={`w-8 h-8 ${type.color} rounded-full mx-auto mb-2`} />
                    <h4 className="font-medium">{type.label}</h4>
                    <p className="text-2xl font-bold">{type.count}</p>
                    <p className="text-xs text-muted-foreground">contratos</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Renovações e Alertas */}
        <div className="space-y-4">
          {/* Contratos para Renovação */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-orange-600" />
                Renovações Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {contracts
                .filter(c => c.status === "renewal-due" || c.daysUntilExpiry !== undefined)
                .map((contract) => (
                  <div key={contract.id} className="p-3 border border-orange-200 rounded-lg bg-orange-50">
                    <h4 className="font-medium text-orange-800">{contract.title}</h4>
                    <p className="text-sm text-orange-600">{contract.client.name}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-orange-700">
                        {contract.daysUntilExpiry !== undefined ? 
                          `${contract.daysUntilExpiry} dias` : 
                          `Vence: ${formatDate(contract.endDate)}`
                        }
                      </span>
                      <Button variant="outline" size="sm">
                        Renovar
                      </Button>
                    </div>
                  </div>
                ))}

              {contracts.filter(c => c.status === "renewal-due" || c.daysUntilExpiry !== undefined).length === 0 && (
                <div className="text-center py-4">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Nenhuma renovação pendente
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resumo Financeiro */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Resumo Financeiro
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Contratos Ativos:</span>
                  <span className="font-medium">
                    {formatCurrency(contracts
                      .filter(c => c.status === "active")
                      .reduce((sum, c) => sum + c.value, 0)
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm">Pendentes:</span>
                  <span className="font-medium">
                    {formatCurrency(contracts
                      .filter(c => c.status === "pending")
                      .reduce((sum, c) => sum + c.value, 0)
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm">Para Renovação:</span>
                  <span className="font-medium text-orange-600">
                    {formatCurrency(contracts
                      .filter(c => c.status === "renewal-due")
                      .reduce((sum, c) => sum + c.value, 0)
                    )}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(contractStats.totalValue)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gestores de Contrato */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Gestores de Contrato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {["Carlos Oliveira", "Laura Lima", "Pedro Santos", "Ana Costa", "Roberto Silva"].map((manager) => {
                const managerContracts = contracts.filter(c => c.manager === manager)
                const totalValue = managerContracts.reduce((sum, c) => sum + c.value, 0)
                
                return (
                  <div key={manager} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <p className="text-sm font-medium">{manager}</p>
                      <p className="text-xs text-muted-foreground">
                        {managerContracts.length} contratos
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {formatCurrency(totalValue)}
                      </div>
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
                Novo Contrato
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Templates
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Relatório de Contratos
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Agendar Revisão
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {filteredContracts.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Nenhum contrato encontrado</h3>
          <p className="mt-2 text-muted-foreground">
            Ajuste os filtros ou crie um novo contrato.
          </p>
        </div>
      )}
    </PageContainer>
  )
}
