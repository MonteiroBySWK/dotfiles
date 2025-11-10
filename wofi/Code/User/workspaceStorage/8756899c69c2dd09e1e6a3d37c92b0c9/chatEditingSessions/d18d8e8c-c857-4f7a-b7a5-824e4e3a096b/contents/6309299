import Gantt from "@/components/projects/Gantt"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface GanttPageProps {
  params: {
    projectId: string
  }
}

export default function GanttPage({ params }: GanttPageProps) {
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
          <h1 className="text-2xl font-bold">Gantt - Projeto {params.projectId}</h1>
          <p className="text-muted-foreground">Timeline e cronograma do projeto</p>
        </div>
      </div>
      <Gantt />
    </div>
  )
}
