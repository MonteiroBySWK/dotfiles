'use client';

import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  PauseCircle,
  Filter,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// Tipos
interface GanttTask {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: 'not-started' | 'in-progress' | 'completed' | 'delayed' | 'paused';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee: string;
  dependencies: string[];
  project: string;
  milestone: boolean;
  estimatedHours: number;
  actualHours: number;
}

interface Project {
  id: string;
  name: string;
  color: string;
}

// Dados iniciais
const initialProjects: Project[] = [
  { id: '1', name: 'Sistema de CRM', color: '#3b82f6' },
  { id: '2', name: 'App Mobile', color: '#10b981' },
  { id: '3', name: 'Dashboard Analytics', color: '#f59e0b' },
  { id: '4', name: 'API Gateway', color: '#ef4444' },
];

const initialTasks: GanttTask[] = [
  {
    id: '1',
    name: 'Análise de Requisitos',
    description: 'Levantamento completo dos requisitos do sistema',
    startDate: '2024-09-15',
    endDate: '2024-09-25',
    progress: 100,
    status: 'completed',
    priority: 'high',
    assignee: 'Ana Silva',
    dependencies: [],
    project: '1',
    milestone: false,
    estimatedHours: 40,
    actualHours: 38
  },
  {
    id: '2',
    name: 'Design da Interface',
    description: 'Criação dos mockups e protótipos das telas',
    startDate: '2024-09-22',
    endDate: '2024-10-05',
    progress: 85,
    status: 'in-progress',
    priority: 'medium',
    assignee: 'Carlos Santos',
    dependencies: ['1'],
    project: '1',
    milestone: false,
    estimatedHours: 60,
    actualHours: 45
  },
  {
    id: '3',
    name: 'Desenvolvimento Backend',
    description: 'Implementação da API e regras de negócio',
    startDate: '2024-10-01',
    endDate: '2024-11-15',
    progress: 40,
    status: 'in-progress',
    priority: 'critical',
    assignee: 'João Pedro',
    dependencies: ['1'],
    project: '1',
    milestone: false,
    estimatedHours: 120,
    actualHours: 65
  },
  {
    id: '4',
    name: 'Desenvolvimento Frontend',
    description: 'Implementação das interfaces e integração com API',
    startDate: '2024-10-10',
    endDate: '2024-11-20',
    progress: 25,
    status: 'in-progress',
    priority: 'high',
    assignee: 'Maria Oliveira',
    dependencies: ['2'],
    project: '1',
    milestone: false,
    estimatedHours: 100,
    actualHours: 30
  },
  {
    id: '5',
    name: 'Testes e QA',
    description: 'Testes unitários, integração e aceitação',
    startDate: '2024-11-10',
    endDate: '2024-11-25',
    progress: 0,
    status: 'not-started',
    priority: 'high',
    assignee: 'Pedro Costa',
    dependencies: ['3', '4'],
    project: '1',
    milestone: false,
    estimatedHours: 80,
    actualHours: 0
  },
  {
    id: '6',
    name: 'Deploy Produção',
    description: 'Implantação em ambiente de produção',
    startDate: '2024-11-25',
    endDate: '2024-11-27',
    progress: 0,
    status: 'not-started',
    priority: 'critical',
    assignee: 'João Pedro',
    dependencies: ['5'],
    project: '1',
    milestone: true,
    estimatedHours: 16,
    actualHours: 0
  },
  {
    id: '7',
    name: 'Setup Inicial App',
    description: 'Configuração inicial do projeto mobile',
    startDate: '2024-10-01',
    endDate: '2024-10-10',
    progress: 100,
    status: 'completed',
    priority: 'medium',
    assignee: 'Lucas Ferreira',
    dependencies: [],
    project: '2',
    milestone: false,
    estimatedHours: 30,
    actualHours: 28
  },
  {
    id: '8',
    name: 'Telas de Login',
    description: 'Desenvolvimento das telas de autenticação',
    startDate: '2024-10-10',
    endDate: '2024-10-20',
    progress: 70,
    status: 'in-progress',
    priority: 'high',
    assignee: 'Sofia Lima',
    dependencies: ['7'],
    project: '2',
    milestone: false,
    estimatedHours: 40,
    actualHours: 32
  },
  {
    id: '9',
    name: 'Dashboard Principal',
    description: 'Desenvolvimento da tela principal do dashboard',
    startDate: '2024-10-15',
    endDate: '2024-11-05',
    progress: 15,
    status: 'in-progress',
    priority: 'high',
    assignee: 'Rafael Martins',
    dependencies: [],
    project: '3',
    milestone: false,
    estimatedHours: 80,
    actualHours: 15
  },
  {
    id: '10',
    name: 'Configuração API Gateway',
    description: 'Setup e configuração do gateway de APIs',
    startDate: '2024-10-20',
    endDate: '2024-11-10',
    progress: 5,
    status: 'not-started',
    priority: 'medium',
    assignee: 'Thiago Silva',
    dependencies: [],
    project: '4',
    milestone: false,
    estimatedHours: 60,
    actualHours: 3
  }
];

// Funções auxiliares
const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-green-500';
    case 'in-progress': return 'bg-blue-500';
    case 'delayed': return 'bg-red-500';
    case 'paused': return 'bg-yellow-500';
    case 'not-started': return 'bg-gray-400';
    default: return 'bg-gray-400';
  }
};

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-800';
    case 'in-progress': return 'bg-blue-100 text-blue-800';
    case 'delayed': return 'bg-red-100 text-red-800';
    case 'paused': return 'bg-yellow-100 text-yellow-800';
    case 'not-started': return 'bg-gray-100 text-gray-800';
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

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed': return <CheckCircle2 className="h-4 w-4" />;
    case 'in-progress': return <PlayCircle className="h-4 w-4" />;
    case 'delayed': return <AlertCircle className="h-4 w-4" />;
    case 'paused': return <PauseCircle className="h-4 w-4" />;
    default: return <Clock className="h-4 w-4" />;
  }
};

// Componente principal
export default function Gantt() {
  const [tasks, setTasks] = useState<GanttTask[]>(initialTasks);
  const [projects] = useState<Project[]>(initialProjects);
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'days' | 'weeks' | 'months'>('weeks');
  const [currentDate, setCurrentDate] = useState(new Date('2024-10-01'));
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<GanttTask | null>(null);

  // Filtros
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesProject = selectedProject === 'all' || task.project === selectedProject;
      const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus;
      return matchesProject && matchesStatus;
    });
  }, [tasks, selectedProject, selectedStatus]);

  // Geração do calendário
  const generateCalendarDays = () => {
    const days = [];
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - 15); // 15 dias antes
    
    for (let i = 0; i < 45; i++) { // 45 dias total
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const calendarDays = generateCalendarDays();

  // Calcular posição e largura das barras
  const getTaskBarStyle = (task: GanttTask) => {
    const startDate = new Date(task.startDate);
    const endDate = new Date(task.endDate);
    const firstDay = calendarDays[0];
    const lastDay = calendarDays[calendarDays.length - 1];
    
    // Calcular posição inicial (em %)
    const totalDays = (lastDay.getTime() - firstDay.getTime()) / (1000 * 60 * 60 * 24);
    const startOffset = (startDate.getTime() - firstDay.getTime()) / (1000 * 60 * 60 * 24);
    const duration = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    
    const left = (startOffset / totalDays) * 100;
    const width = (duration / totalDays) * 100;
    
    return {
      left: `${Math.max(0, left)}%`,
      width: `${Math.min(width, 100 - left)}%`
    };
  };

  // Handlers
  const handleAddTask = () => {
    setEditingTask(null);
    setShowTaskModal(true);
  };

  const handleEditTask = (task: GanttTask) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const navigateCalendar = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    const daysToMove = viewMode === 'days' ? 7 : viewMode === 'weeks' ? 14 : 30;
    
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - daysToMove);
    } else {
      newDate.setDate(newDate.getDate() + daysToMove);
    }
    
    setCurrentDate(newDate);
  };

  return (
    <div className="space-y-6">
      {/* Header e Controles */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Diagrama de Gantt
            </CardTitle>
            <Button onClick={handleAddTask}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Tarefa
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filtros e Controles */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Label>Projeto:</Label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Projetos</SelectItem>
                  {projects.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label>Status:</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="not-started">Não Iniciado</SelectItem>
                  <SelectItem value="in-progress">Em Progresso</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                  <SelectItem value="delayed">Atrasado</SelectItem>
                  <SelectItem value="paused">Pausado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label>Visualização:</Label>
              <Select value={viewMode} onValueChange={(value: 'days' | 'weeks' | 'months') => setViewMode(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="days">Dias</SelectItem>
                  <SelectItem value="weeks">Semanas</SelectItem>
                  <SelectItem value="months">Meses</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1 ml-auto">
              <Button variant="outline" size="sm" onClick={() => navigateCalendar('prev')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigateCalendar('next')}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Gantt */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[1200px]">
              {/* Header do calendário */}
              <div className="flex border-b">
                <div className="w-80 p-4 font-semibold bg-muted/30 border-r">
                  <div className="flex items-center justify-between">
                    <span>Tarefa</span>
                    <div className="text-xs text-muted-foreground">
                      {filteredTasks.length} tarefas
                    </div>
                  </div>
                </div>
                <div className="flex-1 bg-muted/30">
                  {/* Header de mês */}
                  <div className="flex border-b border-border/50">
                    {Array.from(new Set(calendarDays.map(day => 
                      day.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
                    ))).map((monthYear, index) => {
                      const daysInMonth = calendarDays.filter(day => 
                        day.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }) === monthYear
                      ).length;
                      const flexBasis = (daysInMonth / calendarDays.length) * 100;
                      
                      return (
                        <div 
                          key={index}
                          className="px-2 py-1 text-center text-sm font-medium border-r border-border/50 last:border-r-0 bg-muted/50"
                          style={{ flexBasis: `${flexBasis}%` }}
                        >
                          {monthYear}
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Header de dias */}
                  <div className="flex">
                    {calendarDays.map((day, index) => {
                      const isToday = day.toDateString() === new Date().toDateString();
                      const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                      
                      return (
                        <div 
                          key={index} 
                          className={`flex-1 p-2 text-center text-xs border-r border-border last:border-r-0 ${
                            isToday ? 'bg-primary/20 font-bold' : ''
                          } ${isWeekend ? 'bg-muted/50' : ''}`}
                        >
                          <div className={`font-medium ${isToday ? 'text-primary' : ''}`}>
                            {day.toLocaleDateString('pt-BR', { day: '2-digit' })}
                          </div>
                          <div className={`text-muted-foreground ${isToday ? 'text-primary/70' : ''}`}>
                            {day.toLocaleDateString('pt-BR', { weekday: 'short' })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Linhas das tarefas */}
              <div className="divide-y">
                {filteredTasks.map((task) => {
                  const project = projects.find(p => p.id === task.project);
                  const taskBarStyle = getTaskBarStyle(task);
                  
                  return (
                    <div key={task.id} className="flex hover:bg-muted/30 transition-colors">
                      {/* Coluna da tarefa */}
                      <div className="w-80 p-4 border-r">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm truncate flex-1">
                              {task.name}
                              {task.milestone && (
                                <Badge variant="outline" className="ml-2 text-xs">
                                  Marco
                                </Badge>
                              )}
                            </h4>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <MoreHorizontal className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem 
                                  onClick={() => handleEditTask(task)}
                                  className="flex items-center gap-2"
                                >
                                  <Edit className="h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteTask(task.id)}
                                  className="flex items-center gap-2 text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${getPriorityColor(task.priority)}`} />
                            <Badge className={getStatusBadgeColor(task.status)}>
                              {getStatusIcon(task.status)}
                              <span className="ml-1 text-xs">{task.status}</span>
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>{task.assignee}</span>
                            </div>
                            {project && (
                              <div className="flex items-center gap-1">
                                <div 
                                  className="h-2 w-2 rounded-full" 
                                  style={{ backgroundColor: project.color }}
                                />
                                <span>{project.name}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="text-xs text-muted-foreground">
                            {task.progress}% concluído
                          </div>
                        </div>
                      </div>

                      {/* Área do gráfico */}
                      <div className="flex-1 p-4 relative">
                        {/* Linha de grade vertical */}
                        <div className="absolute inset-0 flex">
                          {calendarDays.map((_, index) => (
                            <div 
                              key={index} 
                              className="flex-1 border-r border-border/30 last:border-r-0"
                            />
                          ))}
                        </div>
                        
                        {/* Barra da tarefa */}
                        <div 
                          className="relative h-6 rounded"
                          style={taskBarStyle}
                        >
                          <div className={`h-full rounded ${getStatusColor(task.status)} opacity-80`}>
                            {/* Barra de progresso */}
                            <div 
                              className="h-full bg-white/30 rounded"
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                          
                          {/* Tooltip com informações */}
                          <div className="absolute left-2 top-0 h-full flex items-center">
                            <span className="text-white text-xs font-medium truncate">
                              {task.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Tarefa */}
      <TaskModal
        open={showTaskModal}
        onOpenChange={setShowTaskModal}
        task={editingTask}
        projects={projects}
        onSave={(taskData) => {
          if (editingTask) {
            setTasks(tasks.map(t => t.id === editingTask.id ? { ...editingTask, ...taskData } : t));
          } else {
            const newTask: GanttTask = {
              id: Date.now().toString(),
              name: taskData.name || '',
              description: taskData.description || '',
              startDate: taskData.startDate || '',
              endDate: taskData.endDate || '',
              status: taskData.status || 'not-started',
              priority: taskData.priority || 'medium',
              assignee: taskData.assignee || '',
              project: taskData.project || '',
              milestone: taskData.milestone || false,
              estimatedHours: taskData.estimatedHours || 0,
              dependencies: [],
              progress: 0,
              actualHours: 0
            };
            setTasks([...tasks, newTask]);
          }
          setShowTaskModal(false);
          setEditingTask(null);
        }}
      />
    </div>
  );
}

// Modal de Tarefa
function TaskModal({ 
  open, 
  onOpenChange, 
  task, 
  projects, 
  onSave 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  task: GanttTask | null;
  projects: Project[];
  onSave: (task: Partial<GanttTask>) => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'not-started' as GanttTask['status'],
    priority: 'medium' as GanttTask['priority'],
    assignee: '',
    project: '',
    milestone: false,
    estimatedHours: 0
  });

  React.useEffect(() => {
    if (task) {
      setFormData({
        name: task.name,
        description: task.description,
        startDate: task.startDate,
        endDate: task.endDate,
        status: task.status,
        priority: task.priority,
        assignee: task.assignee,
        project: task.project,
        milestone: task.milestone,
        estimatedHours: task.estimatedHours
      });
    } else {
      setFormData({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        status: 'not-started',
        priority: 'medium',
        assignee: '',
        project: '',
        milestone: false,
        estimatedHours: 0
      });
    }
  }, [task]);

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {task ? 'Editar Tarefa' : 'Nova Tarefa'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome da Tarefa</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="project">Projeto</Label>
              <Select value={formData.project} onValueChange={(value) => setFormData({...formData, project: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um projeto" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Data de Início</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="endDate">Data de Fim</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not-started">Não Iniciado</SelectItem>
                  <SelectItem value="in-progress">Em Progresso</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                  <SelectItem value="delayed">Atrasado</SelectItem>
                  <SelectItem value="paused">Pausado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="priority">Prioridade</Label>
              <Select value={formData.priority} onValueChange={(value: any) => setFormData({...formData, priority: value})}>
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
              <Label htmlFor="estimatedHours">Horas Estimadas</Label>
              <Input
                id="estimatedHours"
                type="number"
                value={formData.estimatedHours}
                onChange={(e) => setFormData({...formData, estimatedHours: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="assignee">Responsável</Label>
            <Input
              id="assignee"
              value={formData.assignee}
              onChange={(e) => setFormData({...formData, assignee: e.target.value})}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="milestone"
              checked={formData.milestone}
              onChange={(e) => setFormData({...formData, milestone: e.target.checked})}
              className="rounded"
            />
            <Label htmlFor="milestone">Esta é uma tarefa marco (milestone)</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            {task ? 'Salvar Alterações' : 'Criar Tarefa'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
