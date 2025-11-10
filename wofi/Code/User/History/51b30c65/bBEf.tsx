"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import ProjectForm from "@/components/projects/ProjectForm"

type ProjectTemplate = {
  id: string
  name: string
  description: string
  estimatedDuration: string
  defaultTasks: string[]
}

const projectTemplates: ProjectTemplate[] = [
  {
    id: "website",
    name: "Website Institucional",
    description: "Projeto padrão para criação de website corporativo",
    estimatedDuration: "8 semanas",
    defaultTasks: [
      "Análise de requisitos",
      "Design de wireframes",
      "Desenvolvimento frontend",
      "Desenvolvimento backend",
      "Testes e deploy"
    ]
  },
  {
    id: "mobile",
    name: "Aplicativo Mobile",
    description: "Desenvolvimento de app nativo ou híbrido",
    estimatedDuration: "12 semanas",
    defaultTasks: [
      "Especificação técnica",
      "Design de interface",
      "Desenvolvimento iOS",
      "Desenvolvimento Android",
      "Testes e publicação"
    ]
  },
  {
    id: "dashboard",
    name: "Dashboard/Painel",
    description: "Painel administrativo ou de controle",
    estimatedDuration: "6 semanas",
    defaultTasks: [
      "Levantamento de métricas",
      "Design de dashboard",
      "Desenvolvimento",
      "Integração de dados",
      "Testes e homologação"
    ]
  },
  {
    id: "custom",
    name: "Projeto Personalizado",
    description: "Projeto único com requisitos específicos",
    estimatedDuration: "A definir",
    defaultTasks: []
  }
]

export default function NewProjectPage() {
  const router = useRouter()

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Novo Projeto</h1>
          <p className="text-muted-foreground">Crie um novo projeto e configure sua equipe</p>
        </div>
      </div>

      <ProjectForm mode="create" />
    </div>
  )
}
