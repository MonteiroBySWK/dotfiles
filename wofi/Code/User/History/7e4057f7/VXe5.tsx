"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/authStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowRight, 
  CheckCircle, 
  Code, 
  Users, 
  BarChart3, 
  Shield, 
  Zap,
  Star,
  Rocket,
  Globe,
  Smartphone,
  Brain
} from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const { user, loading } = useAuthStore()

  useEffect(() => {
    // Se o usuário estiver logado, redirecionar para o dashboard
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  const handleGetStarted = () => {
    if (user) {
      router.push("/dashboard")
    } else {
      router.push("/login")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header/Navigation */}
      <header className="border-b bg-white/80 backdrop-blur-md dark:bg-gray-900/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 font-bold text-xl">
              <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
                <Code className="size-4" />
              </div>
              <span>Dashboard Thera</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Funcionalidades
              </a>
              <a href="#solutions" className="text-muted-foreground hover:text-foreground transition-colors">
                Soluções
              </a>
              <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
                Sobre
              </a>
            </nav>
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={() => router.push("/login")}>
                Entrar
              </Button>
              <Button onClick={handleGetStarted}>
                Começar Agora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              <Star className="w-3 h-3 mr-1" />
              Plataforma completa de gestão
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Gerencie seus projetos com{" "}
              <span className="text-primary">excelência</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Dashboard inteligente para software houses e equipes de desenvolvimento. 
              Controle projetos, tarefas, equipes e finanças em uma plataforma integrada.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={handleGetStarted}>
                <Rocket className="mr-2 h-4 w-4" />
                Começar Gratuitamente
              </Button>
              <Button variant="outline" size="lg">
                <Globe className="mr-2 h-4 w-4" />
                Ver Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Tudo que você precisa</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Funcionalidades pensadas para otimizar o workflow da sua equipe
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>Dashboard Intuitivo</CardTitle>
                <CardDescription>
                  Visualize métricas, progresso e indicadores em tempo real com interface clara e responsiva
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="bg-green-100 dark:bg-green-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>Gestão de Tarefas</CardTitle>
                <CardDescription>
                  Kanban, Gantt, backlog e sprints. Acompanhe o desenvolvimento com ferramentas visuais
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="bg-purple-100 dark:bg-purple-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>Gestão de Equipes</CardTitle>
                <CardDescription>
                  Organize membros, roles, permissões e alocação por projeto de forma inteligente
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="bg-orange-100 dark:bg-orange-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle>Segurança Avançada</CardTitle>
                <CardDescription>
                  Autenticação robusta, controle de acesso e proteção de dados empresariais
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="bg-red-100 dark:bg-red-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <CardTitle>Performance Otimizada</CardTitle>
                <CardDescription>
                  Interface rápida, responsiva e otimizada para produtividade máxima
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="bg-cyan-100 dark:bg-cyan-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                </div>
                <CardTitle>Inteligência Integrada</CardTitle>
                <CardDescription>
                  Relatórios automatizados, insights e analytics para tomada de decisão
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Para software houses modernas</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Construído especificamente para atender as necessidades de empresas de desenvolvimento, 
                com foco em produtividade, qualidade e crescimento sustentável.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Gestão completa de projetos</h3>
                    <p className="text-muted-foreground text-sm">
                      Do briefing à entrega, acompanhe cada etapa com visibilidade total
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Comunicação centralizada</h3>
                    <p className="text-muted-foreground text-sm">
                      Chat, emails, notificações e área do cliente em um só lugar
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Controle financeiro integrado</h3>
                    <p className="text-muted-foreground text-sm">
                      Orçamentos, faturamento, pagamentos e relatórios automatizados
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:pl-8">
              <Card className="border-0 shadow-2xl">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Smartphone className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Interface Responsiva</h3>
                    <p className="text-muted-foreground">
                      Acesse de qualquer dispositivo, a qualquer hora, 
                      com a mesma experiência fluida e profissional.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para transformar sua gestão?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a centenas de software houses que já otimizaram seus processos conosco
          </p>
          <Button size="lg" variant="secondary" onClick={handleGetStarted}>
            <Rocket className="mr-2 h-4 w-4" />
            Começar Agora - É Grátis
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 font-bold text-xl mb-4">
              <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
                <Code className="size-4" />
              </div>
              <span>Dashboard Thera</span>
            </div>
            <p className="text-gray-400">
              Plataforma completa para gestão de software houses
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
