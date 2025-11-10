"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import ProjectForm from "@/components/projects/ProjectForm"
import { useProjects } from "@/hooks/useProjects"
import type { Project } from "@/types"

export default function NewProjectPage() {
  const router = useRouter()
  const { create: createProject } = useProjects()

  const handleCreateProject = async (projectData: Partial<Project>) => {
    try {
      // Adapta o payload do form para o formato esperado pela API
      const payload = {
        name: projectData.name || "",
        description: projectData.description || "",
        cost: typeof projectData.budget === 'object' 
          ? projectData.budget?.estimated || 0 
          : Number(projectData.budget) || 0,
        deadline: projectData.endDate 
          ? new Date(projectData.endDate).toISOString() 
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        
        // IDs obrigatórios - você pode ajustar conforme sua lógica
        backlogId: "default-backlog", // TODO: Implementar seleção de backlog
        clientId: projectData.clientId || "default-client", // TODO: Implementar seleção de cliente
        planId: "default-plan", // TODO: Implementar seleção de plano
        
        // Arrays de IDs
        scopeIds: [],
        sprintIds: [],
        requirementIds: [],
        memberIds: projectData.teamMembers?.map(m => 
          typeof m === 'object' && 'userId' in m ? m.userId : String(m)
        ) || [],
      }

      const newProject = await createProject(payload)
      
      toast.success("Projeto criado com sucesso!")
      router.push(`/dashboard/projects/${newProject.id}`)
      
      return newProject
    } catch (error) {
      console.error("Erro ao criar projeto:", error)
      toast.error("Falha ao criar projeto. Tente novamente.")
      throw error
    }
  }

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

      <ProjectForm 
        mode="create" 
        onSubmit={handleCreateProject}
      />
    </div>
  )
}
