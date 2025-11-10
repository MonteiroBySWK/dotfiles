"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Search,
  BookOpen,
  FileText,
  Code,
  Globe,
  Download,
  Eye,
  Clock,
  Star,
  ChevronRight,
  ExternalLink,
  Copy,
  Check,
  Bookmark,
  Share2,
  ArrowRight,
  Lightbulb,
  Settings,
  Zap,
  Shield,
  Database,
  Smartphone,
  Users,
  CreditCard,
  BarChart3,
  MessageSquare,
  Bell,
  Layout,
  Palette,
  Lock,
  Webhook,
  Terminal,
  GitBranch,
  Play,
  Filter,
  Tag,
  Calendar,
  Image,
  Video,
  Headphones
} from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { PageContainer } from "@/components/layout/page-container"
import { StatCard } from "@/components/common"

type DocSection = {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  articles: DocArticle[]
  color: string
}

type DocArticle = {
  id: string
  title: string
  description: string
  content: string
  lastUpdated: string
  readTime: number
  difficulty: "beginner" | "intermediate" | "advanced"
  tags: string[]
  views: number
  isPopular?: boolean
  codeExamples?: CodeExample[]
}

type CodeExample = {
  id: string
  title: string
  language: string
  code: string
  description: string
}

type QuickLink = {
  id: string
  title: string
  description: string
  url: string
  icon: React.ComponentType<{ className?: string }>
  isExternal?: boolean
}

const mockCodeExamples: CodeExample[] = [
  {
    id: "1",
    title: "Autenticação API",
    language: "javascript",
    code: `// Exemplo de autenticação com JWT
const token = localStorage.getItem('authToken');

const response = await fetch('/api/projects', {
  headers: {
    'Authorization': \`Bearer \${token}\`,
    'Content-Type': 'application/json'
  }
});

const projects = await response.json();`,
    description: "Como autenticar requisições para a API"
  },
  {
    id: "2",
    title: "Webhook Configuration",
    language: "json",
    code: `{
  "url": "https://seu-site.com/webhook",
  "events": [
    "project.created",
    "task.completed",
    "team.member_added"
  ],
  "secret": "seu_secret_aqui",
  "active": true
}`,
    description: "Configuração básica de webhook"
  }
]

const docSections: DocSection[] = [
  {
    id: "getting-started",
    title: "Primeiros Passos",
    description: "Comece aqui para configurar sua conta e projetos",
    icon: Zap,
    color: "text-blue-600",
    articles: [
      {
        id: "setup-account",
        title: "Configuração da Conta",
        description: "Como configurar sua conta e perfil inicial",
        content: "Guia completo para configurar sua conta...",
        lastUpdated: "2024-01-15",
        readTime: 5,
        difficulty: "beginner",
        tags: ["conta", "configuração", "perfil"],
        views: 2340,
        isPopular: true
      },
      {
        id: "first-project",
        title: "Criando seu Primeiro Projeto",
        description: "Tutorial passo a passo para criar um projeto",
        content: "Neste tutorial você aprenderá...",
        lastUpdated: "2024-01-14",
        readTime: 8,
        difficulty: "beginner",
        tags: ["projeto", "tutorial", "básico"],
        views: 1890
      },
      {
        id: "team-setup",
        title: "Configuração da Equipe",
        description: "Como adicionar e gerenciar membros da equipe",
        content: "Para começar a colaborar...",
        lastUpdated: "2024-01-12",
        readTime: 6,
        difficulty: "beginner",
        tags: ["equipe", "colaboração", "membros"],
        views: 1567
      }
    ]
  },
  {
    id: "projects",
    title: "Gestão de Projetos",
    description: "Gerencie projetos de forma eficiente",
    icon: Lightbulb,
    color: "text-green-600",
    articles: [
      {
        id: "project-templates",
        title: "Templates de Projeto",
        description: "Como usar e criar templates personalizados",
        content: "Templates facilitam a criação...",
        lastUpdated: "2024-01-13",
        readTime: 10,
        difficulty: "intermediate",
        tags: ["templates", "produtividade", "customização"],
        views: 1234,
        isPopular: true
      },
      {
        id: "task-management",
        title: "Gerenciamento de Tarefas",
        description: "Organize e acompanhe tarefas eficientemente",
        content: "O sistema de tarefas permite...",
        lastUpdated: "2024-01-11",
        readTime: 12,
        difficulty: "intermediate",
        tags: ["tarefas", "organização", "produtividade"],
        views: 987
      }
    ]
  },
  {
    id: "api",
    title: "API e Integrações",
    description: "Documentação técnica da API REST",
    icon: Code,
    color: "text-purple-600",
    articles: [
      {
        id: "api-authentication",
        title: "Autenticação da API",
        description: "Como autenticar suas requisições",
        content: "Nossa API usa JWT para autenticação...",
        lastUpdated: "2024-01-10",
        readTime: 15,
        difficulty: "advanced",
        tags: ["api", "autenticação", "jwt", "segurança"],
        views: 756,
        codeExamples: [mockCodeExamples[0]]
      },
      {
        id: "webhooks",
        title: "Configuração de Webhooks",
        description: "Receba notificações em tempo real",
        content: "Webhooks permitem que você...",
        lastUpdated: "2024-01-09",
        readTime: 18,
        difficulty: "advanced",
        tags: ["webhook", "notificações", "integração"],
        views: 654,
        codeExamples: [mockCodeExamples[1]]
      }
    ]
  },
  {
    id: "reports",
    title: "Relatórios e Analytics",
    description: "Extraia insights dos seus dados",
    icon: BarChart3,
    color: "text-orange-600",
    articles: [
      {
        id: "custom-reports",
        title: "Relatórios Personalizados",
        description: "Crie relatórios sob medida para sua equipe",
        content: "Os relatórios personalizados...",
        lastUpdated: "2024-01-08",
        readTime: 14,
        difficulty: "intermediate",
        tags: ["relatórios", "personalização", "dados"],
        views: 543
      }
    ]
  },
  {
    id: "security",
    title: "Segurança",
    description: "Mantenha seus dados seguros",
    icon: Shield,
    color: "text-red-600",
    articles: [
      {
        id: "2fa-setup",
        title: "Configuração de 2FA",
        description: "Ative a autenticação de dois fatores",
        content: "A autenticação de dois fatores...",
        lastUpdated: "2024-01-07",
        readTime: 7,
        difficulty: "beginner",
        tags: ["2fa", "segurança", "autenticação"],
        views: 432
      }
    ]
  },
  {
    id: "mobile",
    title: "App Mobile",
    description: "Use nossa plataforma em dispositivos móveis",
    icon: Smartphone,
    color: "text-teal-600",
    articles: [
      {
        id: "mobile-features",
        title: "Funcionalidades Mobile",
        description: "Conheça as funcionalidades do app mobile",
        content: "O app mobile oferece...",
        lastUpdated: "2024-01-06",
        readTime: 9,
        difficulty: "beginner",
        tags: ["mobile", "app", "funcionalidades"],
        views: 321
      }
    ]
  }
]

const quickLinks: QuickLink[] = [
  {
    id: "api-reference",
    title: "Referência da API",
    description: "Documentação completa da API REST",
    url: "/api-docs",
    icon: Code
  },
  {
    id: "changelog",
    title: "Changelog",
    description: "Acompanhe as últimas atualizações",
    url: "/changelog",
    icon: GitBranch
  },
  {
    id: "status",
    title: "Status do Sistema",
    description: "Monitoramento em tempo real",
    url: "https://status.plataforma.com",
    icon: Globe,
    isExternal: true
  },
  {
    id: "github",
    title: "SDK no GitHub",
    description: "Bibliotecas e exemplos de código",
    url: "https://github.com/empresa/sdk",
    icon: Terminal,
    isExternal: true
  }
]

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "beginner": return "bg-green-100 text-green-800"
    case "intermediate": return "bg-yellow-100 text-yellow-800"
    case "advanced": return "bg-red-100 text-red-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

const getDifficultyLabel = (difficulty: string) => {
  switch (difficulty) {
    case "beginner": return "Iniciante"
    case "intermediate": return "Intermediário"
    case "advanced": return "Avançado"
    default: return "Desconhecido"
  }
}

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<DocArticle | null>(null)
  const [filterDifficulty, setFilterDifficulty] = useState("all")
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const allArticles = docSections.flatMap(section => 
    section.articles.map(article => ({ ...article, sectionId: section.id, sectionTitle: section.title }))
  )

  const filteredArticles = allArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesDifficulty = filterDifficulty === "all" || article.difficulty === filterDifficulty
    return matchesSearch && matchesDifficulty
  })

  const popularArticles = allArticles.filter(article => article.isPopular)

  const copyCode = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(id)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (err) {
      console.error('Falha ao copiar código:', err)
    }
  }

  const handleSectionClick = (section: DocSection) => {
    setSelectedSection(section.id)
    setSelectedArticle(null)
  }

  const handleArticleClick = (article: DocArticle) => {
    setSelectedArticle(article)
  }

  return (
    <PageContainer>
      <PageHeader
        title="Documentação"
        description="Guias completos, tutoriais e referências técnicas para aproveitar ao máximo nossa plataforma"
        actions={[
          {
            label: "Download PDF",
            variant: "outline",
            icon: Download
          },
          {
            label: "API Reference",
            icon: ExternalLink
          }
        ]}
      />

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg">Navegação</CardTitle>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar documentação..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {docSections.map((section) => {
                    const Icon = section.icon
                    const isSelected = selectedSection === section.id
                    return (
                      <div key={section.id}>
                        <Button
                          variant={isSelected ? "secondary" : "ghost"}
                          className="w-full justify-start"
                          onClick={() => handleSectionClick(section)}
                        >
                          <Icon className={`h-4 w-4 mr-2 ${section.color}`} />
                          <span className="flex-1 text-left">{section.title}</span>
                          <Badge variant="secondary" className="text-xs">
                            {section.articles.length}
                          </Badge>
                        </Button>
                        {isSelected && (
                          <div className="ml-6 mt-1 space-y-1">
                            {section.articles.map((article) => (
                              <Button
                                key={article.id}
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start text-xs"
                                onClick={() => handleArticleClick(article)}
                              >
                                {article.title}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {selectedArticle ? (
            /* Article View */
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <span>{docSections.find(s => s.id === selectedSection)?.title}</span>
                    <ChevronRight className="h-4 w-4" />
                    <span>{selectedArticle.title}</span>
                  </div>
                  <CardTitle className="text-2xl">{selectedArticle.title}</CardTitle>
                  <CardDescription className="text-base">{selectedArticle.description}</CardDescription>
                  <div className="flex items-center gap-4 mt-4">
                    <Badge className={getDifficultyColor(selectedArticle.difficulty)}>
                      {getDifficultyLabel(selectedArticle.difficulty)}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {selectedArticle.readTime} min
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Eye className="h-4 w-4" />
                      {selectedArticle.views.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(selectedArticle.lastUpdated).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      <Bookmark className="h-4 w-4 mr-2" />
                      Salvar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Compartilhar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-muted-foreground leading-relaxed">
                      {selectedArticle.content}
                    </p>
                  </div>

                  {selectedArticle.codeExamples && selectedArticle.codeExamples.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold mb-4">Exemplos de Código</h3>
                      <div className="space-y-4">
                        {selectedArticle.codeExamples.map((example) => (
                          <Card key={example.id}>
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-base">{example.title}</CardTitle>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">{example.language}</Badge>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyCode(example.code, example.id)}
                                  >
                                    {copiedCode === example.id ? (
                                      <Check className="h-4 w-4" />
                                    ) : (
                                      <Copy className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                              <CardDescription>{example.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                                <code>{example.code}</code>
                              </pre>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mt-8">
                    {selectedArticle.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : searchQuery ? (
            /* Search Results */
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Resultados da Busca</CardTitle>
                      <CardDescription>
                        {filteredArticles.length} resultado{filteredArticles.length !== 1 ? 's' : ''} para &quot;{searchQuery}&quot;
                      </CardDescription>
                    </div>
                    <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os níveis</SelectItem>
                        <SelectItem value="beginner">Iniciante</SelectItem>
                        <SelectItem value="intermediate">Intermediário</SelectItem>
                        <SelectItem value="advanced">Avançado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredArticles.map((article) => (
                      <Card key={article.id} className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => handleArticleClick(article)}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline">{article.sectionTitle}</Badge>
                                <Badge className={getDifficultyColor(article.difficulty)}>
                                  {getDifficultyLabel(article.difficulty)}
                                </Badge>
                              </div>
                              <CardTitle className="text-lg">{article.title}</CardTitle>
                              <CardDescription>{article.description}</CardDescription>
                              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {article.readTime} min
                                </div>
                                <div className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  {article.views}
                                </div>
                              </div>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground" />
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Overview */
            <div className="space-y-8">
              {/* Overview Cards - Using new StatCard component with responsive grid */}
              <div className="grid gap-4 md:grid-cols-3">
                <StatCard
                  title="Total de Artigos"
                  value={allArticles.length.toString()}
                  description="guias disponíveis"
                  icon={BookOpen}
                  iconColor="text-blue-600"
                />
                <StatCard
                  title="Última Atualização"
                  value="Hoje"
                  description="documentação atualizada"
                  icon={Clock}
                  iconColor="text-green-600"
                />
                <StatCard
                  title="Mais Visitados"
                  value={popularArticles.length.toString()}
                  description="artigos populares"
                  icon={Star}
                  iconColor="text-yellow-600"
                />
              </div>

              {/* Popular Articles */}
              <Card>
                <CardHeader>
                  <CardTitle>Artigos Populares</CardTitle>
                  <CardDescription>Os guias mais acessados pela comunidade</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {popularArticles.map((article) => (
                      <div key={article.id} 
                           className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                           onClick={() => handleArticleClick(article)}>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline">{article.sectionTitle}</Badge>
                            <Badge className={getDifficultyColor(article.difficulty)}>
                              {getDifficultyLabel(article.difficulty)}
                            </Badge>
                          </div>
                          <h4 className="font-medium">{article.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{article.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {article.views.toLocaleString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {article.readTime} min
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card>
                <CardHeader>
                  <CardTitle>Links Rápidos</CardTitle>
                  <CardDescription>Recursos adicionais e ferramentas úteis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {quickLinks.map((link) => {
                      const Icon = link.icon
                      return (
                        <Card key={link.id} className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardHeader className="pb-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-muted">
                                <Icon className="h-5 w-5" />
                              </div>
                              <div className="flex-1">
                                <CardTitle className="text-base flex items-center gap-2">
                                  {link.title}
                                  {link.isExternal && <ExternalLink className="h-3 w-3" />}
                                </CardTitle>
                                <CardDescription className="text-sm">{link.description}</CardDescription>
                              </div>
                              <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </CardHeader>
                        </Card>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Sections Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Seções da Documentação</CardTitle>
                  <CardDescription>Explore diferentes áreas da nossa documentação</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {docSections.map((section) => {
                      const Icon = section.icon
                      return (
                        <Card key={section.id} 
                              className="cursor-pointer hover:shadow-md transition-shadow"
                              onClick={() => handleSectionClick(section)}>
                          <CardHeader>
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg bg-muted ${section.color}`}>
                                <Icon className="h-5 w-5" />
                              </div>
                              <div className="flex-1">
                                <CardTitle className="text-base">{section.title}</CardTitle>
                                <CardDescription>{section.description}</CardDescription>
                              </div>
                              <Badge variant="secondary">{section.articles.length}</Badge>
                            </div>
                          </CardHeader>
                        </Card>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  )
}
