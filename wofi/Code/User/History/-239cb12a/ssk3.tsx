"use client";

import { ChangeEvent, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Plus,
  Users,
  Calendar,
  BarChart3,
  MoreHorizontal,
  Search,
  FolderOpen,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { useProjects } from "@/hooks/useProjects";
import { useProjectFilters } from "./_hooks/useProjectFilters";

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: projects, loading, error, actions } = useProjects();
  const filteredProjects = useProjectFilters(projects, searchTerm, statusFilter);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "in-progress":
        return "bg-green-500";
      case "planning":
        return "bg-yellow-500";
      case "on-hold":
        return "bg-orange-500";
      case "completed":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo";
      case "in-progress":
        return "Em Andamento";
      case "planning":
        return "Planejamento";
      case "on-hold":
        return "Em espera";
      case "completed":
        return "Concluído";
      default:
        return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
      case "urgent":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "Urgente";
      case "high":
        return "Alta";
      case "medium":
        return "Média";
      case "low":
        return "Baixa";
      default:
        return priority;
    }
  };

  const SearchAndFilter = () => {
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      actions.load({})
    };

    return (
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar projetos..."
              value={searchTerm}
              onChange={handleInputChange}
              className="pl-8"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="planning">Planejamento</SelectItem>
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="on-hold">Em espera</SelectItem>
              <SelectItem value="completed">Concluído</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  };

  const ResultFilterProject = () => {
    if (error || loading) return null;

    if (filteredProjects.length === 0)
      return (
        <div className="text-center py-12">
          <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">
            Nenhum projeto encontrado
          </h3>
          <p className="mt-2 text-muted-foreground">
            {searchTerm || statusFilter !== "all"
              ? "Tente ajustar os filtros para encontrar o que procura."
              : "Comece criando seu primeiro projeto."}
          </p>
          {!searchTerm && statusFilter === "all" && (
            <Button className="mt-4" asChild>
              <Link href="/dashboard/projects/new">
                <Plus className="mr-2 h-4 w-4" />
                Criar Projeto
              </Link>
            </Button>
          )}
        </div>
      );
  };

  const ProjectGrid = () => {
    if (error) return null;

    if (!loading && filteredProjects.length > 0)
      return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="hover:shadow-md transition-shadow flex flex-col"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <CardDescription className="text-sm h-10">
                      {project.description}
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-2 h-2 rounded-full ${getStatusColor(
                          project.status
                        )}`}
                      />
                      <span className="text-sm font-medium">
                        {getStatusLabel(project.status)}
                      </span>
                    </div>
                    <Badge variant={getPriorityColor(project.priority)}>
                      {getPriorityLabel(project.priority)}
                    </Badge>
                  </div>

                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between text-sm">
                      <span>Progresso</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground mt-4">
                    <div className="flex items-center">
                      <Users className="mr-1 h-3 w-3" />
                      {project.teamMembers?.length || 0} membros
                    </div>
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      {project.endDate
                        ? new Date(project.endDate).toLocaleDateString("pt-BR")
                        : "N/A"}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Link
                    href={`/dashboard/projects/${project.id}`}
                    className="flex-1"
                  >
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
      );
  };

  const Error = () => {
    if (error)
      return (
        <div className="text-center py-12 text-red-500">
          <AlertCircle className="mx-auto h-12 w-12" />
          <h3 className="mt-4 text-lg font-semibold">
            Erro ao carregar projetos
          </h3>
          <p className="mt-2 text-sm">{error}</p>
        </div>
      );
  };

  const Loading = () => {
    if (loading)
      return (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      );
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Projetos"
        description="Gerencie todos os seus projetos em andamento"
        actions={[
          {
            label: "Novo Projeto",
            icon: Plus,
            href: "/dashboard/projects/new",
          },
        ]}
        badge={{
          label: `${projects?.length} projetos`,
          variant: "secondary",
        }}
      />

      {/* Filtros e Busca */}
      <SearchAndFilter />
      <Error />
      <Loading />

      {/* Grid de Projetos */}

      <ProjectGrid />
      <ResultFilterProject />
    </div>
  );
}
