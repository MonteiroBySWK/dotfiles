"use client";

import React, { useState, useEffect } from 'react';
import { taskService } from '@/services/TaskService';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2,
  Play,
  Calendar,
  Clock,
  Flag,
  Users,
  ArrowRight,
  Target,
  CheckCircle2,
  AlertTriangle,
  Zap,
  FileText,
  Settings,
  Eye
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
interface BacklogItem {
  id: string;
  title: string;
  description: string;
  type: 'user-story' | 'bug' | 'task' | 'epic';
  priority: 'low' | 'medium' | 'high' | 'critical';
  storyPoints: number;
  status: 'backlog' | 'ready' | 'in-sprint' | 'done';
  assignee?: string;
  labels: string[];
  createdAt: string;
  acceptanceCriteria?: string[];
  epic?: string;
}

interface Sprint {
  id: string;
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'active' | 'completed';
  items: BacklogItem[];
  capacity: number;
  totalPoints: number;
}

// We'll load backlog items from TaskService and map into backlog model

const initialSprints: Sprint[] = [
  {
    id: 'sprint-1',
    name: 'Sprint 1 - Setup Inicial',
    goal: 'Estabelecer fundação do projeto com autenticação e estrutura básica',
    startDate: '2025-09-20',
    endDate: '2025-10-03',
    status: 'active',
    items: [],
    capacity: 40,
    totalPoints: 0
  }
];

// Funções auxiliares
const getTypeIcon = (type: string) => {
  switch (type) {
    case 'user-story': return <Users className="h-4 w-4 text-blue-600" />;
    case 'bug': return <AlertTriangle className="h-4 w-4 text-red-600" />;
    case 'task': return <Settings className="h-4 w-4 text-green-600" />;
    case 'epic': return <Target className="h-4 w-4 text-purple-600" />;
    default: return <FileText className="h-4 w-4" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'user-story': return 'bg-blue-100 text-blue-800';
    case 'bug': return 'bg-red-100 text-red-800';
    case 'task': return 'bg-green-100 text-green-800';
    case 'epic': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'critical': return 'bg-red-500';
    case 'high': return 'bg-orange-500';
    case 'medium': return 'bg-yellow-500';
    case 'low': return 'bg-green-500';
    default: return 'bg-gray-500';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'backlog': return 'bg-gray-100 text-gray-800';
    case 'ready': return 'bg-blue-100 text-blue-800';
    case 'in-sprint': return 'bg-yellow-100 text-yellow-800';
    case 'done': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// Componente de Item do Backlog em Lista
function BacklogItemRow({ item, onEdit, onAddToSprint, onView }: { 
  item: BacklogItem; 
  onEdit: (item: BacklogItem) => void;
  onAddToSprint: (item: BacklogItem) => void;
  onView: (item: BacklogItem) => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-border hover:bg-muted/50 transition-colors cursor-pointer" 
         onClick={() => onView(item)}>
      <div className="flex items-center gap-4 flex-1">
        <div className={`h-3 w-3 rounded-full ${getPriorityColor(item.priority)}`} />
        
        <div className="flex items-center gap-2 min-w-0">
          {getTypeIcon(item.type)}
          <Badge className={getTypeColor(item.type)}>
            {item.type.replace('-', ' ')}
          </Badge>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{item.title}</h3>
          <p className="text-sm text-muted-foreground truncate">
            {item.description}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/10 text-primary font-semibold">
            {item.storyPoints} pts
          </Badge>
          
          <Badge className={getStatusColor(item.status)}>
            {item.status}
          </Badge>
          
          <div className="hidden sm:flex flex-wrap gap-1">
            {item.labels.slice(0, 2).map((label, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {label}
              </Badge>
            ))}
            {item.labels.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{item.labels.length - 2}
              </Badge>
            )}
          </div>
        </div>
        
        {item.assignee && (
          <div className="hidden lg:flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-3 w-3" />
            <span>{item.assignee}</span>
          </div>
        )}
        
        {item.epic && (
          <div className="hidden xl:flex items-center gap-1 text-sm text-muted-foreground">
            <Target className="h-3 w-3" />
            <span>{item.epic}</span>
          </div>
        )}
        
        <div className="text-xs text-muted-foreground hidden xl:block">
          {new Date(item.createdAt).toLocaleDateString('pt-BR')}
        </div>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onView(item); }} className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Ver Detalhes
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(item); }} className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onAddToSprint(item); }} className="flex items-center gap-2">
            <ArrowRight className="h-4 w-4" />
            Adicionar à Sprint
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2 text-destructive" onClick={(e) => e.stopPropagation()}>
            <Trash2 className="h-4 w-4" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// Modal de Detalhes do Item
function ItemDetailModal({ item, open, onOpenChange }: { 
  item: BacklogItem | null; 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<BacklogItem | null>(item);

  React.useEffect(() => {
    setFormData(item);
    setIsEditing(false);
  }, [item]);

  if (!item || !formData) return null;

  const handleSave = () => {
    console.log('Salvando alterações:', formData);
    setIsEditing(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getTypeIcon(formData.type)}
              <DialogTitle className="text-xl">
                {isEditing ? 'Editar Item' : 'Detalhes do Item'}
              </DialogTitle>
            </div>
            <div className="flex items-center gap-2">
              {!isEditing && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              )}
              <Badge className={`text-white ${getPriorityColor(formData.priority)}`}>
                {formData.priority}
              </Badge>
            </div>
          </div>
          <DialogDescription>
            {formData.type.replace('-', ' ')} • {formData.storyPoints} Story Points
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Tipo</Label>
              <div className="mt-1">
                <Badge className={getTypeColor(formData.type)}>
                  {getTypeIcon(formData.type)}
                  <span className="ml-1">{formData.type.replace('-', ' ')}</span>
                </Badge>
              </div>
            </div>
            
            <div>
              <Label>Status</Label>
              <div className="mt-1">
                <Badge className={getStatusColor(formData.status)}>
                  {formData.status}
                </Badge>
              </div>
            </div>
            
            <div>
              <Label>Story Points</Label>
              <div className="mt-1">
                <Badge variant="outline" className="bg-primary/10 text-primary font-semibold">
                  {formData.storyPoints} pts
                </Badge>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="title">Título</Label>
            {isEditing ? (
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            ) : (
              <p className="text-sm text-foreground font-medium mt-1">{formData.title}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="description">Descrição</Label>
            {isEditing ? (
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
              />
            ) : (
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{formData.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="assignee">Responsável</Label>
              {isEditing ? (
                <Input
                  id="assignee"
                  value={formData.assignee || ''}
                  onChange={(e) => setFormData({...formData, assignee: e.target.value})}
                />
              ) : (
                <p className="text-sm text-foreground mt-1">{formData.assignee || 'Não definido'}</p>
              )}
            </div>

            <div>
              <Label htmlFor="epic">Epic</Label>
              {isEditing ? (
                <Input
                  id="epic"
                  value={formData.epic || ''}
                  onChange={(e) => setFormData({...formData, epic: e.target.value})}
                />
              ) : (
                <p className="text-sm text-foreground mt-1">{formData.epic || 'Não definido'}</p>
              )}
            </div>
          </div>

          <div>
            <Label>Labels</Label>
            <div className="flex flex-wrap gap-1 mt-2">
              {formData.labels.map((label, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {label}
                </Badge>
              ))}
            </div>
          </div>

          {formData.acceptanceCriteria && formData.acceptanceCriteria.length > 0 && (
            <div>
              <Label>Critérios de Aceitação</Label>
              <div className="mt-2 space-y-2">
                {formData.acceptanceCriteria.map((criteria, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 bg-muted/50 rounded-md">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{criteria}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-4">
            <span>Criado em {new Date(formData.createdAt).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>

        {isEditing && (
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Componente de Sprint
// Componente de Sprint em Lista
function SprintRow({ sprint, onStartSprint, onViewItems }: {
  sprint: Sprint;
  onStartSprint: (sprint: Sprint) => void;
  onViewItems: (sprint: Sprint) => void;
}) {
  const getSprintStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-gray-100 text-gray-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const progressPercentage = sprint.capacity > 0 ? (sprint.totalPoints / sprint.capacity) * 100 : 0;

  return (
    <div className="flex items-center justify-between p-4 border-b border-border hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-4 flex-1">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <Badge className={getSprintStatusColor(sprint.status)}>
              {sprint.status}
            </Badge>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{sprint.name}</h3>
            <p className="text-sm text-muted-foreground truncate">{sprint.goal}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{new Date(sprint.startDate).toLocaleDateString('pt-BR')} - {new Date(sprint.endDate).toLocaleDateString('pt-BR')}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">{sprint.items.length} itens</span>
            <Badge variant="outline" className="bg-primary/10 text-primary font-semibold">
              {sprint.totalPoints} / {sprint.capacity} pts
            </Badge>
          </div>
          
          <div className="hidden lg:flex items-center gap-2 min-w-[120px]">
            <div className="flex-1 bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground min-w-[35px]">
              {Math.round(progressPercentage)}%
            </span>
          </div>
        </div>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onViewItems(sprint)} className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Ver Itens
          </DropdownMenuItem>
          {sprint.status === 'planning' && (
            <DropdownMenuItem onClick={() => onStartSprint(sprint)} className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Iniciar Sprint
            </DropdownMenuItem>
          )}
          <DropdownMenuItem className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-4 w-4" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// Formulário de Novo Item
function NewItemDialog({ onCreated, projectId }: { onCreated?: () => void; projectId?: string }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'user-story' as 'user-story' | 'bug' | 'task' | 'epic',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    storyPoints: 3,
    assignee: '',
    labels: '',
    epic: '',
    acceptanceCriteria: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Map backlog item -> Task minimal shape
      await taskService.createTask({
        title: formData.title,
        description: formData.description,
        status: 'todo',
        priority: formData.priority as any,
        estimatedHours: formData.storyPoints,
        tags: formData.labels ? formData.labels.split(',').map(s => s.trim()) : [],
        assigneeId: formData.assignee || undefined,
        projectId: projectId || undefined,
        createdAt: new Date(),
        updatedAt: new Date()
      } as any)
      setOpen(false);
      onCreated?.()
    } catch (err) {
      console.error('Failed to create backlog item', err)
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Item
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Criar Novo Item do Backlog</DialogTitle>
          <DialogDescription>
            Adicione um novo item ao product backlog.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="type">Tipo</Label>
                <Select value={formData.type} onValueChange={(value: 'user-story' | 'bug' | 'task' | 'epic') => setFormData({...formData, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user-story">User Story</SelectItem>
                    <SelectItem value="bug">Bug</SelectItem>
                    <SelectItem value="task">Task</SelectItem>
                    <SelectItem value="epic">Epic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="priority">Prioridade</Label>
                <Select value={formData.priority} onValueChange={(value: 'low' | 'medium' | 'high' | 'critical') => setFormData({...formData, priority: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="critical">Crítica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="storyPoints">Story Points</Label>
                <Select value={formData.storyPoints.toString()} onValueChange={(value) => setFormData({...formData, storyPoints: parseInt(value)})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="8">8</SelectItem>
                    <SelectItem value="13">13</SelectItem>
                    <SelectItem value="21">21</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                placeholder="Ex: Como usuário, quero..."
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Descreva o item detalhadamente..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="assignee">Responsável</Label>
                <Input
                  id="assignee"
                  placeholder="Nome do responsável"
                  value={formData.assignee}
                  onChange={(e) => setFormData({...formData, assignee: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="epic">Epic</Label>
                <Input
                  id="epic"
                  placeholder="Nome do epic"
                  value={formData.epic}
                  onChange={(e) => setFormData({...formData, epic: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="labels">Labels (separadas por vírgula)</Label>
              <Input
                id="labels"
                placeholder="Backend, Frontend, UI/UX"
                value={formData.labels}
                onChange={(e) => setFormData({...formData, labels: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="criteria">Critérios de Aceitação (um por linha)</Label>
              <Textarea
                id="criteria"
                placeholder="- Critério 1&#10;- Critério 2&#10;- Critério 3"
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
              Criar Item
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Componente Principal
export default function Backlog({ projectId }: { projectId?: string }) {
  const [backlogItems, setBacklogItems] = useState<BacklogItem[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>(initialSprints);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<BacklogItem | null>(null);
  const [showItemDetail, setShowItemDetail] = useState(false);

  const filteredItems = backlogItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesPriority = selectedPriority === 'all' || item.priority === selectedPriority;
    
    return matchesSearch && matchesType && matchesPriority;
  });

  const backlogOnlyItems = filteredItems.filter(item => item.status === 'backlog' || item.status === 'ready');

  const handleEdit = (item: BacklogItem) => {
    console.log('Editar item:', item);
  };

  const handleAddToSprint = (item: BacklogItem) => {
    console.log('Adicionar à sprint:', item);
  };

  const handleStartSprint = (sprint: Sprint) => {
    console.log('Iniciar sprint:', sprint);
    // Aqui você redirecionaria para o Kanban
  };

  const handleViewSprintItems = (sprint: Sprint) => {
    console.log('Ver itens da sprint:', sprint);
  };

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const tasks = projectId ? await taskService.getTasksByProject(projectId) : await taskService.getTasks()
        if (!mounted) return
        const mapped: BacklogItem[] = tasks.map(t => ({
          id: t.id,
          title: t.title,
          description: t.description || '',
          // Map task status/priority to backlog fields conservatively
          type: 'task',
          priority: (t.priority as BacklogItem['priority']) || 'medium',
          storyPoints: (t.estimatedHours || 0),
          status: (t.status === 'todo' ? 'backlog' : t.status === 'completed' ? 'done' : 'ready'),
          assignee: (t.assigneeId as string) || undefined,
          labels: t.tags || [],
          createdAt: (t.createdAt ? String(t.createdAt) : new Date().toISOString())
        }))

        setBacklogItems(mapped)
      } catch (err) {
        console.error('Failed to load backlog items', err)
      }
    }

    load()

    return () => { mounted = false }
  }, [])

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Product Backlog</h1>
          <p className="text-muted-foreground">
            Gerencie itens do backlog e organize sprints
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Target className="h-4 w-4 mr-2" />
            Nova Sprint
          </Button>
          <NewItemDialog onCreated={() => {
            // reload will happen via effect in parent component
            // simple approach: trigger a state update by toggling sprints
            setSprints(prev => [...prev])
          }} />
        </div>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar itens..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="user-story">User Story</SelectItem>
            <SelectItem value="bug">Bug</SelectItem>
            <SelectItem value="task">Task</SelectItem>
            <SelectItem value="epic">Epic</SelectItem>
          </SelectContent>
        </Select>
        
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
      </div>

      {/* Tabs */}
      <Tabs defaultValue="backlog" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="backlog" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Backlog ({backlogOnlyItems.length})
          </TabsTrigger>
          <TabsTrigger value="sprints" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Sprints ({sprints.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="backlog" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Itens do Backlog</CardTitle>
              <CardDescription>
                Itens priorizados aguardando para serem incluídos em sprints
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {backlogOnlyItems.length > 0 ? (
                <div className="bg-background border rounded-lg divide-y">
                  {backlogOnlyItems.map((item) => (
                    <BacklogItemRow
                      key={item.id}
                      item={item}
                      onEdit={handleEdit}
                      onAddToSprint={handleAddToSprint}
                      onView={(item) => {
                        setSelectedItem(item);
                        setShowItemDetail(true);
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum item encontrado no backlog.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sprints" className="space-y-4">
          <div className="bg-background border rounded-lg divide-y">
            {sprints.map((sprint) => (
              <SprintRow
                key={sprint.id}
                sprint={sprint}
                onStartSprint={handleStartSprint}
                onViewItems={handleViewSprintItems}
              />
            ))}
          </div>
          {sprints.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma sprint criada ainda.
            </div>
          )}
        </TabsContent>
      </Tabs>

      <ItemDetailModal
        item={selectedItem}
        open={showItemDetail}
        onOpenChange={setShowItemDetail}
      />
    </div>
  );
}
