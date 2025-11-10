"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
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
  X,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { useProjects } from "@/hooks/useProjects";
import { Project } from "@/types";

export default function ProjectsPage() {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 9;
  
  const debounceRef = useRef<number | null>(null);

  // Debounce do search
  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1); // Reset page ao buscar
    }, 400);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [searchInput]);

  // Prepara filtros para a API
  const filters = {
    search: debouncedSearch || undefined,
    page,
    pageSize,
  };

  const { data: projects, loading, error } = useProjects();

  const hasFilters = debouncedSearch !== "" || statusFilter !== "all";

  console.log(projects)

  // Se tiver filtro de status (client-side por enquanto, pode mover para API depois)
  const filteredProjects = projects?.filter((project: Project) => {
    if (statusFilter === "all") return true;
    return project.status === statusFilter;
  }) || [];

  const totalProjects = 0;
  const totalPages = Math.max(1, Math.ceil(totalProjects / pageSize));

  // Helpers
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
    const labels: Record<string, string> = {
      active: "Ativo",
      "in-progress": "Em Andamento",
      planning: "Planejamento",
      "on-hold": "Em espera",
      completed: "Concluído",
    };
    return labels[status] || status;
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
    const labels: Record<string, string> = {
      urgent: "Urgente",
      high: "Alta",
      medium: "Média",
      low: "Baixa",
    };
    return labels[priority] || priority;
  };

  const clearFilters = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setStatusFilter("all");
    setPage(1);
  };

  const SearchAndFilter = () => {
    return (
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar projetos..."
              value={searchInput}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSearchInput(e.target.value)
              }
              className="pl-8"
            />
          </div>
          {hasFilters && (
            <Button variant="ghost" onClick={clearFilters} title="Limpar filtros">
              <X className="h-4 w-4" />
            </Button>
          )}
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
              <SelectItem value="in-progress">Em andamento</SelectItem>
              <SelectItem value="on-hold">Em espera</SelectItem>
              <SelectItem value="completed">Concluído</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="space-y-6 p-6">
        <PageHeader
          title="Projetos"
          description="Gerencie todos os seus projetos em andamento"
        />
        <div className="text-center py-12 text-red-500">
          <AlertCircle className="mx-auto h-12 w-12" />
          <h3 className="mt-4 text-lg font-semibold">Erro ao carregar projetos</h3>
          <p className="mt-2 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <PageHeader
          title="Projetos"
          description="Gerencie todos os seus projetos em andamento"
        />
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

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
          label: `${totalProjects} projetos`,
          variant: "secondary",
        }}
      />

      <SearchAndFilter />

      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Nenhum projeto encontrado</h3>
          <p className="mt-2 text-muted-foreground">
            {hasFilters
              ? "Tente ajustar os filtros para encontrar o que procura."
              : "Comece criando seu primeiro projeto."}
          </p>
          {!hasFilters && (
            <Button className="mt-4" asChild>
              <Link href="/dashboard/projects/new">
                <Plus className="mr-2 h-4 w-4" />
                Criar Projeto
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <>
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

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Página {page} de {totalPages} • {totalProjects} projetos no total
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Anterior
                </Button>
                <div className="text-sm">
                  {page} / {totalPages}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}