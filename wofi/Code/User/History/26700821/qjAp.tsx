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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  MessageCircle,
  Phone,
  Mail,
  Clock,
  MapPin,
  Send,
  Calendar,
  Video,
  FileText,
  AlertCircle,
  CheckCircle,
  Headphones,
  Users,
  Globe,
  Shield,
  Zap,
  Heart,
  Star,
  ArrowRight,
  ExternalLink,
  Download,
  Book,
  HelpCircle,
  MessageSquare,
  PhoneCall,
  Timer,
  CalendarDays,
  CheckCircle2
} from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { PageContainer } from "@/components/layout/page-container"

type SupportOption = {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  availability: string
  responseTime: string
  bestFor: string[]
  color: string
  action: () => void
}

type TeamMember = {
  id: string
  name: string
  role: string
  avatar: string
  specialty: string[]
  languages: string[]
  timezone: string
  isOnline: boolean
}

type ContactMethod = {
  id: string
  type: "email" | "phone" | "chat" | "video" | "form"
  label: string
  value: string
  availability: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

const supportOptions: SupportOption[] = [
  {
    id: "live-chat",
    title: "Chat ao Vivo",
    description: "Conversa instantânea com nossa equipe de suporte",
    icon: MessageCircle,
    availability: "24/7",
    responseTime: "< 2 min",
    bestFor: ["Dúvidas rápidas", "Problemas técnicos", "Orientações"],
    color: "text-blue-600",
    action: () => console.log("Starting live chat...")
  },
  {
    id: "video-call",
    title: "Chamada de Vídeo",
    description: "Suporte personalizado via videoconferência",
    icon: Video,
    availability: "Seg-Sex 8h-18h",
    responseTime: "Agendamento",
    bestFor: ["Demonstrações", "Treinamento", "Problemas complexos"],
    color: "text-green-600",
    action: () => console.log("Scheduling video call...")
  },
  {
    id: "phone-support",
    title: "Suporte por Telefone",
    description: "Ligação direta para suporte urgente",
    icon: Phone,
    availability: "Seg-Sex 8h-20h",
    responseTime: "Imediato",
    bestFor: ["Emergências", "Problemas críticos", "Suporte direto"],
    color: "text-orange-600",
    action: () => console.log("Calling support...")
  },
  {
    id: "email-support",
    title: "Suporte por Email",
    description: "Envie suas dúvidas detalhadas por email",
    icon: Mail,
    availability: "24/7",
    responseTime: "< 4h",
    bestFor: ["Questões detalhadas", "Documentação", "Feedback"],
    color: "text-purple-600",
    action: () => console.log("Opening email form...")
  }
]

const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Ana Souza",
    role: "Especialista em Suporte",
    avatar: "/avatars/ana-support.jpg",
    specialty: ["Configuração", "Integração", "API"],
    languages: ["Português", "Inglês"],
    timezone: "GMT-3",
    isOnline: true
  },
  {
    id: "2",
    name: "Carlos Tech",
    role: "Suporte Técnico Senior",
    avatar: "/avatars/carlos-tech.jpg",
    specialty: ["Desenvolvimento", "Webhooks", "Troubleshooting"],
    languages: ["Português", "Inglês", "Espanhol"],
    timezone: "GMT-3",
    isOnline: true
  },
  {
    id: "3",
    name: "Marina Help",
    role: "Success Manager",
    avatar: "/avatars/marina-help.jpg",
    specialty: ["Onboarding", "Treinamento", "Best Practices"],
    languages: ["Português"],
    timezone: "GMT-3",
    isOnline: false
  },
  {
    id: "4",
    name: "Roberto Quick",
    role: "Suporte 24/7",
    avatar: "/avatars/roberto-quick.jpg",
    specialty: ["Emergências", "Problemas críticos", "Escalação"],
    languages: ["Português", "Inglês"],
    timezone: "GMT-3",
    isOnline: true
  }
]

const contactMethods: ContactMethod[] = [
  {
    id: "primary-email",
    type: "email",
    label: "Email Principal",
    value: "suporte@empresa.com",
    availability: "24/7",
    description: "Para questões gerais e suporte técnico",
    icon: Mail
  },
  {
    id: "phone-brazil",
    type: "phone",
    label: "Telefone Brasil",
    value: "+55 (11) 1234-5678",
    availability: "Seg-Sex 8h-20h",
    description: "Suporte telefônico em português",
    icon: Phone
  },
  {
    id: "emergency-phone",
    type: "phone",
    label: "Emergência 24h",
    value: "+55 (11) 9999-0000",
    availability: "24/7",
    description: "Apenas para problemas críticos",
    icon: PhoneCall
  },
  {
    id: "live-chat",
    type: "chat",
    label: "Chat ao Vivo",
    value: "Disponível no site",
    availability: "24/7",
    description: "Resposta imediata via chat",
    icon: MessageSquare
  }
]

export default function ContactPage() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    priority: "normal",
    category: "general",
    message: "",
    attachments: [] as File[]
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simular envio
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
      setFormData({
        name: "",
        email: "",
        company: "",
        subject: "",
        priority: "normal",
        category: "general",
        message: "",
        attachments: []
      })
    }, 2000)
  }

  const onlineTeamMembers = teamMembers.filter(member => member.isOnline)

  return (
    <PageContainer>
      <PageHeader
        title="Contato e Suporte"
        description="Entre em contato conosco através do canal que preferir. Nossa equipe está pronta para ajudar!"
        actions={[
          {
            label: "Central de Ajuda",
            variant: "outline",
            icon: HelpCircle,
            href: "/dashboard/support/help"
          },
          {
            label: "Chat ao Vivo",
            icon: MessageCircle,
            onClick: () => setSelectedOption("live-chat")
          }
        ]}
      />

      {submitted && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-800">Mensagem Enviada com Sucesso!</h3>
                <p className="text-sm text-green-700">
                  Recebemos sua solicitação. Nossa equipe entrará em contato em breve.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Support Options */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {supportOptions.map((option) => {
          const Icon = option.icon
          return (
            <Card key={option.id} 
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedOption === option.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => {
                    setSelectedOption(option.id)
                    option.action()
                  }}>
              <CardHeader className="text-center">
                <div className={`mx-auto p-3 rounded-full bg-muted ${option.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">{option.title}</CardTitle>
                <CardDescription>{option.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-2">
                <div className="flex items-center justify-center gap-1 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>{option.availability}</span>
                </div>
                <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                  <Timer className="h-4 w-4" />
                  <span>Resposta: {option.responseTime}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-3">
                  {option.bestFor.slice(0, 2).map((item, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Envie uma Mensagem</CardTitle>
              <CardDescription>
                Preencha o formulário abaixo e nossa equipe entrará em contato
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Nome *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="company">Empresa</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    placeholder="Nome da sua empresa"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="category">Categoria</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">Questão Geral</SelectItem>
                        <SelectItem value="technical">Problema Técnico</SelectItem>
                        <SelectItem value="billing">Faturamento</SelectItem>
                        <SelectItem value="feature">Nova Funcionalidade</SelectItem>
                        <SelectItem value="training">Treinamento</SelectItem>
                        <SelectItem value="bug">Relatar Bug</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="priority">Prioridade</Label>
                    <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
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
                </div>

                <div>
                  <Label htmlFor="subject">Assunto *</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    placeholder="Descreva brevemente sua solicitação"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message">Mensagem *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Descreva detalhadamente sua dúvida ou problema..."
                    rows={6}
                    required
                  />
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    * Campos obrigatórios
                  </p>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Timer className="h-4 w-4 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Enviar Mensagem
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Methods */}
          <Card>
            <CardHeader>
              <CardTitle>Informações de Contato</CardTitle>
              <CardDescription>
                Formas diretas de entrar em contato
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {contactMethods.map((method) => {
                const Icon = method.icon
                return (
                  <div key={method.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="p-2 rounded bg-muted">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{method.label}</h4>
                      <p className="text-sm font-mono">{method.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {method.description}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        <span className="text-xs text-muted-foreground">
                          {method.availability}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Team Online */}
          <Card>
            <CardHeader>
              <CardTitle>Equipe Online ({onlineTeamMembers.length})</CardTitle>
              <CardDescription>
                Especialistas disponíveis agora
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {onlineTeamMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{member.name}</h4>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {member.specialty.slice(0, 2).map((spec, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                Iniciar Chat
              </Button>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle>Links Úteis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" size="sm">
                <Book className="h-4 w-4 mr-2" />
                Base de Conhecimento
              </Button>
              <Button variant="ghost" className="w-full justify-start" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Documentação da API
              </Button>
              <Button variant="ghost" className="w-full justify-start" size="sm">
                <Video className="h-4 w-4 mr-2" />
                Tutoriais em Vídeo
              </Button>
              <Button variant="ghost" className="w-full justify-start" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Comunidade
              </Button>
              <Button variant="ghost" className="w-full justify-start" size="sm">
                <Globe className="h-4 w-4 mr-2" />
                Status do Sistema
              </Button>
            </CardContent>
          </Card>

          {/* Response Times */}
          <Card>
            <CardHeader>
              <CardTitle>Tempos de Resposta</CardTitle>
              <CardDescription>
                Nossos compromissos de atendimento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Chat ao Vivo</span>
                <Badge variant="secondary">{"< 2 min"}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Email Urgente</span>
                <Badge variant="secondary">{"< 1h"}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Email Normal</span>
                <Badge variant="secondary">{"< 4h"}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Telefone</span>
                <Badge variant="secondary">Imediato</Badge>
              </div>
              <Separator className="my-3" />
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">99.2%</div>
                <p className="text-xs text-muted-foreground">
                  Satisfação dos clientes
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Emergency Contact */}
      <Card className="mt-8 border-orange-200 bg-orange-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-orange-800">Emergência ou Problema Crítico?</h3>
              <p className="text-sm text-orange-700 mb-3">
                Para problemas que afetam sua operação crítica, entre em contato imediatamente:
              </p>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" className="border-orange-300 text-orange-700">
                  <Phone className="h-4 w-4 mr-2" />
                  +55 (11) 9999-0000
                </Button>
                <Button variant="outline" size="sm" className="border-orange-300 text-orange-700">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat Emergência
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  )
}
