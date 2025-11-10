"use client";

import { useState } from "react";
import {
  PlusCircle,
  Users,
  Mail,
  Phone,
  MoreVertical,
  Search,
  Filter,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageHeader } from "@/components/layout/PageHeader";
import { useUsers } from "@/hooks/useUsers";
import { LoadingSpinner } from '@/components/custom/loading'
import { User } from "@/types";

const ActionDropdown = ({ user }: { user: User }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon">
        <MoreVertical className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem>Ver Perfil</DropdownMenuItem>
      <DropdownMenuItem>Editar</DropdownMenuItem>
      <DropdownMenuItem className="text-red-500">Remover</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const SearchAndFilter = () => (
  <div className="mb-6 flex items-center justify-between">
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        placeholder="Buscar membro..."
        className="w-full rounded-md border bg-background py-2 pl-10 pr-4"
      />
    </div>
    <Button variant="outline">
      <Filter className="mr-2 h-4 w-4" />
      Filtros
    </Button>
  </div>
);

export default function TeamPage() {
  const { users, loading, error } = useUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) return <LoadingSpinner />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Equipe"
        description="Gerencie os membros da sua equipe e suas permissões."
        actions={[
          {
            label: 'Adicionar Membro',
            onClick: () => setIsModalOpen(true),
            icon: PlusCircle,
          },
        ]}
      />

      <div className="flex-1 rounded-lg bg-card p-6 shadow-sm">
        <SearchAndFilter />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="relative flex flex-col items-center justify-center rounded-lg border bg-background p-6 text-center transition-all hover:shadow-lg"
            >
              <div className="absolute right-2 top-2">
                <ActionDropdown user={user} />
              </div>
              <Avatar className="mb-4 h-20 w-20">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.role}</p>
              <div className="mt-4 flex flex-col space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center">
                    <Phone className="mr-2 h-4 w-4" />
                    <span>{user.phone}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
