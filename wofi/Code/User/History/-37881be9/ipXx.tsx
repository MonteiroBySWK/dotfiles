"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Plus, 
  Users, 
  Calendar, 
  BarChart3, 
  Clock, 
  MoreHorizontal,
  Search,
  FolderOpen,
  Target,
  Zap
} from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { PageContainer } from "@/components/layout/page-container"

// Dados mockados dos projetos
const projects = [
  {
    id: "alpha",
    name: "Projeto Alpha",
    description: "Sistema de gestão empresarial completo",
    status: "in-progress",
    team: 8,
    progress: 65,
    deadline: "2025-12-15",
    priority: "high"
  },
  {
    id: "beta",
    name: "Website Redesign", 
    description: "Renovação completa do site institucional",
    status: "planning",
    team: 5,
    progress: 20,
    deadline: "2025-11-30",
    priority: "medium"
  },
  {
    id: "gamma",
    name: "Mobile App",
    description: "Aplicativo mobile para iOS e Android",
    status: "completed",
    team: 6,
    progress: 100,
    deadline: "2025-10-20",
    priority: "high"
  },
  {
    id: "delta",
    name: "E-commerce Platform",
    description: "Plataforma de vendas online",
    status: "in-progress",
    team: 12,
    progress: 45,
    deadline: "2026-02-28",
    priority: "critical"
  }
]

const statusColors = {
  "planning": "bg-yellow-100 text-yellow-800",
  "in-progress": "bg-blue-100 text-blue-800", 
  "completed": "bg-green-100 text-green-800",
  "paused": "bg-gray-100 text-gray-800"
}

const priorityColors = {
  "low": "bg-green-100 text-green-800",
  "medium": "bg-yellow-100 text-yellow-800",
  "high": "bg-orange-100 text-orange-800",
  "critical": "bg-red-100 text-red-800"
}

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projetos</h1>
          <p className="text-muted-foreground">
            Gerencie todos os projetos da sua empresa
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Projeto
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{project.name}</CardTitle>
                <Badge className={priorityColors[project.priority as keyof typeof priorityColors]}>
                  {project.priority}
                </Badge>
              </div>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <Badge className={statusColors[project.status as keyof typeof statusColors]}>
                  {project.status}
                </Badge>
                <span className="text-muted-foreground">
                  {project.progress}% completo
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Users className="mr-1 h-3 w-3" />
                  {project.team} membros
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  {new Date(project.deadline).toLocaleDateString('pt-BR')}
                </div>
              </div>

              <div className="flex space-x-2">
                <Link href={`/dashboard/projects/${project.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Ver Projeto
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
