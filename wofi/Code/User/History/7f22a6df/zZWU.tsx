import ProjectRequirements from "@/components/projects/ProjectRequirements"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface RequirementsPageProps {
  params: {
    projectId: string
  }
}

export default function RequirementsPage({ params }: RequirementsPageProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Link href={`/dashboard/projects/${params.projectId}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Projeto
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Requisitos - Projeto {params.projectId}</h1>
          <p className="text-muted-foreground">Documentação e especificações do projeto</p>
        </div>
      </div>
      <ProjectRequirements />
    </div>
  )
}
