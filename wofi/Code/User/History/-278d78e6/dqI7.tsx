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
  Calendar,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Briefcase,
  Plus,
  Search,
  Eye,
  UserCheck,
  UserX,
  Clock
} from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { PageContainer } from "@/components/layout/page-container"

// Dados mockados de recrutamento
const recruitmentData = [
  {
    id: "1",
    position: "Desenvolvedor Frontend Sênior",
    department: "Desenvolvimento",
    type: "full-time",
    location: "São Paulo, SP",
    salary: "R$ 12.000 - 15.000",
    status: "open",
    postedDate: "2024-09-15",
    applications: 42,
    candidates: [
      {
        id: "1-1",
        name: "Lucas Silva",
        email: "lucas.silva@email.com",
        phone: "(11) 99999-1111",
        experience: "5 anos",
        education: "Ciência da Computação - USP",
        status: "interview_scheduled",
        appliedDate: "2024-09-18",
        avatar: "/avatars/lucas.jpg",
        skills: ["React", "TypeScript", "Next.js", "Node.js"],
        stage: "technical_interview"
      },
      {
        id: "1-2",
        name: "Ana Costa",
        email: "ana.costa@email.com",
        phone: "(11) 99999-2222",
        experience: "6 anos",
        education: "Engenharia de Software - FIAP",
        status: "under_review",
        appliedDate: "2024-09-17",
        avatar: "/avatars/ana-costa.jpg",
        skills: ["Vue.js", "JavaScript", "CSS", "Figma"],
        stage: "resume_review"
      },
      {
        id: "1-3",
        name: "Pedro Santos",
        email: "pedro.santos@email.com",
        phone: "(11) 99999-3333",
        experience: "4 anos",
        education: "Sistema de Informação - PUC",
        status: "approved",
        appliedDate: "2024-09-16",
        avatar: "/avatars/pedro-santos.jpg",
        skills: ["React", "Angular", "Python", "AWS"],
        stage: "offer_sent"
      }
    ]
  },
  {
    id: "2",
    position: "Product Manager",
    department: "Produto",
    type: "full-time",
    location: "Remote",
    salary: "R$ 15.000 - 18.000",
    status: "open",
    postedDate: "2024-09-10",
    applications: 28,
    candidates: [
      {
        id: "2-1",
        name: "Carla Mendes",
        email: "carla.mendes@email.com",
        phone: "(11) 99999-4444",
        experience: "7 anos",
        education: "Administração - FGV",
        status: "interview_scheduled",
        appliedDate: "2024-09-12",
        avatar: "/avatars/carla.jpg",
        skills: ["Product Strategy", "Analytics", "Scrum", "SQL"],
        stage: "final_interview"
      }
    ]
  },
  {
    id: "3",
    position: "Designer UX/UI",
    department: "Design",
    type: "full-time",
    location: "São Paulo, SP",
    salary: "R$ 8.000 - 12.000",
    status: "paused",
    postedDate: "2024-09-05",
    applications: 35,
    candidates: []
  },
  {
    id: "4",
    position: "DevOps Engineer",
    department: "Infraestrutura",
    type: "full-time",
    location: "Remote",
    salary: "R$ 14.000 - 17.000",
    status: "closed",
    postedDate: "2024-08-20",
    applications: 56,
    candidates: []
  }
]

export default function RecruitmentPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredPositions = recruitmentData.filter(position => {
    const matchesSearch = position.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         position.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = departmentFilter === "all" || position.department === departmentFilter
    const matchesStatus = statusFilter === "all" || position.status === statusFilter
    const matchesType = typeFilter === "all" || position.type === typeFilter
    
    return matchesSearch && matchesDepartment && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "default"
      case "paused":
        return "secondary"
      case "closed":
        return "outline"
      default:
        return "outline"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "open":
        return "Aberta"
      case "paused":
        return "Pausada"
      case "closed":
        return "Fechada"
      default:
        return status
    }
  }

  const getCandidateStatusColor = (status: string) => {
    switch (status) {
      case "under_review":
        return "secondary"
      case "interview_scheduled":
        return "default"
      case "approved":
        return "default"
      case "rejected":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getCandidateStatusLabel = (status: string) => {
    switch (status) {
      case "under_review":
        return "Em análise"
      case "interview_scheduled":
        return "Entrevista agendada"
      case "approved":
        return "Aprovado"
      case "rejected":
        return "Rejeitado"
      default:
        return status
    }
  }

  const getStageLabel = (stage: string) => {
    switch (stage) {
      case "resume_review":
        return "Análise de currículo"
      case "phone_screening":
        return "Triagem telefônica"
      case "technical_interview":
        return "Entrevista técnica"
      case "final_interview":
        return "Entrevista final"
      case "offer_sent":
        return "Proposta enviada"
      default:
        return stage
    }
  }

  const totalApplications = recruitmentData.reduce((total, position) => total + position.applications, 0)
  const openPositions = recruitmentData.filter(p => p.status === "open").length

  return (
    <PageContainer>
      <PageHeader
        title="Recrutamento"
        description="Gerencie vagas abertas e processos de contratação"
        actions={[
          {
            label: "Nova Vaga",
            icon: Plus,
            onClick: () => console.log("Criar nova vaga")
          }
        ]}
        badge={{
          label: `${openPositions} vagas abertas`,
          variant: "secondary"
        }}
      />

      {/* Métricas Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">Vagas Abertas</div>
            </div>
            <div className="text-2xl font-bold">{openPositions}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">Candidaturas</div>
            </div>
            <div className="text-2xl font-bold">{totalApplications}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-4 w-4 text-green-600" />
              <div className="text-sm text-muted-foreground">Em Processo</div>
            </div>
            <div className="text-2xl font-bold">
              {recruitmentData.reduce((count, pos) => 
                count + pos.candidates.filter(c => c.status !== "rejected").length, 0
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <div className="text-sm text-muted-foreground">Entrevistas</div>
            </div>
            <div className="text-2xl font-bold">
              {recruitmentData.reduce((count, pos) => 
                count + pos.candidates.filter(c => c.status === "interview_scheduled").length, 0
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Busca */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar vagas..."
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
              <SelectItem value="Desenvolvimento">Desenvolvimento</SelectItem>
              <SelectItem value="Produto">Produto</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
              <SelectItem value="Infraestrutura">Infraestrutura</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="open">Abertas</SelectItem>
              <SelectItem value="paused">Pausadas</SelectItem>
              <SelectItem value="closed">Fechadas</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="full-time">CLT</SelectItem>
              <SelectItem value="part-time">Meio período</SelectItem>
              <SelectItem value="contract">Contrato</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lista de Vagas */}
      <div className="space-y-6">
        {filteredPositions.map((position) => (
          <Card key={position.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-xl">{position.position}</CardTitle>
                    <Badge variant={getStatusColor(position.status)}>
                      {getStatusLabel(position.status)}
                    </Badge>
                  </div>
                  <CardDescription className="text-base mb-3">
                    {position.department} • {position.salary}
                  </CardDescription>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {position.location}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(position.postedDate).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {position.applications} candidaturas
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-3 w-3 mr-1" />
                    Ver Vaga
                  </Button>
                  <Button size="sm">
                    Editar
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            {position.candidates.length > 0 && (
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Candidatos em Processo</h4>
                    <span className="text-sm text-muted-foreground">
                      {position.candidates.length} candidato{position.candidates.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    {position.candidates.map((candidate) => (
                      <div key={candidate.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center space-x-4 flex-1">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={candidate.avatar} />
                            <AvatarFallback>
                              {candidate.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="font-medium">{candidate.name}</div>
                              <Badge variant={getCandidateStatusColor(candidate.status)}>
                                {getCandidateStatusLabel(candidate.status)}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {getStageLabel(candidate.stage)} • {candidate.experience} de experiência
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <div className="flex items-center">
                                <Mail className="h-3 w-3 mr-1" />
                                {candidate.email}
                              </div>
                              <div className="flex items-center">
                                <GraduationCap className="h-3 w-3 mr-1" />
                                {candidate.education}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3 mr-1" />
                            Perfil
                          </Button>
                          {candidate.status === "under_review" && (
                            <>
                              <Button variant="outline" size="sm">
                                <UserCheck className="h-3 w-3 mr-1" />
                                Aprovar
                              </Button>
                              <Button variant="outline" size="sm">
                                <UserX className="h-3 w-3 mr-1" />
                                Rejeitar
                              </Button>
                            </>
                          )}
                          {candidate.status === "interview_scheduled" && (
                            <Button size="sm">
                              <Calendar className="h-3 w-3 mr-1" />
                              Entrevista
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {filteredPositions.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Nenhuma vaga encontrada</h3>
          <p className="mt-2 text-muted-foreground">
            {searchTerm || departmentFilter !== "all" || statusFilter !== "all"
              ? "Tente ajustar os filtros para encontrar o que procura."
              : "Comece criando a primeira vaga de emprego."}
          </p>
        </div>
      )}
    </PageContainer>
  )
}
