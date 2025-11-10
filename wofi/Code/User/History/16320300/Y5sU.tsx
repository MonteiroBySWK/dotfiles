import { 
  Users, 
  UserPlus, 
  MapPin, 
  Calendar, 
  Code,
  Coffee,
  TrendingUp,
  Mail,
  Phone,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Avatar } from "../ui/avatar";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

// Dados mock dos funcionários
const employees = [
  {
    id: 1,
    name: "Ana Silva",
    role: "Senior Frontend Developer",
    department: "Desenvolvimento",
    level: "Sênior",
    email: "ana.silva@empresa.com",
    phone: "(11) 99999-0001",
    joinDate: "2023-01-15",
    location: "São Paulo, SP",
    projectsActive: 3,
    projectsCompleted: 12,
    performance: 95,
    skills: ["React", "TypeScript", "Next.js"],
    avatar: "AS",
    status: "Ativo"
  },
  {
    id: 2,
    name: "Bruno Santos",
    role: "Backend Developer",
    department: "Desenvolvimento",
    level: "Pleno",
    email: "bruno.santos@empresa.com",
    phone: "(11) 99999-0002",
    joinDate: "2023-03-20",
    location: "Rio de Janeiro, RJ",
    projectsActive: 2,
    projectsCompleted: 8,
    performance: 88,
    skills: ["Node.js", "Python", "PostgreSQL"],
    avatar: "BS",
    status: "Ativo"
  },
  {
    id: 3,
    name: "Carla Oliveira",
    role: "UX/UI Designer",
    department: "Design",
    level: "Sênior",
    email: "carla.oliveira@empresa.com",
    phone: "(11) 99999-0003",
    joinDate: "2022-11-10",
    location: "Belo Horizonte, MG",
    projectsActive: 4,
    projectsCompleted: 15,
    performance: 92,
    skills: ["Figma", "Adobe XD", "Design System"],
    avatar: "CO",
    status: "Ativo"
  },
  {
    id: 4,
    name: "Diego Costa",
    role: "DevOps Engineer",
    department: "Infraestrutura",
    level: "Pleno",
    email: "diego.costa@empresa.com",
    phone: "(11) 99999-0004",
    joinDate: "2023-05-01",
    location: "Porto Alegre, RS",
    projectsActive: 1,
    projectsCompleted: 6,
    performance: 90,
    skills: ["AWS", "Docker", "Kubernetes"],
    avatar: "DC",
    status: "Ativo"
  },
  {
    id: 5,
    name: "Elena Rodriguez",
    role: "Product Manager",
    department: "Produto",
    level: "Sênior",
    email: "elena.rodriguez@empresa.com",
    phone: "(11) 99999-0005",
    joinDate: "2022-08-15",
    location: "São Paulo, SP",
    projectsActive: 5,
    projectsCompleted: 20,
    performance: 96,
    skills: ["Scrum", "Analytics", "Roadmap"],
    avatar: "ER",
    status: "Férias"
  },
  {
    id: 6,
    name: "Felipe Lima",
    role: "Junior Frontend Developer",
    department: "Desenvolvimento",
    level: "Júnior",
    email: "felipe.lima@empresa.com",
    phone: "(11) 99999-0006",
    joinDate: "2024-01-10",
    location: "São Paulo, SP",
    projectsActive: 2,
    projectsCompleted: 3,
    performance: 82,
    skills: ["React", "JavaScript", "CSS"],
    avatar: "FL",
    status: "Ativo"
  }
];

const getPerformanceColor = (performance: number) => {
  if (performance >= 90) return "text-green-600";
  if (performance >= 80) return "text-yellow-600";
  return "text-red-600";
};

const getLevelColor = (level: string) => {
  switch (level) {
    case "Sênior": return "bg-purple-100 text-purple-800";
    case "Pleno": return "bg-blue-100 text-blue-800";
    case "Júnior": return "bg-green-100 text-green-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Ativo": return "bg-green-100 text-green-800";
    case "Férias": return "bg-yellow-100 text-yellow-800";
    case "Licença": return "bg-orange-100 text-orange-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

export default function MemberDashboard() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Equipe</h1>
          <p className="text-muted-foreground">
            Gerencie e acompanhe informações da sua equipe
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Adicionar Funcionário
        </Button>
      </div>

      {/* Métricas da Equipe */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Funcionários
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 novos este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Performance Média
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(employees.reduce((acc, emp) => acc + emp.performance, 0) / employees.length)}%
            </div>
            <p className="text-xs text-muted-foreground">
              +3% desde o último mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Projetos Ativos
            </CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {employees.reduce((acc, emp) => acc + emp.projectsActive, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Distribuídos entre a equipe
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Funcionários Ativos
            </CardTitle>
            <Coffee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {employees.filter(emp => emp.status === "Ativo").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {employees.filter(emp => emp.status !== "Ativo").length} em licença/férias
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Busca */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar funcionários..." 
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filtros
        </Button>
      </div>

      {/* Lista de Funcionários */}
      <div className="grid gap-4">
        {employees.map((employee) => (
          <Card key={employee.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                      {employee.avatar}
                    </div>
                  </Avatar>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{employee.name}</h3>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getLevelColor(employee.level)}`}>
                        {employee.level}
                      </span>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(employee.status)}`}>
                        {employee.status}
                      </span>
                    </div>
                    
                    <p className="text-muted-foreground">{employee.role}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {employee.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {employee.phone}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {employee.location}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Na empresa desde {new Date(employee.joinDate).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {employee.skills.map((skill, index) => (
                        <span key={index} className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="text-right space-y-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Performance: </span>
                      <span className={`font-semibold ${getPerformanceColor(employee.performance)}`}>
                        {employee.performance}%
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Projetos Ativos: </span>
                      <span className="font-semibold">{employee.projectsActive}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Projetos Concluídos: </span>
                      <span className="font-semibold">{employee.projectsCompleted}</span>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="flex items-center gap-2">
                        <Edit className="h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                        <Trash2 className="h-4 w-4" />
                        Remover
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}