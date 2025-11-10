"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Plus, Mail, Phone, Calendar, MapPin, Briefcase, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DataTable } from "@/components/ui/data-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMemberStore, Member } from "@/stores/memberStore"
import { FadeIn } from "@/components/ui/animations"
import { FeedbackButton } from "@/components/ui/feedback"
import { useToast } from "@/components/ui/feedback"

interface TableMember {
  id: string
  name: string
  email: string
  role: string
  department: string
  status: "active" | "inactive" | "vacation"
  avatar?: string
  phone?: string
  location: string
  joinDate: string
  projects: string[]
  skills: string[]
  rating?: number
}

const statusMap = {
  active: { label: "Ativo", color: "bg-green-500" },
  inactive: { label: "Inativo", color: "bg-gray-500" },
  vacation: { label: "Férias", color: "bg-blue-500" }
}

export default function AdvancedTeamPage() {
  const { members } = useMemberStore()
  const { addNotification } = useToast()
  const [loading, setLoading] = useState(false)

  // Transformar dados para o formato da tabela
  const tableData: TableMember[] = members.map(member => ({
    id: member.id,
    name: member.name,
    email: member.email,
    role: member.role,
    department: member.department || "Sem Departamento",
    status: member.status,
    avatar: member.avatar,
    phone: member.phone,
    location: member.location,
    joinDate: member.dateFrom,
    projects: member.projects,
    skills: member.skills,
    rating: Math.floor(Math.random() * 5) + 1 // Mock rating
  }))

  const columns: ColumnDef<TableMember>[] = [
    {
      accessorKey: "name",
      header: "Membro",
      cell: ({ row }) => {
        const member = row.original
        return (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={member.avatar} alt={member.name} />
              <AvatarFallback>
                {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{member.name}</div>
              <div className="text-sm text-muted-foreground">{member.email}</div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "role",
      header: "Cargo",
      cell: ({ row }) => (
        <Badge variant="secondary">{row.getValue("role")}</Badge>
      ),
    },
    {
      accessorKey: "department",
      header: "Departamento",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as keyof typeof statusMap
        return (
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${statusMap[status].color}`} />
            <span>{statusMap[status].label}</span>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return value === "all" || row.getValue(id) === value
      },
    },
    {
      accessorKey: "projects",
      header: "Projetos",
      cell: ({ row }) => {
        const projects = row.getValue("projects") as string[]
        return (
          <div className="flex items-center gap-1">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <span>{projects.length}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "skills",
      header: "Habilidades",
      cell: ({ row }) => {
        const skills = row.getValue("skills") as string[]
        return (
          <div className="flex items-center gap-1">
            {skills.slice(0, 2).map(skill => (
              <Badge key={skill} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {skills.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{skills.length - 2}
              </Badge>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "rating",
      header: "Avaliação",
      cell: ({ row }) => {
        const rating = row.getValue("rating") as number
        return (
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
              />
            ))}
          </div>
        )
      },
    },
    {
      accessorKey: "joinDate",
      header: "Admissão",
      cell: ({ row }) => {
        const date = new Date(row.getValue("joinDate"))
        return date.toLocaleDateString()
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const member = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => addNotification({
                type: "info",
                message: `E-mail enviado para ${member.name}`,
                duration: 3000
              })}>
                <Mail className="mr-2 h-4 w-4" />
                Enviar E-mail
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addNotification({
                type: "info", 
                message: `Ligando para ${member.name}...`,
                duration: 3000
              })}>
                <Phone className="mr-2 h-4 w-4" />
                Ligar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addNotification({
                type: "success",
                message: `Reunião agendada com ${member.name}`,
                duration: 3000
              })}>
                <Calendar className="mr-2 h-4 w-4" />
                Agendar Reunião
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Editar Perfil
              </DropdownMenuItem>
              <DropdownMenuItem>
                Ver Histórico
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Desativar Membro
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const handleRowClick = (member: TableMember) => {
    console.log("Clicou no membro:", member)
    // Aqui você pode navegar para a página de detalhes do membro
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Equipe Avançada</h1>
          <p className="text-muted-foreground">
            Gestão completa da equipe com filtros avançados e análises
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Relatório de Performance
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Membro
          </Button>
        </div>
      </div>

      {/* Estatísticas rápidas */}
      <div className="grid gap-4 md:grid-cols-5">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Total de Membros</h3>
            <div className="h-4 w-4 text-muted-foreground">👥</div>
          </div>
          <div className="text-2xl font-bold">{members.length}</div>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Membros Ativos</h3>
            <div className="h-4 w-4 rounded-full bg-green-500"></div>
          </div>
          <div className="text-2xl font-bold">
            {members.filter(m => m.status === 'active').length}
          </div>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Departamentos</h3>
            <div className="h-4 w-4 text-muted-foreground">🏢</div>
          </div>
          <div className="text-2xl font-bold">
            {new Set(members.map(m => m.department)).size}
          </div>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Projetos Ativos</h3>
            <div className="h-4 w-4 text-muted-foreground">📊</div>
          </div>
          <div className="text-2xl font-bold">
            {new Set(members.flatMap(m => m.projects)).size}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Avaliação Média</h3>
            <Star className="h-4 w-4 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold">4.2</div>
        </div>
      </div>

      {/* Tabela de Membros com funcionalidades avançadas */}
      <DataTable
        columns={columns}
        data={tableData}
        searchKey="name"
        searchPlaceholder="Buscar membros por nome, email ou cargo..."
        filters={[
          {
            key: "status",
            label: "Status",
            options: [
              { label: "Ativo", value: "active" },
              { label: "Inativo", value: "inactive" },
              { label: "Férias", value: "vacation" }
            ]
          },
          {
            key: "department",
            label: "Departamento",
            options: [
              { label: "Desenvolvimento", value: "Desenvolvimento" },
              { label: "Design", value: "Design" },
              { label: "Marketing", value: "Marketing" },
              { label: "Gestão", value: "Gestão" }
            ]
          },
          {
            key: "role",
            label: "Cargo",
            options: [
              { label: "Desenvolvedor", value: "Desenvolvedor Frontend" },
              { label: "Designer", value: "Designer UX/UI" },
              { label: "Gerente", value: "Gerente de Projetos" },
              { label: "Analista", value: "Analista de Sistemas" }
            ]
          }
        ]}
        enableRowSelection={true}
        enableColumnVisibility={true}
        enableExport={true}
        pageSize={15}
        onRowClick={handleRowClick}
        toolbar={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <MapPin className="mr-2 h-4 w-4" />
              Localização
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Aniversários
            </Button>
            <Button variant="outline" size="sm">
              <Star className="mr-2 h-4 w-4" />
              Performance
            </Button>
          </div>
        }
      />
    </div>
  )
}
