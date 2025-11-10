import Kanban from "@/components/projects/Kanban"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface KanbanPageProps {
  params: {
    projectId: string
  }
}

export default function KanbanPage({ params }: KanbanPageProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Link href={`/dashboard/projects/${params.projectId}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Projeto
          </Button>
        </Link>
     
      </div>
      <Kanban projectId={params.projectId} />
    </div>
  )
}
