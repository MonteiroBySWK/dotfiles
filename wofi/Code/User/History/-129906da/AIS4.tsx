"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Users,
  Crown,
  Shield,
  User,
  Plus,
  Search,
  Settings,
  Mail,
  Phone
} from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { PageContainer } from "@/components/layout/page-container"

// Dados mockados de papéis/funções da equipe
const teamRoles = [
  {
    id: "1",
    name: "Product Manager",
    department: "Produto",
    level: "senior",
    description: "Responsável pela estratégia e roadmap do produto",
    members: [
      { id: "1", name: "Ana Silva", email: "ana@empresa.com", avatar: "/avatars/ana.jpg", status: "active" }
    ],
    permissions: ["product_strategy", "roadmap_management", "user_research"],
    responsibilities: [
      "Definir estratégia do produto",
      "Gerenciar roadmap",
      "Conduzir pesquisas com usuários",
      "Alinhar com stakeholders"
    ]
  },
  {
    id: "2",
    name: "Tech Lead",
    department: "Desenvolvimento",
    level: "senior",
    description: "Líder técnico da equipe de desenvolvimento",
    members: [
      { id: "2", name: "Carlos Santos", email: "carlos@empresa.com", avatar: "/avatars/carlos.jpg", status: "active" }
    ],
    permissions: ["code_review", "architecture_decisions", "team_mentoring"],
    responsibilities: [
      "Liderar decisões técnicas",
      "Revisar código",
      "Mentorar desenvolvedores",
      "Arquitetura de sistemas"
    ]
  },
  {
    id: "3",
    name: "Desenvolvedor Frontend",
    department: "Desenvolvimento",
    level: "pleno",
    description: "Desenvolvimento de interfaces e experiência do usuário",
    members: [
      { id: "3", name: "Maria Oliveira", email: "maria@empresa.com", avatar: "/avatars/maria.jpg", status: "active" },
      { id: "4", name: "João Costa", email: "joao@empresa.com", avatar: "/avatars/joao.jpg", status: "active" }
    ],
    permissions: ["frontend_development", "ui_implementation"],
    responsibilities: [
      "Desenvolver interfaces",
      "Implementar designs",
      "Otimizar performance",
      "Testes frontend"
    ]
  },
  {
    id: "4",
    name: "Desenvolvedor Backend",
    department: "Desenvolvimento",
    level: "pleno",
    description: "Desenvolvimento de APIs e sistemas backend",
    members: [
      { id: "5", name: "Pedro Lima", email: "pedro@empresa.com", avatar: "/avatars/pedro.jpg", status: "active" }
    ],
    permissions: ["backend_development", "database_management", "api_design"],
    responsibilities: [
      "Desenvolver APIs",
      "Gerenciar banco de dados",
      "Implementar integrações",
      "Monitoramento de sistemas"
    ]
  },
  {
    id: "5",
    name: "Designer UX/UI",
    department: "Design",
    level: "pleno",
    description: "Design de experiência e interface do usuário",
    members: [
      { id: "6", name: "Carla Design", email: "carla@empresa.com", avatar: "/avatars/carla.jpg", status: "active" }
    ],
    permissions: ["design_system", "user_experience", "prototyping"],
    responsibilities: [
      "Criar designs de interface",
      "Pesquisa de usuário",
      "Prototipagem",
      "Design system"
    ]
  },
  {
    id: "6",
    name: "QA Engineer",
    department: "Qualidade",
    level: "junior",
    description: "Garantia de qualidade e testes",
    members: [
      { id: "7", name: "Lucas Tester", email: "lucas@empresa.com", avatar: "/avatars/lucas.jpg", status: "active" }
    ],
    permissions: ["test_automation", "quality_assurance"],
    responsibilities: [
      "Criar planos de teste",
      "Executar testes manuais",
      "Automatizar testes",
      "Reportar bugs"
    ]
  }
]

export default function TeamRolesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [levelFilter, setLevelFilter] = useState("all")

  const filteredRoles = teamRoles.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         role.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         role.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = departmentFilter === "all" || role.department === departmentFilter
    const matchesLevel = levelFilter === "all" || role.level === levelFilter
    
    return matchesSearch && matchesDepartment && matchesLevel
  })

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "senior":
        return Crown
      case "pleno":
        return Shield
      case "junior":
        return User
      default:
        return User
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "senior":
        return "default"
      case "pleno":
        return "secondary"
      case "junior":
        return "outline"
      default:
        return "outline"
    }
  }

  const getLevelLabel = (level: string) => {
    switch (level) {
      case "senior":
        return "Sênior"
      case "pleno":
        return "Pleno"
      case "junior":
        return "Júnior"
      default:
        return level
    }
  }

  const totalMembers = teamRoles.reduce((total, role) => total + role.members.length, 0)

  return (
    <PageContainer>
      <PageHeader
        title="Papéis da Equipe"
        description="Gerencie funções, responsabilidades e permissões da equipe"
        actions={[
          {
            label: "Novo Papel",
            icon: Plus,
            onClick: () => console.log("Criar novo papel")
          }
        ]}
        badge={{
          label: `${totalMembers} membros`,
          variant: "secondary"
        }}
      />

      {/* Filtros e Busca */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar papéis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Departamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Produto">Produto</SelectItem>
              <SelectItem value="Desenvolvimento">Desenvolvimento</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
              <SelectItem value="Qualidade">Qualidade</SelectItem>
            </SelectContent>
          </Select>

          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Nível" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="senior">Sênior</SelectItem>
              <SelectItem value="pleno">Pleno</SelectItem>
              <SelectItem value="junior">Júnior</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lista de Papéis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRoles.map((role) => {
          const LevelIcon = getLevelIcon(role.level)
          
          return (
            <Card key={role.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <LevelIcon className="h-5 w-5 text-muted-foreground" />
                      <CardTitle className="text-lg">{role.name}</CardTitle>
                      <Badge variant={getLevelColor(role.level)}>
                        {getLevelLabel(role.level)}
                      </Badge>
                    </div>
                    <CardDescription>
                      {role.description}
                    </CardDescription>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {role.department} • {role.members.length} membro{role.members.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    <Settings className="h-3 w-3 mr-1" />
                    Editar
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Membros */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Membros</h4>
                  <div className="space-y-2">
                    {role.members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium">{member.name}</div>
                            <div className="text-xs text-muted-foreground">{member.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm">
                            <Mail className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Phone className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Responsabilidades */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Principais Responsabilidades</h4>
                  <div className="space-y-1">
                    {role.responsibilities.slice(0, 3).map((responsibility, index) => (
                      <div key={index} className="text-sm text-muted-foreground flex items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mr-2" />
                        {responsibility}
                      </div>
                    ))}
                    {role.responsibilities.length > 3 && (
                      <div className="text-xs text-muted-foreground mt-1">
                        +{role.responsibilities.length - 3} responsabilidades adicionais
                      </div>
                    )}
                  </div>
                </div>

                {/* Permissões */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Permissões</h4>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.map((permission, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {permission.replace(/_/g, ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredRoles.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Nenhum papel encontrado</h3>
          <p className="mt-2 text-muted-foreground">
            {searchTerm || departmentFilter !== "all" || levelFilter !== "all"
              ? "Tente ajustar os filtros para encontrar o que procura."
              : "Comece criando o primeiro papel da equipe."}
          </p>
        </div>
      )}
    </PageContainer>
  )
}
