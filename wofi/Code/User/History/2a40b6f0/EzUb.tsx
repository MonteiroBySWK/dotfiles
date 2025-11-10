"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { 
  Search,
  HelpCircle,
  BookOpen,
  Video,
  MessageCircle,
  Star,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Clock,
  Users,
  Lightbulb,
  Settings,
  Zap,
  Shield,
  CreditCard,
  FileText,
  Database,
  Smartphone,
  Globe,
  Mail,
  Phone,
  ArrowRight,
  ExternalLink,
  Download,
  Play,
  Bookmark,
  Share2,
  Flag,
  CheckCircle
} from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { PageContainer } from "@/components/layout/page-container"

type FAQItem = {
  id: string
  question: string
  answer: string
  category: string
  views: number
  helpful: number
  notHelpful: number
  lastUpdated: string
  tags: string[]
}

type HelpCategory = {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  articleCount: number
  color: string
}

type PopularArticle = {
  id: string
  title: string
  description: string
  category: string
  views: number
  rating: number
  readTime: number
  lastUpdated: string
  author: {
    name: string
    avatar: string
  }
}

type Video = {
  id: string
  title: string
  description: string
  thumbnail: string
  duration: string
  views: number
  category: string
}

const mockFAQs: FAQItem[] = [
  {
    id: "1",
    question: "Como faço para redefinir minha senha?",
    answer: "Para redefinir sua senha: 1) Acesse a página de login 2) Clique em 'Esqueci minha senha' 3) Digite seu email 4) Verifique sua caixa de entrada e siga as instruções do email recebido 5) Crie uma nova senha seguindo os critérios de segurança",
    category: "Conta",
    views: 1250,
    helpful: 95,
    notHelpful: 8,
    lastUpdated: "2024-01-10",
    tags: ["senha", "login", "segurança"]
  },
  {
    id: "2",
    question: "Como criar um novo projeto?",
    answer: "Para criar um novo projeto: 1) Navegue até a seção 'Projetos' no menu lateral 2) Clique no botão 'Novo Projeto' 3) Preencha as informações básicas (nome, descrição, cliente) 4) Defina as configurações iniciais (orçamento, prazo, equipe) 5) Clique em 'Criar Projeto' para finalizar",
    category: "Projetos",
    views: 890,
    helpful: 76,
    notHelpful: 4,
    lastUpdated: "2024-01-12",
    tags: ["projeto", "criar", "configuração"]
  },
  {
    id: "3",
    question: "Como adicionar membros à equipe?",
    answer: "Para adicionar novos membros: 1) Acesse 'Configurações' > 'Equipe' 2) Clique em 'Convidar Membro' 3) Digite o email da pessoa 4) Selecione o papel e permissões 5) Envie o convite. O novo membro receberá um email com instruções para ativar a conta",
    category: "Equipe",
    views: 654,
    helpful: 58,
    notHelpful: 6,
    lastUpdated: "2024-01-08",
    tags: ["equipe", "convite", "membros"]
  },
  {
    id: "4",
    question: "Como gerar relatórios personalizados?",
    answer: "Para gerar relatórios personalizados: 1) Vá para a seção 'Relatórios' 2) Clique em 'Novo Relatório' 3) Selecione o tipo de dados desejado 4) Configure filtros e período 5) Escolha o formato de saída (PDF, Excel) 6) Clique em 'Gerar Relatório'",
    category: "Relatórios",
    views: 423,
    helpful: 41,
    notHelpful: 2,
    lastUpdated: "2024-01-14",
    tags: ["relatórios", "dados", "personalização"]
  },
  {
    id: "5",
    question: "Como configurar notificações?",
    answer: "Para configurar suas notificações: 1) Acesse 'Configurações' > 'Notificações' 2) Escolha os tipos de eventos que deseja ser notificado 3) Selecione os canais (email, push, in-app) 4) Defina a frequência 5) Salve as configurações",
    category: "Configurações",
    views: 567,
    helpful: 52,
    notHelpful: 3,
    lastUpdated: "2024-01-11",
    tags: ["notificações", "configurações", "alertas"]
  }
]

const helpCategories: HelpCategory[] = [
  {
    id: "getting-started",
    name: "Primeiros Passos",
    description: "Guias básicos para começar a usar a plataforma",
    icon: Zap,
    articleCount: 12,
    color: "text-blue-600"
  },
  {
    id: "projects",
    name: "Gerenciamento de Projetos",
    description: "Como criar e gerenciar seus projetos",
    icon: Lightbulb,
    articleCount: 18,
    color: "text-green-600"
  },
  {
    id: "team",
    name: "Equipe e Colaboração",
    description: "Trabalhe em equipe de forma eficiente",
    icon: Users,
    articleCount: 14,
    color: "text-purple-600"
  },
  {
    id: "settings",
    name: "Configurações",
    description: "Personalize sua experiência",
    icon: Settings,
    articleCount: 9,
    color: "text-orange-600"
  },
  {
    id: "billing",
    name: "Faturamento",
    description: "Gerencie pagamentos e faturas",
    icon: CreditCard,
    articleCount: 7,
    color: "text-indigo-600"
  },
  {
    id: "security",
    name: "Segurança",
    description: "Mantenha sua conta segura",
    icon: Shield,
    articleCount: 5,
    color: "text-red-600"
  },
  {
    id: "integrations",
    name: "Integrações",
    description: "Conecte com outras ferramentas",
    icon: Globe,
    articleCount: 11,
    color: "text-teal-600"
  },
  {
    id: "mobile",
    name: "App Mobile",
    description: "Use em dispositivos móveis",
    icon: Smartphone,
    articleCount: 6,
    color: "text-pink-600"
  }
]

const popularArticles: PopularArticle[] = [
  {
    id: "1",
    title: "Guia Completo: Como Começar seu Primeiro Projeto",
    description: "Um tutorial passo a passo para criar e configurar seu primeiro projeto na plataforma.",
    category: "Primeiros Passos",
    views: 2340,
    rating: 4.8,
    readTime: 8,
    lastUpdated: "2024-01-15",
    author: {
      name: "Ana Silva",
      avatar: "/avatars/ana-help.jpg"
    }
  },
  {
    id: "2",
    title: "Melhores Práticas para Gestão de Equipes",
    description: "Dicas e estratégias para gerenciar equipes de forma eficiente usando nossa plataforma.",
    category: "Equipe",
    views: 1890,
    rating: 4.7,
    readTime: 12,
    lastUpdated: "2024-01-12",
    author: {
      name: "Carlos Manager",
      avatar: "/avatars/carlos-help.jpg"
    }
  },
  {
    id: "3",
    title: "Configuração de Integrações Avançadas",
    description: "Como integrar com Slack, Trello, GitHub e outras ferramentas populares.",
    category: "Integrações",
    views: 1567,
    rating: 4.6,
    readTime: 15,
    lastUpdated: "2024-01-10",
    author: {
      name: "Pedro Tech",
      avatar: "/avatars/pedro-help.jpg"
    }
  },
  {
    id: "4",
    title: "Relatórios e Analytics: Extraindo Insights",
    description: "Como usar os recursos de relatórios para tomar decisões baseadas em dados.",
    category: "Relatórios",
    views: 1234,
    rating: 4.9,
    readTime: 10,
    lastUpdated: "2024-01-14",
    author: {
      name: "Maria Dados",
      avatar: "/avatars/maria-help.jpg"
    }
  }
]

const videos: Video[] = [
  {
    id: "1",
    title: "Tour pela Interface Principal",
    description: "Conheça todas as funcionalidades da interface em 5 minutos",
    thumbnail: "/videos/tour-interface.jpg",
    duration: "5:23",
    views: 3456,
    category: "Primeiros Passos"
  },
  {
    id: "2",
    title: "Criando seu Primeiro Dashboard",
    description: "Aprenda a personalizar dashboards para sua equipe",
    thumbnail: "/videos/dashboard-tutorial.jpg",
    duration: "8:15",
    views: 2891,
    category: "Projetos"
  },
  {
    id: "3",
    title: "Configuração de Notificações",
    description: "Como configurar alertas e notificações personalizadas",
    thumbnail: "/videos/notifications.jpg",
    duration: "3:42",
    views: 1987,
    category: "Configurações"
  }
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showAllFAQs, setShowAllFAQs] = useState(false)

  const filteredFAQs = mockFAQs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const displayedFAQs = showAllFAQs ? filteredFAQs : filteredFAQs.slice(0, 5)

  const handleVote = (faqId: string, type: "helpful" | "notHelpful") => {
    // Aqui você enviaria o voto para o backend
    console.log(`Vote ${type} for FAQ ${faqId}`)
  }

  return (
    <PageContainer>
      <PageHeader
        title="Central de Ajuda"
        description="Encontre respostas rápidas, guias detalhados e recursos para aproveitar ao máximo nossa plataforma"
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <MessageCircle className="h-4 w-4 mr-2" />
              Contatar Suporte
            </Button>
            <Button>
              <BookOpen className="h-4 w-4 mr-2" />
              Ver Documentação
            </Button>
          </div>
        }
      />

      {/* Search */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="O que você está procurando? Ex: como criar projeto, redefinir senha..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
          {searchQuery && (
            <div className="mt-4 text-center text-sm text-muted-foreground">
              {filteredFAQs.length} resultado{filteredFAQs.length !== 1 ? 's' : ''} encontrado{filteredFAQs.length !== 1 ? 's' : ''}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Artigos</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82</div>
            <p className="text-xs text-muted-foreground">guias disponíveis</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vídeos</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">tutoriais em vídeo</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">FAQs</CardTitle>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockFAQs.length}</div>
            <p className="text-xs text-muted-foreground">perguntas frequentes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfação</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">96%</div>
            <p className="text-xs text-muted-foreground">usuários satisfeitos</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Categories */}
          {!searchQuery && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Categorias de Ajuda</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {helpCategories.map((category) => {
                  const Icon = category.icon
                  return (
                    <Card key={category.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-muted ${category.color}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-base">{category.name}</CardTitle>
                            <CardDescription>{category.description}</CardDescription>
                          </div>
                          <Badge variant="secondary">{category.articleCount}</Badge>
                        </div>
                      </CardHeader>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {/* Popular Articles */}
          {!searchQuery && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Artigos Populares</h2>
              <div className="space-y-4">
                {popularArticles.map((article) => (
                  <Card key={article.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{article.category}</Badge>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Eye className="h-3 w-3" />
                              {article.views.toLocaleString()}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {article.readTime} min
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              {article.rating}
                            </div>
                          </div>
                          <CardTitle className="text-lg mb-2">{article.title}</CardTitle>
                          <CardDescription>{article.description}</CardDescription>
                          <div className="flex items-center gap-2 mt-3">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={article.author.avatar} alt={article.author.name} />
                              <AvatarFallback className="text-xs">
                                {article.author.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-muted-foreground">
                              Por {article.author.name} • {new Date(article.lastUpdated).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* FAQs */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {searchQuery ? 'Resultados da Busca' : 'Perguntas Frequentes'}
              </h2>
              {!searchQuery && filteredFAQs.length > 5 && (
                <Button 
                  variant="outline" 
                  onClick={() => setShowAllFAQs(!showAllFAQs)}
                >
                  {showAllFAQs ? 'Ver Menos' : `Ver Todas (${filteredFAQs.length})`}
                </Button>
              )}
            </div>
            <Accordion type="single" collapsible className="w-full">
              {displayedFAQs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center justify-between w-full pr-4">
                      <span>{faq.question}</span>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline">{faq.category}</Badge>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {faq.views}
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <p className="text-sm leading-relaxed">{faq.answer}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Esta resposta foi útil?</span>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleVote(faq.id, "helpful")}
                            className="h-6 px-2"
                          >
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            {faq.helpful}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleVote(faq.id, "notHelpful")}
                            className="h-6 px-2"
                          >
                            <ThumbsDown className="h-3 w-3 mr-1" />
                            {faq.notHelpful}
                          </Button>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <span>Atualizado em {new Date(faq.lastUpdated).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {faq.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Support */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Precisa de Mais Ajuda?</CardTitle>
              <CardDescription>Nossa equipe está aqui para ajudar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start">
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat ao Vivo
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Enviar Email
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Phone className="h-4 w-4 mr-2" />
                Agendar Ligação
              </Button>
            </CardContent>
          </Card>

          {/* Video Tutorials */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tutoriais em Vídeo</CardTitle>
              <CardDescription>Aprenda visualmente</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {videos.map((video) => (
                <div key={video.id} className="group cursor-pointer">
                  <div className="relative rounded-lg overflow-hidden mb-2">
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <Play className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <h4 className="font-medium text-sm mb-1 group-hover:text-primary transition-colors">
                    {video.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mb-2">{video.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline">{video.category}</Badge>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {video.views.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full" size="sm">
                Ver Todos os Vídeos
                <ExternalLink className="h-3 w-3 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Links Rápidos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start h-auto py-2">
                <div className="text-left">
                  <div className="font-medium text-sm">Status do Sistema</div>
                  <div className="text-xs text-muted-foreground">Verifique a disponibilidade</div>
                </div>
              </Button>
              <Button variant="ghost" className="w-full justify-start h-auto py-2">
                <div className="text-left">
                  <div className="font-medium text-sm">Roadmap</div>
                  <div className="text-xs text-muted-foreground">Próximas funcionalidades</div>
                </div>
              </Button>
              <Button variant="ghost" className="w-full justify-start h-auto py-2">
                <div className="text-left">
                  <div className="font-medium text-sm">API Docs</div>
                  <div className="text-xs text-muted-foreground">Documentação técnica</div>
                </div>
              </Button>
              <Button variant="ghost" className="w-full justify-start h-auto py-2">
                <div className="text-left">
                  <div className="font-medium text-sm">Comunidade</div>
                  <div className="text-xs text-muted-foreground">Fórum de usuários</div>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}
