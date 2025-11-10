'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { taskService } from '@/services/TaskService';
import { projectService } from '@/services/ProjectService';
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

// We'll fetch projects and tasks from ProjectService / TaskService

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
  const [tasks, setTasks] = useState<GanttTask[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'days' | 'weeks' | 'months'>('weeks');
  const [currentDate, setCurrentDate] = useState(new Date('2024-10-01'));
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<GanttTask | null>(null);

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const [projList, taskList] = await Promise.all([projectService.getProjects(), taskService.getTasks()])
        if (!mounted) return
        const palette = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#7c3aed']
        setProjects(projList.map((p, idx) => ({ id: p.id, name: p.name, color: palette[idx % palette.length] })))
        setTasks(taskList.map(t => ({
          id: t.id,
          name: t.title,
          description: t.description || '',
          // Use createdAt as fallback for startDate, dueDate as endDate
          startDate: t.createdAt ? String(t.createdAt) : '',
          endDate: t.dueDate ? String(t.dueDate) : '',
          progress: 0,
          status: (t.status as GanttTask['status']) || 'not-started',
          priority: (t.priority as GanttTask['priority']) || 'medium',
          assignee: (t.assigneeId as string) || '',
          dependencies: t.dependencies || [],
          project: (t.projectId as string) || '',
          milestone: !!t.milestoneId,
          estimatedHours: t.estimatedHours || 0,
          actualHours: t.actualHours || 0
        })))
      } catch (err) {
        console.error('Failed to load Gantt data', err)
      }
    }

    load()
    return () => { mounted = false }
  }, [])

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
    <div className="space-y-4 sm:space-y-6 p-4">
      {/* Header e Controles */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Calendar className="h-5 w-5 flex-shrink-0" />
              <span className="truncate">Diagrama de Gantt</span>
            </CardTitle>
            <Button onClick={handleAddTask} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Nova Tarefa</span>
              <span className="sm:hidden">Nova</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filtros e Controles */}
          <div className="space-y-4">
            {/* Primeira linha de filtros */}
            <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                <Label className="text-sm font-medium whitespace-nowrap">Projeto:</Label>
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Projetos</SelectItem>
                    {projects.map(project => (
                      <SelectItem key={project.id} value={project.id}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full flex-shrink-0" 
                            style={{ backgroundColor: project.color }}
                          />
                          <span className="truncate">{project.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                <Label className="text-sm font-medium whitespace-nowrap">Status:</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="not-started">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 flex-shrink-0" />
                        <span>Não Iniciado</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="in-progress">
                      <div className="flex items-center gap-2">
                        <PlayCircle className="h-3 w-3 flex-shrink-0" />
                        <span>Em Progresso</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="completed">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 flex-shrink-0" />
                        <span>Concluído</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="delayed">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-3 w-3 flex-shrink-0" />
                        <span>Atrasado</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="paused">
                      <div className="flex items-center gap-2">
                        <PauseCircle className="h-3 w-3 flex-shrink-0" />
                        <span>Pausado</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                <Label className="text-sm font-medium whitespace-nowrap">Visualização:</Label>
                <Select value={viewMode} onValueChange={(value: 'days' | 'weeks' | 'months') => setViewMode(value)}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="days">Dias</SelectItem>
                    <SelectItem value="weeks">Semanas</SelectItem>
                    <SelectItem value="months">Meses</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Segunda linha com navegação */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                Exibindo {filteredTasks.length} tarefas
              </div>
              
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" onClick={() => navigateCalendar('prev')}>
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline ml-1">Anterior</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentDate(new Date())}
                  className="px-3"
                >
                  Hoje
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateCalendar('next')}>
                  <span className="hidden sm:inline mr-1">Próximo</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Legenda */}
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="space-y-3">
              {/* Legenda para mobile */}
              <div className="sm:hidden space-y-2">
                <div>
                  <span className="font-medium text-xs mb-2 block">Status:</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded bg-gray-400 flex-shrink-0" />
                      <span>Não Iniciado</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded bg-blue-500 flex-shrink-0" />
                      <span>Em Progresso</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded bg-green-500 flex-shrink-0" />
                      <span>Concluído</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded bg-red-500 flex-shrink-0" />
                      <span>Atrasado</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <span className="font-medium text-xs mb-2 block">Prioridade:</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded bg-green-500 flex-shrink-0" />
                      <span>Baixa</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded bg-yellow-500 flex-shrink-0" />
                      <span>Média</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded bg-orange-500 flex-shrink-0" />
                      <span>Alta</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded bg-red-500 flex-shrink-0" />
                      <span>Crítica</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Legenda para desktop */}
              <div className="hidden sm:flex flex-wrap items-center gap-6 text-xs">
                <div className="flex items-center gap-4">
                  <span className="font-medium">Status:</span>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-gray-400" />
                    <span>Não Iniciado</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-blue-500" />
                    <span>Em Progresso</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-green-500" />
                    <span>Concluído</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-red-500" />
                    <span>Atrasado</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-yellow-500" />
                    <span>Pausado</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="font-medium">Prioridade:</span>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-green-500" />
                    <span>Baixa</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-yellow-500" />
                    <span>Média</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-orange-500" />
                    <span>Alta</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-red-500" />
                    <span>Crítica</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-yellow-500" />
                  <span>Marco</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Gantt */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[800px] lg:min-w-[1200px]">
              {/* Header do calendário */}
              <div className="flex border-b">
                <div className="w-60 sm:w-72 lg:w-80 p-2 sm:p-4 font-semibold bg-muted/30 border-r">
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base">Tarefa</span>
                    <div className="text-xs text-muted-foreground hidden sm:block">
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
                          className="px-1 sm:px-2 py-1 text-center text-xs sm:text-sm font-medium border-r border-border/50 last:border-r-0 bg-muted/50"
                          style={{ flexBasis: `${flexBasis}%` }}
                        >
                          <span className="hidden sm:inline">{monthYear}</span>
                          <span className="sm:hidden">
                            {calendarDays[0]?.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })}
                          </span>
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
                          className={`flex-1 p-1 sm:p-2 text-center text-xs border-r border-border last:border-r-0 ${
                            isToday ? 'bg-primary/20 font-bold' : ''
                          } ${isWeekend ? 'bg-muted/50' : ''}`}
                        >
                          <div className={`font-medium ${isToday ? 'text-primary' : ''}`}>
                            {day.toLocaleDateString('pt-BR', { day: '2-digit' })}
                          </div>
                          <div className={`text-muted-foreground hidden sm:block ${isToday ? 'text-primary/70' : ''}`}>
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
                    <div key={task.id} className="flex hover:bg-muted/30 transition-colors min-h-[60px] sm:min-h-[80px]">
                      {/* Coluna da tarefa */}
                      <div className="w-60 sm:w-72 lg:w-80 p-2 sm:p-4 border-r">
                        <div className="space-y-1 sm:space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-xs sm:text-sm truncate">
                                {task.name}
                              </h4>
                              {task.milestone && (
                                <Badge variant="outline" className="mt-1 text-xs">
                                  Marco
                                </Badge>
                              )}
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-5 w-5 sm:h-6 sm:w-6 p-0 flex-shrink-0">
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
                            <div className={`h-2 w-2 rounded-full flex-shrink-0 ${getPriorityColor(task.priority)}`} />
                            <Badge className={`${getStatusBadgeColor(task.status)} text-xs`}>
                              <span className="hidden sm:inline">{getStatusIcon(task.status)}</span>
                              <span className="sm:ml-1 text-xs">{task.status}</span>
                            </Badge>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">{task.assignee}</span>
                            </div>
                            {project && (
                              <div className="flex items-center gap-1">
                                <div 
                                  className="h-2 w-2 rounded-full flex-shrink-0" 
                                  style={{ backgroundColor: project.color }}
                                />
                                <span className="truncate hidden sm:inline">{project.name}</span>
                                <span className="truncate sm:hidden">{project.name.substring(0, 10)}...</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="text-xs text-muted-foreground">
                            <span className="hidden sm:inline">{task.progress}% concluído</span>
                            <span className="sm:hidden">{task.progress}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Área do gráfico */}
                      <div className="flex-1 p-2 sm:p-4 relative">
                        {/* Linha de grade vertical */}
                        <div className="absolute inset-0 flex">
                          {calendarDays.map((day, index) => {
                            const isToday = day.toDateString() === new Date().toDateString();
                            const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                            
                            return (
                              <div 
                                key={index} 
                                className={`flex-1 border-r last:border-r-0 ${
                                  isWeekend ? 'border-border/30 bg-muted/20' : 'border-border/30'
                                } ${
                                  isToday ? 'bg-primary/10 border-primary/30' : ''
                                }`}
                              />
                            );
                          })}
                        </div>
                        
                        {/* Linha indicadora de hoje */}
                        {(() => {
                          const today = new Date();
                          const todayIndex = calendarDays.findIndex(day => 
                            day.toDateString() === today.toDateString()
                          );
                          
                          if (todayIndex >= 0) {
                            const leftPosition = (todayIndex / calendarDays.length) * 100;
                            return (
                              <div 
                                className="absolute top-0 bottom-0 w-0.5 bg-primary/60 z-10"
                                style={{ left: `${leftPosition}%` }}
                              >
                                <div className="absolute -top-1 sm:-top-2 -left-1 sm:-left-2 w-2 h-2 sm:w-4 sm:h-4 bg-primary rounded-full opacity-80" />
                              </div>
                            );
                          }
                          return null;
                        })()}
                        
                        {/* Barra da tarefa */}
                        <div 
                          className="relative h-4 sm:h-6 rounded group cursor-pointer"
                          style={taskBarStyle}
                          title={`${task.name} (${task.progress}% concluído)`}
                        >
                          <div className={`h-full rounded ${getStatusColor(task.status)} opacity-90 hover:opacity-100 transition-opacity shadow-sm`}>
                            {/* Barra de progresso */}
                            <div 
                              className="h-full bg-white/20 rounded transition-all duration-300"
                              style={{ width: `${task.progress}%` }}
                            />
                            
                            {/* Indicador de milestone */}
                            {task.milestone && (
                              <div className="absolute -top-1 sm:-top-2 left-1/2 transform -translate-x-1/2">
                                <div className="w-0 h-0 border-l-2 border-r-2 border-b-2 sm:border-l-4 sm:border-r-4 sm:border-b-4 border-transparent border-b-yellow-500" />
                              </div>
                            )}
                            
                            {/* Indicador de prioridade */}
                            <div className={`absolute -left-0.5 sm:-left-1 top-0 w-0.5 sm:w-1 h-full rounded-l ${getPriorityColor(task.priority)}`} />
                          </div>
                          
                          {/* Label da tarefa */}
                          <div className="absolute inset-0 flex items-center px-1 sm:px-2">
                            <span className="text-white text-xs font-medium truncate drop-shadow-sm">
                              <span className="hidden sm:inline">{task.name}</span>
                              <span className="sm:hidden">{task.name.substring(0, 15)}...</span>
                            </span>
                            <span className="ml-auto text-white/80 text-xs font-medium hidden sm:inline">
                              {task.progress}%
                            </span>
                          </div>
                          
                          {/* Tooltip expandido no hover - apenas desktop */}
                          <div className="absolute bottom-8 left-0 bg-gray-900 text-white p-2 rounded shadow-lg text-xs z-10 min-w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden lg:block">
                            <div className="font-medium">{task.name}</div>
                            <div className="text-gray-300 mt-1">{task.description}</div>
                            <div className="flex justify-between mt-2 text-gray-400">
                              <span>{new Date(task.startDate).toLocaleDateString('pt-BR')}</span>
                              <span>{new Date(task.endDate).toLocaleDateString('pt-BR')}</span>
                            </div>
                            <div className="mt-1">
                              <span className="text-gray-400">Responsável: </span>
                              <span className="text-white">{task.assignee}</span>
                            </div>
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
              <Select value={formData.status} onValueChange={(value: 'not-started' | 'in-progress' | 'completed' | 'delayed' | 'paused') => setFormData({...formData, status: value})}>
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
