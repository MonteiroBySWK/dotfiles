"use client"

import * as React from "react"
import { 
  Layout,
  Plus,
  Settings,
  Trash2,
  Move,
  Edit,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  Maximize,
  Minimize,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Calendar,
  BarChart3,
  PieChart,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  Activity,
  Zap,
  Shield
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/custom/feedback"
import { LoadingOverlay } from "@/components/custom/loading"

interface Widget {
  id: string
  type: string
  title: string
  description: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  config: Record<string, unknown>
  visible: boolean
  refreshInterval?: number
  lastUpdated: string
}

interface WidgetTemplate {
  id: string
  name: string
  description: string
  icon: React.ElementType
  category: string
  defaultSize: { width: number; height: number }
  configOptions: {
    key: string
    label: string
    type: "text" | "number" | "select" | "boolean"
    options?: string[]
    default: unknown
  }[]
}

const DashboardCustomizerPage: React.FC = () => {
  const { addNotification } = useToast()
  const [isLoading, setIsLoading] = React.useState(false)
  const [isEditMode, setIsEditMode] = React.useState(false)
  const [selectedWidget, setSelectedWidget] = React.useState<Widget | null>(null)
  const [isAddingWidget, setIsAddingWidget] = React.useState(false)
  const [dashboardName, setDashboardName] = React.useState("Meu Dashboard")

  const [widgets, setWidgets] = React.useState<Widget[]>([
    {
      id: "1",
      type: "kpi",
      title: "Receita Total",
      description: "Receita acumulada do mês",
      position: { x: 0, y: 0 },
      size: { width: 1, height: 1 },
      config: {
        metric: "revenue",
        value: 450000,
        change: 15,
        trend: "up",
        format: "currency"
      },
      visible: true,
      refreshInterval: 300,
      lastUpdated: new Date().toISOString()
    },
    {
      id: "2",
      type: "chart",
      title: "Vendas por Período",
      description: "Gráfico de vendas mensais",
      position: { x: 1, y: 0 },
      size: { width: 2, height: 2 },
      config: {
        chartType: "line",
        dataSource: "sales",
        period: "monthly"
      },
      visible: true,
      refreshInterval: 600,
      lastUpdated: new Date().toISOString()
    },
    {
      id: "3",
      type: "progress",
      title: "Metas do Mês",
      description: "Progresso das metas estabelecidas",
      position: { x: 0, y: 1 },
      size: { width: 1, height: 1 },
      config: {
        goals: [
          { name: "Vendas", current: 85, target: 100 },
          { name: "Clientes", current: 120, target: 150 },
          { name: "Projetos", current: 12, target: 15 }
        ]
      },
      visible: true,
      lastUpdated: new Date().toISOString()
    },
    {
      id: "4",
      type: "activity",
      title: "Atividades Recentes",
      description: "Últimas ações no sistema",
      position: { x: 3, y: 0 },
      size: { width: 1, height: 2 },
      config: {
        maxItems: 10,
        showTimestamp: true
      },
      visible: true,
      refreshInterval: 60,
      lastUpdated: new Date().toISOString()
    }
  ])

  const widgetTemplates: WidgetTemplate[] = [
    {
      id: "kpi",
      name: "KPI Card",
      description: "Indicador chave de performance",
      icon: TrendingUp,
      category: "Métricas",
      defaultSize: { width: 1, height: 1 },
      configOptions: [
        { key: "metric", label: "Métrica", type: "select", options: ["revenue", "users", "orders"], default: "revenue" },
        { key: "format", label: "Formato", type: "select", options: ["currency", "number", "percentage"], default: "number" },
        { key: "showTrend", label: "Mostrar Tendência", type: "boolean", default: true }
      ]
    },
    {
      id: "chart",
      name: "Gráfico",
      description: "Visualização de dados em gráfico",
      icon: BarChart3,
      category: "Gráficos",
      defaultSize: { width: 2, height: 2 },
      configOptions: [
        { key: "chartType", label: "Tipo", type: "select", options: ["line", "bar", "pie", "area"], default: "line" },
        { key: "dataSource", label: "Fonte de Dados", type: "select", options: ["sales", "users", "projects"], default: "sales" },
        { key: "period", label: "Período", type: "select", options: ["daily", "weekly", "monthly"], default: "monthly" }
      ]
    },
    {
      id: "progress",
      name: "Progresso",
      description: "Barras de progresso para metas",
      icon: Target,
      category: "Métricas",
      defaultSize: { width: 1, height: 1 },
      configOptions: [
        { key: "title", label: "Título", type: "text", default: "Progresso" },
        { key: "showPercentage", label: "Mostrar Porcentagem", type: "boolean", default: true }
      ]
    },
    {
      id: "activity",
      name: "Feed de Atividades",
      description: "Lista de atividades recentes",
      icon: Activity,
      category: "Listas",
      defaultSize: { width: 1, height: 2 },
      configOptions: [
        { key: "maxItems", label: "Máximo de Itens", type: "number", default: 10 },
        { key: "showTimestamp", label: "Mostrar Horário", type: "boolean", default: true }
      ]
    },
    {
      id: "calendar",
      name: "Calendário",
      description: "Vista de calendário com eventos",
      icon: Calendar,
      category: "Produtividade",
      defaultSize: { width: 2, height: 2 },
      configOptions: [
        { key: "view", label: "Visualização", type: "select", options: ["month", "week", "day"], default: "month" },
        { key: "showWeekends", label: "Mostrar Fins de Semana", type: "boolean", default: true }
      ]
    },
    {
      id: "alerts",
      name: "Alertas",
      description: "Notificações e alertas importantes",
      icon: AlertTriangle,
      category: "Notificações",
      defaultSize: { width: 1, height: 1 },
      configOptions: [
        { key: "severity", label: "Severidade Mínima", type: "select", options: ["low", "medium", "high"], default: "medium" },
        { key: "autoRefresh", label: "Atualização Automática", type: "boolean", default: true }
      ]
    }
  ]

  const handleAddWidget = (template: WidgetTemplate) => {
    const newWidget: Widget = {
      id: Date.now().toString(),
      type: template.id,
      title: template.name,
      description: template.description,
      position: { x: 0, y: Math.max(...widgets.map(w => w.position.y + w.size.height), 0) },
      size: template.defaultSize,
      config: template.configOptions.reduce((acc, option) => {
        acc[option.key] = option.default
        return acc
      }, {} as Record<string, unknown>),
      visible: true,
      lastUpdated: new Date().toISOString()
    }

    setWidgets(prev => [...prev, newWidget])
    setIsAddingWidget(false)
    
    addNotification({
      type: "success",
      title: "Widget adicionado!",
      message: `${template.name} foi adicionado ao dashboard.`
    })
  }

  const handleRemoveWidget = (widgetId: string) => {
    setWidgets(prev => prev.filter(w => w.id !== widgetId))
    addNotification({
      type: "success",
      message: "Widget removido do dashboard."
    })
  }

  const handleToggleWidgetVisibility = (widgetId: string) => {
    setWidgets(prev => prev.map(w => 
      w.id === widgetId 
        ? { ...w, visible: !w.visible }
        : w
    ))
  }

  const handleUpdateWidget = (widgetId: string, updates: Partial<Widget>) => {
    setWidgets(prev => prev.map(w => 
      w.id === widgetId 
        ? { ...w, ...updates, lastUpdated: new Date().toISOString() }
        : w
    ))
  }

  const handleSaveDashboard = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      addNotification({
        type: "success",
        title: "Dashboard salvo!",
        message: "Suas configurações foram salvas com sucesso."
      })
      
      setIsEditMode(false)
    } catch (error) {
      addNotification({
        type: "error",
        title: "Erro ao salvar",
        message: "Não foi possível salvar o dashboard."
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetDashboard = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Reset para layout padrão
      setWidgets([
        {
          id: "1",
          type: "kpi",
          title: "Receita Total",
          description: "Receita acumulada do mês",
          position: { x: 0, y: 0 },
          size: { width: 1, height: 1 },
          config: {
            metric: "revenue",
            value: 450000,
            change: 15,
            trend: "up",
            format: "currency"
          },
          visible: true,
          lastUpdated: new Date().toISOString()
        }
      ])
      
      addNotification({
        type: "info",
        message: "Dashboard restaurado para o layout padrão."
      })
    } catch (error) {
      addNotification({
        type: "error",
        title: "Erro ao restaurar",
        message: "Não foi possível restaurar o dashboard."
      })
    } finally {
      setIsLoading(false)
    }
  }

  const renderWidget = (widget: Widget) => {
    if (!widget.visible) return null

    const Icon = widgetTemplates.find(t => t.id === widget.type)?.icon || Layout

    switch (widget.type) {
      case "kpi":
        return (
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {widget.config.format === "currency" 
                  ? `R$ ${typeof widget.config.value === 'number' ? widget.config.value.toLocaleString() : '0'}` 
                  : typeof widget.config.value === 'number' ? widget.config.value.toLocaleString() : '0'}
              </div>
              {widget.config.showTrend && (
                <div className={`flex items-center text-xs ${
                  widget.config.trend === "up" ? "text-green-600" : "text-red-600"
                }`}>
                  {widget.config.trend === "up" ? 
                    <TrendingUp className="h-3 w-3 mr-1" /> : 
                    <TrendingDown className="h-3 w-3 mr-1" />
                  }
                  +{typeof widget.config.change === 'number' ? widget.config.change : 0}% vs mês anterior
                </div>
              )}
            </CardContent>
          </Card>
        )

      case "progress":
        return (
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.isArray(widget.config.goals) && widget.config.goals.map((goal: { id: string; name: string; value: number; target: number; current: number }, index: number) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{goal.name}</span>
                    <span>{goal.current}/{goal.target}</span>
                  </div>
                  <Progress value={(goal.current / goal.target) * 100} />
                </div>
              ))}
            </CardContent>
          </Card>
        )

      case "chart":
        return (
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-32 flex items-center justify-center text-muted-foreground">
                <BarChart3 className="h-8 w-8 mr-2" />
                <span>Gráfico {typeof widget.config.chartType === 'string' ? widget.config.chartType : 'padrão'}</span>
              </div>
            </CardContent>
          </Card>
        )

      case "activity":
        return (
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { action: "Novo projeto criado", time: "2 min", user: "João" },
                  { action: "Relatório gerado", time: "5 min", user: "Ana" },
                  { action: "Meta atingida", time: "1h", user: "Sistema" }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <div className="flex-1">
                      <p>{activity.action}</p>
                      <p className="text-muted-foreground">{activity.user} • {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )

      default:
        return (
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-20 text-muted-foreground">
                <Icon className="h-8 w-8" />
              </div>
            </CardContent>
          </Card>
        )
    }
  }

  const renderWidgetWithControls = (widget: Widget) => (
    <div
      key={widget.id}
      className={`relative group ${
        widget.size.width === 1 ? "col-span-1" : 
        widget.size.width === 2 ? "col-span-2" : "col-span-3"
      } ${
        widget.size.height === 1 ? "row-span-1" : "row-span-2"
      }`}
    >
      {renderWidget(widget)}
      
      {isEditMode && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center space-x-1 bg-background border rounded-md p-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={() => handleToggleWidgetVisibility(widget.id)}
            >
              {widget.visible ? 
                <Eye className="h-3 w-3" /> : 
                <EyeOff className="h-3 w-3" />
              }
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={() => setSelectedWidget(widget)}
            >
              <Settings className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={() => handleRemoveWidget(widget.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <LoadingOverlay isLoading={isLoading} message="Salvando dashboard...">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard Customizável</h1>
            <p className="text-muted-foreground">
              Personalize seu dashboard com widgets interativos
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsEditMode(!isEditMode)}
            >
              {isEditMode ? (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Visualizar
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </>
              )}
            </Button>
            
            {isEditMode && (
              <>
                <Button variant="outline" onClick={handleResetDashboard}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Restaurar
                </Button>
                <Button onClick={handleSaveDashboard}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Dashboard Title */}
        {isEditMode && (
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Dashboard</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dashboard-name">Nome do Dashboard</Label>
                <Input
                  id="dashboard-name"
                  value={dashboardName}
                  onChange={(e) => setDashboardName(e.target.value)}
                  placeholder="Digite o nome do dashboard"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Widgets Visíveis</Label>
                  <p className="text-sm text-muted-foreground">
                    {widgets.filter(w => w.visible).length} de {widgets.length} widgets
                  </p>
                </div>
                
                <Dialog open={isAddingWidget} onOpenChange={setIsAddingWidget}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Widget
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Adicionar Widget</DialogTitle>
                      <DialogDescription>
                        Escolha um widget para adicionar ao seu dashboard
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 md:grid-cols-3">
                      {widgetTemplates.map((template) => {
                        const Icon = template.icon
                        return (
                          <Card 
                            key={template.id} 
                            className="cursor-pointer hover:bg-accent transition-colors"
                            onClick={() => handleAddWidget(template)}
                          >
                            <CardHeader className="pb-3">
                              <div className="flex items-center space-x-2">
                                <Icon className="h-5 w-5" />
                                <CardTitle className="text-base">{template.name}</CardTitle>
                              </div>
                              <CardDescription className="text-sm">
                                {template.description}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <Badge variant="secondary" className="text-xs">
                                {template.category}
                              </Badge>
                              <p className="text-xs text-muted-foreground mt-2">
                                Tamanho: {template.defaultSize.width}x{template.defaultSize.height}
                              </p>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddingWidget(false)}>
                        Cancelar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dashboard Grid */}
        <div className="grid grid-cols-4 gap-4 auto-rows-[minmax(200px,auto)]">
          {widgets.map(widget => renderWidgetWithControls(widget))}
        </div>

        {/* Widget Configuration Modal */}
        <Dialog open={!!selectedWidget} onOpenChange={() => setSelectedWidget(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Configurar Widget</DialogTitle>
              <DialogDescription>
                Ajuste as configurações do widget {selectedWidget?.title}
              </DialogDescription>
            </DialogHeader>
            
            {selectedWidget && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="widget-title">Título</Label>
                  <Input
                    id="widget-title"
                    value={selectedWidget.title}
                    onChange={(e) => 
                      handleUpdateWidget(selectedWidget.id, { title: e.target.value })
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="widget-description">Descrição</Label>
                  <Textarea
                    id="widget-description"
                    value={selectedWidget.description}
                    onChange={(e) => 
                      handleUpdateWidget(selectedWidget.id, { description: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Atualização Automática</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={!!selectedWidget.refreshInterval}
                      onCheckedChange={(checked) => 
                        handleUpdateWidget(selectedWidget.id, { 
                          refreshInterval: checked ? 300 : undefined 
                        })
                      }
                    />
                    <span className="text-sm text-muted-foreground">
                      Atualizar automaticamente
                    </span>
                  </div>
                </div>

                {selectedWidget.refreshInterval && (
                  <div className="space-y-2">
                    <Label>Intervalo (segundos)</Label>
                    <Select
                      value={selectedWidget.refreshInterval.toString()}
                      onValueChange={(value) => 
                        handleUpdateWidget(selectedWidget.id, { 
                          refreshInterval: parseInt(value) 
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="60">1 minuto</SelectItem>
                        <SelectItem value="300">5 minutos</SelectItem>
                        <SelectItem value="600">10 minutos</SelectItem>
                        <SelectItem value="1800">30 minutos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedWidget(null)}>
                Cancelar
              </Button>
              <Button onClick={() => setSelectedWidget(null)}>
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </LoadingOverlay>
  )
}

export default DashboardCustomizerPage
