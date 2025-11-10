"use client"

import { useState } from "react"
import { Plus, Search, Filter, MoreVertical, Building2, Mail, Phone, Globe, MapPin, Eye, Pencil, Trash2, Users, FolderOpen, DollarSign, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StatCard } from "@/components/common/stat-card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useClients } from "@/hooks/useClients"
import { Client } from "@/types"
import { PageHeader } from "@/components/layout/PageHeader"

const statusMap = {
  active: { label: "Ativo", color: "bg-green-500" },
  prospect: { label: "Potencial", color: "bg-yellow-500" },
  inactive: { label: "Inativo", color: "bg-gray-500" }
}

export default function ClientsPage() {
  const { clients, loading, error, createClient, updateClient, deleteClient } = useClients()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null)
  
  const [formData, setFormData] = useState<Omit<Client, 'id' | 'createdAt' | 'updatedAt'>>({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "prospect",
    notes: "",
    address: { street: "", city: "", state: "", zipCode: "", country: "" },
    contacts: [],
    projects: [],
  })

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      status: "prospect",
      notes: "",
      address: { street: "", city: "", state: "", zipCode: "", country: "" },
      contacts: [],
      projects: [],
    })
  }

  const handleCreateClient = async () => {
    try {
      await createClient(formData)
      setIsCreateDialogOpen(false)
      resetForm()
    } catch (e) {
      console.error("Failed to create client:", e)
    }
  }

  const handleEditClient = async () => {
    if (!selectedClient) return
    
    try {
      await updateClient(selectedClient.id, formData)
      setIsEditDialogOpen(false)
      setSelectedClient(null)
      resetForm()
    } catch (e) {
      console.error("Failed to update client:", e)
    }
  }

  const handleDeleteClient = async () => {
    if (!clientToDelete) return
    
    try {
      await deleteClient(clientToDelete.id)
      setIsDeleteDialogOpen(false)
      setClientToDelete(null)
    } catch (e) {
      console.error("Failed to delete client:", e)
    }
  }

  const openEditDialog = (client: Client) => {
    setSelectedClient(client)
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone || '',
      company: client.company || '',
      status: client.status,
      notes: client.notes || '',
      address: client.address || {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
      contacts: client.contacts || [],
      projects: client.projects || [],
    })
    setIsEditDialogOpen(true)
  }

  const openViewDialog = (client: Client) => {
    setSelectedClient(client)
    setIsViewDialogOpen(true)
  }

  const openDeleteDialog = (client: Client) => {
    setClientToDelete(client)
    setIsDeleteDialogOpen(true)
  }

  const filteredClients = clients.filter((client) => {
    const primaryContact = client.contacts?.find((c) => c.isPrimary)
    const searchLower = searchQuery.toLowerCase()

    const matchesSearch =
      client.name.toLowerCase().includes(searchLower) ||
      client.email.toLowerCase().includes(searchLower) ||
      (primaryContact &&
        primaryContact.name.toLowerCase().includes(searchLower))

    const matchesStatus = statusFilter === 'all' || client.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="flex-1 space-y-6 p-6">
      <PageHeader
        title="Clientes"
        description="Gerencie seus clientes e relacionamentos comerciais"
        actions={[{ label: "Novo Cliente", icon: Plus, onClick: () => setIsCreateDialogOpen(true) }]}
      />

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="potential">Potenciais</SelectItem>
            <SelectItem value="inactive">Inativos</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Clientes"
          value={clients.length.toString()}
          icon={Building2}
          iconColor="text-blue-600"
        />
        <StatCard
          title="Clientes Ativos"
          value={clients.filter(c => c.status === 'active').length.toString()}
          icon={Users}
          iconColor="text-green-600"
        />
        <StatCard
          title="Projetos Ativos"
          value={clients.reduce((acc, client) => acc + (client.projects?.length || 0), 0).toString()}
          icon={FolderOpen}
          iconColor="text-purple-600"
        />
        <StatCard
          title="Valor Total"
          value={`R$ ${clients.reduce((acc, client) => acc + client.totalBilled, 0).toLocaleString()}`}
          icon={DollarSign}
          iconColor="text-green-600"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">
          <AlertCircle className="mx-auto h-12 w-12" />
          <h3 className="mt-4 text-lg font-semibold">Erro ao carregar clientes</h3>
          <p className="mt-2 text-sm">{error}</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredClients.map((client) => (
              <Card key={client.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={client.avatar} alt={client.name} />
                        <AvatarFallback>
                          {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{client.name}</CardTitle>
                        <CardDescription>{client.contact.name}</CardDescription>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => openViewDialog(client)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver Detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditDialog(client)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar Cliente
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => openDeleteDialog(client)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir Cliente
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <div className={`h-2 w-2 rounded-full ${statusMap[client.status as keyof typeof statusMap].color}`} />
                    <Badge variant="outline">
                      {statusMap[client.status as keyof typeof statusMap].label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground h-10">
                    {client.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{client.contact.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{client.contact.phone}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="text-sm">
                      <span className="font-medium">{client.projects?.length || 0}</span>
                      <span className="text-muted-foreground"> projetos</span>
                    </div>
                    <div className="text-sm font-medium">
                      R$ {client.totalBilled.toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredClients.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Nenhum cliente encontrado</h3>
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== "all" 
                  ? "Tente ajustar os filtros de busca" 
                  : "Comece adicionando seu primeiro cliente"}
              </p>
            </div>
          )}
        </>
      )}

      {/* Dialogs */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Cliente</DialogTitle>
            <DialogDescription>
              Adicione um novo cliente ao seu portfólio.
            </DialogDescription>
          </DialogHeader>
          {/* Form fields */}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsCreateDialogOpen(false); resetForm(); }}>
              Cancelar
            </Button>
            <Button onClick={handleCreateClient}>Criar Cliente</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription>
              Atualize as informações do cliente.
            </DialogDescription>
          </DialogHeader>
          {/* Form fields */}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsEditDialogOpen(false); resetForm(); }}>
              Cancelar
            </Button>
            <Button onClick={handleEditClient}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedClient?.name}</DialogTitle>
          </DialogHeader>
          {/* View details */}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o cliente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteClient}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
