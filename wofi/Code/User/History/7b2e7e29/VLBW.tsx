"use client";

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Flag,
  FileText,
  Settings,
  Users,
  Shield,
  Zap,
  Globe
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../ui/tabs';
import { Label } from '../ui/label';

// Tipos e Interfaces
interface Requirement {
  id: string;
  title: string;
  description: string;
  type: 'functional' | 'non-functional';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'draft' | 'approved' | 'implemented' | 'testing';
  category: string;
  createdAt: string;
  updatedAt: string;
  assignee?: string;
  acceptanceCriteria?: string[];
}

// Dados iniciais de exemplo
const initialRequirements: Requirement[] = [
  {
    id: 'req-1',
    title: 'Sistema de Autenticação',
    description: 'O sistema deve permitir que usuários se autentiquem usando email e senha',
    type: 'functional',
    priority: 'critical',
    status: 'approved',
    category: 'Autenticação',
    createdAt: '2025-09-15',
    updatedAt: '2025-09-20',
    assignee: 'Ana Silva',
    acceptanceCriteria: [
      'Usuário pode fazer login com email/senha válidos',
      'Sistema deve bloquear tentativas de login inválidas',
      'Deve exibir mensagens de erro apropriadas'
    ]
  },
  {
    id: 'req-2',
    title: 'Interface Responsiva',
    description: 'A aplicação deve ser totalmente responsiva e funcionar em dispositivos móveis',
    type: 'functional',
    priority: 'high',
    status: 'implemented',
    category: 'UI/UX',
    createdAt: '2025-09-10',
    updatedAt: '2025-09-18',
    assignee: 'Carla Oliveira'
  },
  {
    id: 'req-3',
    title: 'Performance de Carregamento',
    description: 'As páginas devem carregar em menos de 2 segundos',
    type: 'non-functional',
    priority: 'high',
    status: 'testing',
    category: 'Performance',
    createdAt: '2025-09-12',
    updatedAt: '2025-09-19',
    assignee: 'Bruno Santos'
  },
  {
    id: 'req-4',
    title: 'Segurança de Dados',
    description: 'Todos os dados sensíveis devem ser criptografados em trânsito e em repouso',
    type: 'non-functional',
    priority: 'critical',
    status: 'approved',
    category: 'Segurança',
    createdAt: '2025-09-08',
    updatedAt: '2025-09-16'
  },
  {
    id: 'req-5',
    title: 'Dashboard de Relatórios',
    description: 'Sistema deve exibir relatórios em tempo real com gráficos interativos',
    type: 'functional',
    priority: 'medium',
    status: 'draft',
    category: 'Relatórios',
    createdAt: '2025-09-14',
    updatedAt: '2025-09-21',
    assignee: 'Diego Costa'
  },
  {
    id: 'req-6',
    title: 'Disponibilidade do Sistema',
    description: 'O sistema deve ter 99.9% de disponibilidade (uptime)',
    type: 'non-functional',
    priority: 'high',
    status: 'draft',
    category: 'Disponibilidade',
    createdAt: '2025-09-13',
    updatedAt: '2025-09-20'
  }
];

// Funções auxiliares
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'critical': return 'bg-red-500 hover:bg-red-600';
    case 'high': return 'bg-orange-500 hover:bg-orange-600';
    case 'medium': return 'bg-yellow-500 hover:bg-yellow-600';
    case 'low': return 'bg-green-500 hover:bg-green-600';
    default: return 'bg-gray-500 hover:bg-gray-600';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'draft': return 'bg-gray-100 text-gray-800';
    case 'approved': return 'bg-blue-100 text-blue-800';
    case 'implemented': return 'bg-green-100 text-green-800';
    case 'testing': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'draft': return <FileText className="h-3 w-3" />;
    case 'approved': return <CheckCircle2 className="h-3 w-3" />;
    case 'implemented': return <Zap className="h-3 w-3" />;
    case 'testing': return <Clock className="h-3 w-3" />;
    default: return <FileText className="h-3 w-3" />;
  }
};

const getTypeIcon = (type: string) => {
  return type === 'functional' ? <Users className="h-4 w-4" /> : <Settings className="h-4 w-4" />;
};

// Componente do Card de Requisito
function RequirementCard({ requirement }: { requirement: Requirement }) {
  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-border/50 hover:border-border">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className={`h-2 w-2 rounded-full mt-2 ${getPriorityColor(requirement.priority)}`} />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {getTypeIcon(requirement.type)}
                <h3 className="font-semibold text-foreground">{requirement.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {requirement.description}
              </p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 text-destructive">
                <Trash2 className="h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(requirement.status)}>
              {getStatusIcon(requirement.status)}
              <span className="ml-1 capitalize">{requirement.status}</span>
            </Badge>
            <Badge variant="outline">
              {requirement.category}
            </Badge>
          </div>
          
          <Badge 
            className={`text-white ${getPriorityColor(requirement.priority)}`}
          >
            {requirement.priority}
          </Badge>
        </div>
        
        {requirement.assignee && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Users className="h-3 w-3" />
            <span>Responsável: {requirement.assignee}</span>
          </div>
        )}
        
        <div className="text-xs text-muted-foreground">
          Criado em {new Date(requirement.createdAt).toLocaleDateString('pt-BR')}
          {requirement.updatedAt !== requirement.createdAt && (
            <span> • Atualizado em {new Date(requirement.updatedAt).toLocaleDateString('pt-BR')}</span>
          )}
        </div>
        
        {requirement.acceptanceCriteria && requirement.acceptanceCriteria.length > 0 && (
          <div className="mt-3 p-2 bg-muted/50 rounded-md">
            <p className="text-xs font-medium text-muted-foreground mb-1">Critérios de Aceitação:</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              {requirement.acceptanceCriteria.slice(0, 2).map((criteria, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span className="text-primary">•</span>
                  <span>{criteria}</span>
                </li>
              ))}
              {requirement.acceptanceCriteria.length > 2 && (
                <li className="text-xs italic">+{requirement.acceptanceCriteria.length - 2} mais...</li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Formulário de Novo Requisito
function NewRequirementDialog() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'functional' as 'functional' | 'non-functional',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    category: '',
    assignee: '',
    acceptanceCriteria: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você implementaria a lógica para salvar o requisito
    console.log('Novo requisito:', formData);
    setOpen(false);
    // Reset form
    setFormData({
      title: '',
      description: '',
      type: 'functional',
      priority: 'medium',
      category: '',
      assignee: '',
      acceptanceCriteria: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Requisito
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Criar Novo Requisito</DialogTitle>
          <DialogDescription>
            Defina um novo requisito funcional ou não funcional para o projeto.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Tipo de Requisito</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value: 'functional' | 'non-functional') => 
                    setFormData({...formData, type: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="functional">Funcional</SelectItem>
                    <SelectItem value="non-functional">Não Funcional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="priority">Prioridade</Label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(value: 'low' | 'medium' | 'high' | 'critical') => 
                    setFormData({...formData, priority: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="critical">Crítica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                placeholder="Ex: Sistema de Autenticação"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Descreva o requisito detalhadamente..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Categoria</Label>
                <Input
                  id="category"
                  placeholder="Ex: Autenticação, UI/UX, Performance"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="assignee">Responsável</Label>
                <Input
                  id="assignee"
                  placeholder="Nome do responsável"
                  value={formData.assignee}
                  onChange={(e) => setFormData({...formData, assignee: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="criteria">Critérios de Aceitação</Label>
              <Textarea
                id="criteria"
                placeholder="Liste os critérios (um por linha)"
                value={formData.acceptanceCriteria}
                onChange={(e) => setFormData({...formData, acceptanceCriteria: e.target.value})}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Criar Requisito
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Componente Principal
export default function ProjectRequirements() {
  const [requirements, setRequirements] = useState<Requirement[]>(initialRequirements);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const functionalRequirements = requirements.filter(req => req.type === 'functional');
  const nonFunctionalRequirements = requirements.filter(req => req.type === 'non-functional');

  const filterRequirements = (reqs: Requirement[]) => {
    return reqs.filter(req => {
      const matchesSearch = req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           req.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = selectedPriority === 'all' || req.priority === selectedPriority;
      const matchesStatus = selectedStatus === 'all' || req.status === selectedStatus;
      
      return matchesSearch && matchesPriority && matchesStatus;
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Requisitos do Projeto</h1>
          <p className="text-muted-foreground">
            Gerencie requisitos funcionais e não funcionais
          </p>
        </div>
        <NewRequirementDialog />
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar requisitos..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select value={selectedPriority} onValueChange={setSelectedPriority}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Prioridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="critical">Crítica</SelectItem>
            <SelectItem value="high">Alta</SelectItem>
            <SelectItem value="medium">Média</SelectItem>
            <SelectItem value="low">Baixa</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="draft">Rascunho</SelectItem>
            <SelectItem value="approved">Aprovado</SelectItem>
            <SelectItem value="implemented">Implementado</SelectItem>
            <SelectItem value="testing">Testando</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs para separar tipos de requisitos */}
      <Tabs defaultValue="functional" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="functional" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Funcionais ({functionalRequirements.length})
          </TabsTrigger>
          <TabsTrigger value="non-functional" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Não Funcionais ({nonFunctionalRequirements.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="functional" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filterRequirements(functionalRequirements).map((requirement) => (
              <RequirementCard key={requirement.id} requirement={requirement} />
            ))}
          </div>
          {filterRequirements(functionalRequirements).length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum requisito funcional encontrado.
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="non-functional" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filterRequirements(nonFunctionalRequirements).map((requirement) => (
              <RequirementCard key={requirement.id} requirement={requirement} />
            ))}
          </div>
          {filterRequirements(nonFunctionalRequirements).length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum requisito não funcional encontrado.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
