"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Mail,
  Send,
  Reply,
  ReplyAll,
  Forward,
  Archive,
  Trash2,
  Star,
  StarOff,
  MoreHorizontal,
  Search,
  Filter,
  RefreshCw,
  Paperclip,
  Download,
  Eye,
  EyeOff,
  Flag,
  Calendar,
  Users,
  FileText,
  Edit,
  Plus,
  Inbox,
  AlertCircle,
  CheckCircle,
  Clock,
  Tag,
  Settings,
  Import,
  X
} from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { PageContainer } from "@/components/layout/page-container"

type Email = {
  id: string
  from: {
    name: string
    email: string
    avatar?: string
  }
  to: {
    name: string
    email: string
  }[]
  cc?: {
    name: string
    email: string
  }[]
  bcc?: {
    name: string
    email: string
  }[]
  subject: string
  content: string
  htmlContent?: string
  timestamp: string
  isRead: boolean
  isStarred: boolean
  isFlagged: boolean
  priority: "low" | "normal" | "high" | "urgent"
  labels: string[]
  attachments?: {
    name: string
    size: string
    type: string
    url: string
  }[]
  threadId?: string
  isReply?: boolean
  originalMessageId?: string
}

type EmailFolder = {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  count: number
  color?: string
}

const mockEmails: Email[] = [
  {
    id: "1",
    from: {
      name: "João Cliente",
      email: "joao@cliente.com",
      avatar: "/avatars/joao-cliente.jpg"
    },
    to: [{
      name: "Você",
      email: "eu@empresa.com"
    }],
    subject: "Reunião sobre o projeto de e-commerce",
    content: "Olá! Gostaria de agendar uma reunião para discutir os detalhes do projeto de e-commerce que conversamos ontem. Estou disponível esta semana nos seguintes horários:\n\n- Terça-feira: 14h às 16h\n- Quarta-feira: 10h às 12h\n- Quinta-feira: 9h às 11h\n\nPor favor, me avise qual horário funciona melhor para vocês.\n\nObrigado!",
    timestamp: "2024-01-15T09:30:00Z",
    isRead: false,
    isStarred: true,
    isFlagged: false,
    priority: "high",
    labels: ["cliente", "reunião"],
    attachments: [
      {
        name: "proposta-ecommerce.pdf",
        size: "2.5 MB",
        type: "pdf",
        url: "/files/proposta.pdf"
      }
    ]
  },
  {
    id: "2",
    from: {
      name: "Maria Designer",
      email: "maria@agency.com",
      avatar: "/avatars/maria-designer.jpg"
    },
    to: [{
      name: "Você",
      email: "eu@empresa.com"
    }],
    cc: [{
      name: "Carlos PM",
      email: "carlos@empresa.com"
    }],
    subject: "Mockups da nova interface prontos",
    content: "Oi pessoal!\n\nConcluí os mockups da nova interface que discutimos na última reunião. Anexei o arquivo do Figma com todas as telas e fluxos.\n\nPrincipais atualizações:\n• Dashboard redesenhado com melhor hierarquia visual\n• Nova navegação lateral mais intuitiva\n• Formulários simplificados\n• Sistema de cores atualizado\n\nGostaria de receber feedback até quinta-feira para fazer os ajustes necessários.\n\nAbraços!",
    timestamp: "2024-01-15T08:15:00Z",
    isRead: true,
    isStarred: false,
    isFlagged: true,
    priority: "normal",
    labels: ["design", "feedback"],
    attachments: [
      {
        name: "interface-mockups.fig",
        size: "15.2 MB",
        type: "figma",
        url: "/files/mockups.fig"
      },
      {
        name: "style-guide.pdf",
        size: "3.8 MB",
        type: "pdf",
        url: "/files/style-guide.pdf"
      }
    ]
  },
  {
    id: "3",
    from: {
      name: "Sistema de Notificações",
      email: "noreply@sistema.com"
    },
    to: [{
      name: "Você",
      email: "eu@empresa.com"
    }],
    subject: "Relatório semanal de atividades",
    content: "Relatório automático de atividades da semana de 08/01 a 14/01:\n\n📊 Estatísticas Gerais:\n• 15 tarefas concluídas\n• 3 novos projetos iniciados\n• 8 reuniões realizadas\n• 92% de produtividade\n\n🎯 Metas Atingidas:\n• Meta de vendas: 105%\n• Satisfação do cliente: 94%\n• Tempo de resposta: <2h\n\n⚠️ Atenção Necessária:\n• 2 tarefas com prazo próximo\n• 1 projeto com risco de atraso\n\nDetalhes completos no dashboard.",
    timestamp: "2024-01-14T18:00:00Z",
    isRead: true,
    isStarred: false,
    isFlagged: false,
    priority: "normal",
    labels: ["relatório", "automático"]
  },
  {
    id: "4",
    from: {
      name: "Ana Financeiro",
      email: "ana@empresa.com",
      avatar: "/avatars/ana-financeiro.jpg"
    },
    to: [{
      name: "Você",
      email: "eu@empresa.com"
    }],
    subject: "Aprovação de orçamento - Projeto Mobile",
    content: "Bom dia!\n\nSegue em anexo o orçamento detalhado para o projeto do aplicativo mobile que discutimos na reunião de segunda-feira.\n\nResumo do orçamento:\n• Desenvolvimento: R$ 45.000\n• Design UX/UI: R$ 15.000\n• Testes e QA: R$ 8.000\n• Total: R$ 68.000\n\nPrazo estimado: 3 meses\n\nPreciso da aprovação até amanhã para conseguirmos iniciar na próxima semana conforme planejado.\n\nQualquer dúvida, estou à disposição.",
    timestamp: "2024-01-14T16:45:00Z",
    isRead: false,
    isStarred: false,
    isFlagged: true,
    priority: "urgent",
    labels: ["financeiro", "aprovação"],
    attachments: [
      {
        name: "orcamento-app-mobile.xlsx",
        size: "156 KB",
        type: "excel",
        url: "/files/orcamento.xlsx"
      }
    ]
  },
  {
    id: "5",
    from: {
      name: "Pedro Desenvolvedor",
      email: "pedro@empresa.com",
      avatar: "/avatars/pedro-dev.jpg"
    },
    to: [{
      name: "Você",
      email: "eu@empresa.com"
    }],
    subject: "Deploy da versão 2.1 concluído",
    content: "Oi!\n\nO deploy da versão 2.1 foi concluído com sucesso às 14h30.\n\nNovas funcionalidades disponíveis:\n✅ Sistema de notificações em tempo real\n✅ Melhorias na performance do dashboard\n✅ Correção de bugs reportados\n✅ Nova API de relatórios\n\nTodos os testes automatizados passaram e o sistema está funcionando normalmente.\n\nLogs de deploy e documentação da nova versão estão disponíveis no repositório.\n\nValeu!",
    timestamp: "2024-01-14T14:45:00Z",
    isRead: true,
    isStarred: true,
    isFlagged: false,
    priority: "normal",
    labels: ["desenvolvimento", "deploy"]
  }
]

const folders: EmailFolder[] = [
  { id: "inbox", name: "Caixa de Entrada", icon: Inbox, count: 12 },
  { id: "starred", name: "Favoritos", icon: Star, count: 3 },
  { id: "sent", name: "Enviados", icon: Send, count: 8 },
  { id: "drafts", name: "Rascunhos", icon: Edit, count: 2 },
  { id: "archived", name: "Arquivados", icon: Archive, count: 45 },
  { id: "trash", name: "Lixeira", icon: Trash2, count: 5 },
]

const priorityColors = {
  low: "bg-blue-100 text-blue-800",
  normal: "bg-gray-100 text-gray-800", 
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800"
}

const priorityLabels = {
  low: "Baixa",
  normal: "Normal",
  high: "Alta",
  urgent: "Urgente"
}

const formatDate = (timestamp: string) => {
  const date = new Date(timestamp)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit"
    })
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Ontem"
  } else {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit"
    })
  }
}

export default function EmailPage() {
  const [selectedFolder, setSelectedFolder] = useState("inbox")
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set())
  const [showCompose, setShowCompose] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const [composeData, setComposeData] = useState({
    to: "",
    cc: "",
    bcc: "",
    subject: "",
    content: "",
    priority: "normal"
  })

  const filteredEmails = mockEmails.filter(email => {
    const matchesSearch = email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         email.from.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         email.content.toLowerCase().includes(searchQuery.toLowerCase())
    
    switch (selectedFolder) {
      case "starred":
        return matchesSearch && email.isStarred
      case "inbox":
      default:
        return matchesSearch
    }
  })

  const toggleEmailSelection = (emailId: string) => {
    const newSelection = new Set(selectedEmails)
    if (newSelection.has(emailId)) {
      newSelection.delete(emailId)
    } else {
      newSelection.add(emailId)
    }
    setSelectedEmails(newSelection)
  }

  const toggleStar = (emailId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    // Aqui você atualizaria o estado do email no backend
    console.log(`Toggle star for email ${emailId}`)
  }

  const markAsRead = (emailId: string) => {
    // Aqui você marcaria como lido no backend
    console.log(`Mark email ${emailId} as read`)
  }

  const sendEmail = () => {
    if (composeData.to && composeData.subject && composeData.content) {
      // Aqui você enviaria o email via backend
      console.log("Sending email:", composeData)
      setShowCompose(false)
      setComposeData({
        to: "",
        cc: "",
        bcc: "",
        subject: "",
        content: "",
        priority: "normal"
      })
    }
  }

  const refreshEmails = () => {
    setIsRefreshing(true)
    // Simular carregamento
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  const replyToEmail = (email: Email, type: "reply" | "reply-all" | "forward") => {
    let subject = ""
    let content = ""
    let to = ""

    switch (type) {
      case "reply":
        subject = `Re: ${email.subject}`
        to = email.from.email
        content = `\n\n--- Mensagem original ---\nDe: ${email.from.name} <${email.from.email}>\nPara: ${email.to.map(t => `${t.name} <${t.email}>`).join(", ")}\nAssunto: ${email.subject}\nData: ${formatDate(email.timestamp)}\n\n${email.content}`
        break
      case "reply-all":
        subject = `Re: ${email.subject}`
        to = [email.from.email, ...email.to.map(t => t.email)].join(", ")
        content = `\n\n--- Mensagem original ---\nDe: ${email.from.name} <${email.from.email}>\nPara: ${email.to.map(t => `${t.name} <${t.email}>`).join(", ")}\nAssunto: ${email.subject}\nData: ${formatDate(email.timestamp)}\n\n${email.content}`
        break
      case "forward":
        subject = `Fwd: ${email.subject}`
        content = `\n\n--- Mensagem encaminhada ---\nDe: ${email.from.name} <${email.from.email}>\nPara: ${email.to.map(t => `${t.name} <${t.email}>`).join(", ")}\nAssunto: ${email.subject}\nData: ${formatDate(email.timestamp)}\n\n${email.content}`
        break
    }

    setComposeData({
      ...composeData,
      to,
      subject,
      content
    })
    setShowCompose(true)
  }

  const unreadCount = mockEmails.filter(email => !email.isRead).length

  return (
    <PageContainer>
      <PageHeader
        title="Email"
        description="Gerencie suas comunicações por email de forma integrada"
        actions={[
          {
            label: "Atualizar",
            variant: "outline",
            icon: RefreshCw,
            onClick: refreshEmails,
            disabled: isRefreshing
          },
          {
            label: "Escrever",
            icon: Plus,
            onClick: () => setShowCompose(true)
          }
        ]}
      />

      {/* Compose Dialog */}
      <Dialog open={showCompose} onOpenChange={setShowCompose}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Nova Mensagem</DialogTitle>
            <DialogDescription>
              Compose uma nova mensagem de email
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div>
              <Label htmlFor="to">Para</Label>
              <Input
                id="to"
                value={composeData.to}
                onChange={(e) => setComposeData({...composeData, to: e.target.value})}
                placeholder="destinatario@email.com"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cc">CC</Label>
                <Input
                  id="cc"
                  value={composeData.cc}
                  onChange={(e) => setComposeData({...composeData, cc: e.target.value})}
                  placeholder="cc@email.com"
                />
              </div>
              <div>
                <Label htmlFor="bcc">CCO</Label>
                <Input
                  id="bcc"
                  value={composeData.bcc}
                  onChange={(e) => setComposeData({...composeData, bcc: e.target.value})}
                  placeholder="cco@email.com"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="subject">Assunto</Label>
              <Input
                id="subject"
                value={composeData.subject}
                onChange={(e) => setComposeData({...composeData, subject: e.target.value})}
                placeholder="Assunto da mensagem..."
              />
            </div>
            <div>
              <Label htmlFor="priority">Prioridade</Label>
              <Select value={composeData.priority} onValueChange={(value) => setComposeData({...composeData, priority: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="content">Mensagem</Label>
              <Textarea
                id="content"
                value={composeData.content}
                onChange={(e) => setComposeData({...composeData, content: e.target.value})}
                placeholder="Digite sua mensagem..."
                rows={8}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCompose(false)}>
              Cancelar
            </Button>
            <Button onClick={sendEmail} disabled={!composeData.to || !composeData.subject || !composeData.content}>
              <Send className="h-4 w-4 mr-2" />
              Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="h-[calc(100vh-12rem)] flex border rounded-lg overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r bg-muted/30 flex flex-col">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar emails..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2">
              {folders.map((folder) => (
                <Button
                  key={folder.id}
                  variant={selectedFolder === folder.id ? "secondary" : "ghost"}
                  className="w-full justify-start mb-1"
                  onClick={() => setSelectedFolder(folder.id)}
                >
                  <folder.icon className="h-4 w-4 mr-2" />
                  <span className="flex-1 text-left">{folder.name}</span>
                  {folder.count > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {folder.count}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Email List */}
        <div className="w-96 border-r bg-background flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">
                {folders.find(f => f.id === selectedFolder)?.name}
              </h3>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm">
                  <Filter className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Marcar todos como lidos
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Archive className="h-4 w-4 mr-2" />
                      Arquivar todos
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Settings className="h-4 w-4 mr-2" />
                      Configurações
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            {unreadCount > 0 && (
              <div className="text-sm text-muted-foreground">
                {unreadCount} mensagem{unreadCount > 1 ? 's' : ''} não lida{unreadCount > 1 ? 's' : ''}
              </div>
            )}
          </div>
          <ScrollArea className="flex-1">
            <div className="divide-y">
              {filteredEmails.map((email) => (
                <div
                  key={email.id}
                  className={`p-4 cursor-pointer hover:bg-muted/50 ${
                    selectedEmail?.id === email.id ? 'bg-muted' : ''
                  } ${!email.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
                  onClick={() => {
                    setSelectedEmail(email)
                    if (!email.isRead) {
                      markAsRead(email.id)
                    }
                  }}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={selectedEmails.has(email.id)}
                      onCheckedChange={() => toggleEmailSelection(email.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={email.from.avatar} alt={email.from.name} />
                            <AvatarFallback className="text-xs">
                              {email.from.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className={`text-sm truncate ${!email.isRead ? 'font-semibold' : ''}`}>
                            {email.from.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {email.priority !== "normal" && (
                            <Badge className={priorityColors[email.priority]} variant="outline">
                              {priorityLabels[email.priority]}
                            </Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => toggleStar(email.id, e)}
                            className="h-auto p-0"
                          >
                            {email.isStarred ? (
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ) : (
                              <StarOff className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <h4 className={`text-sm mb-1 truncate ${!email.isRead ? 'font-semibold' : ''}`}>
                        {email.subject}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {email.content}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1">
                          {email.attachments && email.attachments.length > 0 && (
                            <Paperclip className="h-3 w-3 text-muted-foreground" />
                          )}
                          {email.isFlagged && (
                            <Flag className="h-3 w-3 text-red-500" />
                          )}
                          {email.labels.map((label, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {label}
                            </Badge>
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(email.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Email Content */}
        <div className="flex-1 flex flex-col">
          {selectedEmail ? (
            <>
              <div className="p-4 border-b bg-background">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold">{selectedEmail.subject}</h2>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm">
                      <Archive className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Flag className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Tag className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          Marcar como não lido
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Calendar className="h-4 w-4 mr-2" />
                          Criar evento
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="h-4 w-4 mr-2" />
                          Criar tarefa
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Import className="h-4 w-4 mr-2" />
                          Mover para...
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={selectedEmail.from.avatar} alt={selectedEmail.from.name} />
                      <AvatarFallback>
                        {selectedEmail.from.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedEmail.from.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedEmail.from.email}</p>
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <p>{formatDate(selectedEmail.timestamp)}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {selectedEmail.priority !== "normal" && (
                        <Badge className={priorityColors[selectedEmail.priority]} variant="outline">
                          {priorityLabels[selectedEmail.priority]}
                        </Badge>
                      )}
                      {selectedEmail.isStarred && (
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-6">
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {selectedEmail.content}
                    </div>
                  </div>
                  {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium mb-3">Anexos ({selectedEmail.attachments.length})</h4>
                      <div className="space-y-2">
                        {selectedEmail.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                            <Paperclip className="h-4 w-4 text-muted-foreground" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{attachment.name}</p>
                              <p className="text-xs text-muted-foreground">{attachment.size}</p>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              <div className="p-4 border-t bg-background">
                <div className="flex items-center gap-2">
                  <Button onClick={() => replyToEmail(selectedEmail, "reply")}>
                    <Reply className="h-4 w-4 mr-2" />
                    Responder
                  </Button>
                  <Button variant="outline" onClick={() => replyToEmail(selectedEmail, "reply-all")}>
                    <ReplyAll className="h-4 w-4 mr-2" />
                    Responder a Todos
                  </Button>
                  <Button variant="outline" onClick={() => replyToEmail(selectedEmail, "forward")}>
                    <Forward className="h-4 w-4 mr-2" />
                    Encaminhar
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Selecione um email para ver o conteúdo</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  )
}
