"use client"

import { useState } from "react"
// TODO: Implementar gerenciamento de membros via API
// import { useUsers } from "@/hooks/useUsers"
// import { useProjects } from "@/hooks/useProjects"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  Plus, 
  Search, 
  Mail, 
  MapPin, 
  Calendar, 
  Github, 
  Linkedin,
  User,
  Users,
  Building2,
  Phone,
  Settings,
  MoreVertical
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { StatCard, StatsGrid } from "@/components/common"

export default function TeamPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Página em Construção</CardTitle>
          <CardDescription>
            Esta página está sendo refatorada para usar a nova arquitetura com hooks e API routes.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}

function TeamPageOld() {
  // TODO: Implementar com hooks
  const members: any[] = []
  const projects: any[] = []
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProject, setSelectedProject] = useState<string>("all")

  // Filtrar membros baseado na busca e projeto selecionado
  const filteredMembers = () => {
    return members
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800"
      case "inactive": return "bg-gray-100 text-gray-800"
      case "vacation": return "bg-yellow-100 text-yellow-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "Ativo"
      case "inactive": return "Inativo"
      case "vacation": return "Férias"
      default: return "Desconhecido"
    }
  }

  const getMemberProjectCount = (memberId: string) => {
    return 0 // TODO: Implementar
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Equipe</h1>
          <p className="text-muted-foreground">
            Gerencie os membros da sua empresa e suas atribuições
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Membro
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar membros por nome, email, função..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="px-3 py-2 border border-input bg-background rounded-md text-sm"
        >
          <option value="all">Todos os Projetos</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      {/* Estatísticas - Using new StatCard component with responsive grid */}
      <StatsGrid>
        <StatCard
          title="Total de Membros"
          value={members.length.toString()}
          description={`${members.filter(m => m.status === "active").length} ativos`}
          icon={Users}
          iconColor="text-blue-600"
        />
        <StatCard
          title="Departamentos"
          value={new Set(members.map(m => m.department).filter(Boolean)).size.toString()}
          description="Diferentes áreas"
          icon={Building2}
          iconColor="text-green-600"
        />
        <StatCard
          title="Projetos Ativos"
          value={projects.length.toString()}
          description="Com membros atribuídos"
          icon={Calendar}
          iconColor="text-purple-600"
        />
      </StatsGrid>

      {/* Lista de Membros */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredMembers().map((member) => (
          <Card key={member.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>
                      {member.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {member.role}
                    </CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Settings className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Mail className="h-4 w-4 mr-2" />
                      Enviar Email
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Status */}
              <Badge className={getStatusColor(member.status)}>
                {getStatusText(member.status)}
              </Badge>

              {/* Informações de Contato */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  <span className="truncate">{member.email}</span>
                </div>
                {member.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    <span>{member.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{member.location}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>Desde {new Date(member.dateFrom).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>

              {/* Tags/Skills */}
              {member.tags.length > 0 && (
                <div>
                  <div className="flex flex-wrap gap-1">
                    {member.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {member.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{member.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Projetos */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {getMemberProjectCount(member.id)} projetos
                </span>
                <div className="flex gap-2">
                  {member.github && (
                    <a 
                      href={member.github.startsWith('http') ? member.github : `https://${member.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  )}
                  {member.linkedin && (
                    <a 
                      href={member.linkedin.startsWith('http') ? member.linkedin : `https://${member.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>

              <Separator />

              {/* Ações */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Ver Perfil
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Projetos
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Estado vazio */}
      {filteredMembers().length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Nenhum membro encontrado
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchQuery 
                ? "Tente ajustar os filtros de busca." 
                : "Comece adicionando membros à sua equipe."
              }
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeiro Membro
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
