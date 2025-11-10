"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  HelpCircle,
  Book,
  MessageCircle,
  Phone,
  Mail,
  ExternalLink,
  Search,
  ChevronRight,
  FileText,
  Video,
  Download,
  Star,
  Clock,
  Users
} from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { PageContainer } from "@/components/layout/page-container"

// Dados mockados da central de ajuda
const helpCategories = [
  {
    id: "getting-started",
    title: "Primeiros Passos",
    description: "Tudo que você precisa para começar",
    icon: "🚀",
    articles: 12,
    popular: true
  },
  {
    id: "projects",
    title: "Gestão de Projetos",
    description: "Como criar e gerenciar seus projetos",
    icon: "📁",
    articles: 8,
    popular: true
  },
  {
    id: "teams",
    title: "Equipes e Colaboração",
    description: "Trabalhe em equipe de forma eficiente",
    icon: "👥",
    articles: 6,
    popular: false
  },
  {
    id: "integrations",
    title: "Integrações",
    description: "Conecte com suas ferramentas favoritas",
    icon: "🔗",
    articles: 15,
    popular: false
  },
  {
    id: "billing",
    title: "Faturamento",
    description: "Planos, pagamentos e faturas",
    icon: "💳",
    articles: 5,
    popular: false
  },
  {
    id: "troubleshooting",
    title: "Solução de Problemas",
    description: "Resolva problemas comuns rapidamente",
    icon: "🔧",
    articles: 10,
    popular: true
  }
]

const popularArticles = [
  {
    id: "1",
    title: "Como criar seu primeiro projeto",
    description: "Guia passo a passo para configurar seu primeiro projeto",
    category: "Primeiros Passos",
    readTime: "5 min",
    rating: 4.8,
    views: 1250,
    lastUpdated: "2024-09-20"
  },
  {
    id: "2",
    title: "Configurando notificações",
    description: "Personalize suas notificações para não perder nada importante",
    category: "Configurações",
    readTime: "3 min",
    rating: 4.6,
    views: 980,
    lastUpdated: "2024-09-18"
  },
  {
    id: "3",
    title: "Gerenciando permissões de equipe",
    description: "Como definir papéis e permissões para sua equipe",
    category: "Equipes",
    readTime: "7 min",
    rating: 4.9,
    views: 750,
    lastUpdated: "2024-09-15"
  },
  {
    id: "4",
    title: "Integrando com ferramentas externas",
    description: "Configure integrações com Slack, GitHub e outras ferramentas",
    category: "Integrações",
    readTime: "10 min",
    rating: 4.7,
    views: 680,
    lastUpdated: "2024-09-12"
  }
]

const supportChannels = [
  {
    id: "live-chat",
    title: "Chat ao Vivo",
    description: "Fale conosco em tempo real",
    icon: MessageCircle,
    availability: "Online agora",
    responseTime: "< 2 min",
    available: true
  },
  {
    id: "email",
    title: "Email",
    description: "Envie suas dúvidas por email",
    icon: Mail,
    availability: "24/7",
    responseTime: "< 4 horas",
    available: true
  },
  {
    id: "phone",
    title: "Telefone",
    description: "Suporte telefônico especializado",
    icon: Phone,
    availability: "Seg-Sex 9h-18h",
    responseTime: "Imediato",
    available: false
  }
]

const videoTutorials = [
  {
    id: "1",
    title: "Introdução ao Dashboard",
    description: "Visão geral completa da interface",
    duration: "8:32",
    thumbnail: "/thumbnails/intro-dashboard.jpg",
    category: "Básico"
  },
  {
    id: "2",
    title: "Criando e Gerenciando Projetos",
    description: "Tutorial completo sobre gestão de projetos",
    duration: "12:45",
    thumbnail: "/thumbnails/projects.jpg",
    category: "Projetos"
  },
  {
    id: "3",
    title: "Configurações Avançadas",
    description: "Personalize o sistema para suas necessidades",
    duration: "15:20",
    thumbnail: "/thumbnails/advanced.jpg",
    category: "Avançado"
  }
]

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCategories = helpCategories.filter(category =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredArticles = popularArticles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <PageContainer>
      <PageHeader
        title="Central de Suporte"
        description="Encontre respostas, tutoriais e entre em contato conosco"
        badge={{
          label: "24/7 disponível",
          variant: "secondary"
        }}
      />

      {/* Busca Global */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold">Como podemos ajudar?</h2>
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Busque por artigos, tutoriais ou dúvidas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-lg"
              />
            </div>
            <p className="text-muted-foreground">
              Digite sua dúvida ou browse pelas categorias abaixo
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Canais de Suporte */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Precisa de Ajuda Imediata?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {supportChannels.map((channel) => {
            const IconComponent = channel.icon
            
            return (
              <Card key={channel.id} className={`hover:shadow-md transition-shadow ${
                channel.available ? 'border-green-200' : 'border-gray-200'
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${
                      channel.available ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{channel.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        {channel.description}
                      </p>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Disponibilidade:</span>
                          <span className={channel.available ? 'text-green-600' : 'text-gray-600'}>
                            {channel.availability}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Resposta:</span>
                          <span>{channel.responseTime}</span>
                        </div>
                      </div>
                      <Button 
                        className="w-full mt-4" 
                        variant={channel.available ? "default" : "outline"}
                        disabled={!channel.available}
                      >
                        {channel.available ? "Iniciar Conversa" : "Indisponível"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Categorias de Ajuda */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Categorias de Ajuda</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((category) => (
            <Card key={category.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{category.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1 flex items-center">
                        {category.title}
                        {category.popular && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            Popular
                          </Badge>
                        )}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        {category.description}
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <FileText className="h-3 w-3 mr-1" />
                        {category.articles} artigos
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Artigos Populares */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Artigos Populares</h3>
        <div className="space-y-4">
          {filteredArticles.map((article) => (
            <Card key={article.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{article.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {article.category}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-3">
                      {article.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {article.readTime}
                      </div>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 mr-1 text-yellow-500" />
                        {article.rating}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {article.views} visualizações
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Ler
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tutoriais em Vídeo */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Tutoriais em Vídeo</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videoTutorials.map((video) => (
            <Card key={video.id} className="hover:shadow-md transition-shadow overflow-hidden">
              <div className="aspect-video bg-muted relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button variant="secondary" size="lg" className="rounded-full">
                    <Video className="h-6 w-6" />
                  </Button>
                </div>
                <Badge className="absolute top-2 right-2 bg-black/70 text-white">
                  {video.duration}
                </Badge>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-sm">{video.title}</h4>
                  <Badge variant="outline" className="text-xs">
                    {video.category}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {video.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Downloads e Recursos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Download className="h-5 w-5 mr-2" />
            Downloads e Recursos
          </CardTitle>
          <CardDescription>
            Materiais úteis para otimizar seu uso da plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Guia de Primeiros Passos</h4>
                <p className="text-sm text-muted-foreground">PDF • 2.3 MB</p>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-3 w-3 mr-1" />
                Baixar
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Templates de Projeto</h4>
                <p className="text-sm text-muted-foreground">ZIP • 5.7 MB</p>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-3 w-3 mr-1" />
                Baixar
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Manual do Usuário Completo</h4>
                <p className="text-sm text-muted-foreground">PDF • 8.1 MB</p>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-3 w-3 mr-1" />
                Baixar
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Atalhos de Teclado</h4>
                <p className="text-sm text-muted-foreground">PDF • 0.5 MB</p>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-3 w-3 mr-1" />
                Baixar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  )
}
