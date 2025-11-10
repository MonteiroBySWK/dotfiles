"use client";

import React, { useState, useEffect } from 'react';
import { taskService } from '@/services/TaskService';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Plus, 
  MoreHorizontal, 
  Calendar, 
  User, 
  Tag,
  AlertCircle,
  Clock,
  Flag
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface Task {
  id: string;
  title: string;
  description?: string;
  assignee?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
  dueDate?: string;
  estimatedHours?: number;
}

interface Column {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
}

// initialColumns kept only as a visual placeholder while data loads
const initialColumns: Column[] = [
  { id: 'todo', title: 'To Do', color: 'border-slate-200', tasks: [] },
  { id: 'in-progress', title: 'In Progress', color: 'border-blue-200', tasks: [] },
  { id: 'review', title: 'Review', color: 'border-yellow-200', tasks: [] },
  { id: 'done', title: 'Done', color: 'border-green-200', tasks: [] }
];

// Componente de Card de Task
function TaskCard({ task }: { task: Task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <AlertCircle className="h-3 w-3" />;
      case 'high': return <Flag className="h-3 w-3" />;
      default: return null;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing"
    >
      <Card className="mb-3 hover:shadow-lg transition-all duration-200 bg-card border-border/50 hover:border-border">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <h4 className="font-medium text-sm text-foreground leading-tight">
              {task.title}
            </h4>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-accent">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Editar</DropdownMenuItem>
                <DropdownMenuItem>Duplicar</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {task.description && (
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
              {task.description}
            </p>
          )}
          
          <div className="flex flex-wrap gap-1 mb-3">
            {task.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {task.assignee && (
                <Avatar className="h-6 w-6">
                  <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground text-xs font-semibold">
                    {task.assignee.split(' ').map(n => n[0]).join('')}
                  </div>
                </Avatar>
              )}
              
              <div className={`h-2 w-2 rounded-full ${getPriorityColor(task.priority)}`} />
              {getPriorityIcon(task.priority)}
            </div>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {task.estimatedHours && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {task.estimatedHours}h
                </div>
              )}
              {task.dueDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(task.dueDate).getDate()}/{new Date(task.dueDate).getMonth() + 1}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente de Coluna
function KanbanColumn({ column }: { column: Column }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="flex-1 min-w-[280px] max-w-[320px]"
    >
      <Card className={`${column.color} border-t-4 bg-card/50 backdrop-blur-sm`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">{column.title}</h3>
              <Badge variant="outline" className="bg-background/80">
                {column.tasks.length}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-accent"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <SortableContext items={column.tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {column.tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </SortableContext>
          
          <Button 
            variant="ghost" 
            className="w-full mt-3 h-9 text-muted-foreground hover:bg-accent hover:text-accent-foreground border-2 border-dashed border-border/50 hover:border-border"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar card
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente principal do Kanban
export default function Kanban({ projectId }: { projectId?: string }) {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Load tasks from Firestore via TaskService and partition into columns by status
  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        const tasks = projectId ? await taskService.getTasksByProject(projectId) : await taskService.getTasks()
        if (!mounted) return
        const byStatus: Record<string, Task[]> = { todo: [], 'in-progress': [], review: [], done: [] }
        tasks.forEach(t => {
          const status = t.status || 'todo'
          const taskObj: Task = {
            id: t.id,
            title: t.title,
            description: t.description || '',
            assignee: t.assigneeId || '',
            priority: t.priority || 'low',
            tags: t.tags || [],
            dueDate: t.dueDate ? new Date(t.dueDate).toISOString() : undefined,
            estimatedHours: t.estimatedHours
          }
          if (status === 'todo') byStatus['todo'].push(taskObj)
          else if (status === 'in-progress') byStatus['in-progress'].push(taskObj)
          else if (status === 'review') byStatus['review'].push(taskObj)
          else byStatus['done'].push(taskObj)
        })

        setColumns([
          { id: 'todo', title: 'To Do', color: 'border-slate-200', tasks: byStatus['todo'] },
          { id: 'in-progress', title: 'In Progress', color: 'border-blue-200', tasks: byStatus['in-progress'] },
          { id: 'review', title: 'Review', color: 'border-yellow-200', tasks: byStatus['review'] },
          { id: 'done', title: 'Done', color: 'border-green-200', tasks: byStatus['done'] }
        ])
      } catch (err) {
        console.error('Failed to load tasks for Kanban', err)
      }
    }

    load()

    return () => { mounted = false }
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    
    // Encontrar a task que está sendo arrastada
    const task = columns
      .flatMap(col => col.tasks)
      .find(task => task.id === active.id);
    
    setActiveTask(task || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const activeId = active.id;
    const overId = over.id;
    
    // Encontrar as colunas de origem e destino
    const activeColumn = columns.find(col => 
      col.tasks.some(task => task.id === activeId) || col.id === activeId
    );
    
    const overColumn = columns.find(col => 
      col.tasks.some(task => task.id === overId) || col.id === overId
    );
    
    if (!activeColumn || !overColumn) return;
    if (activeColumn.id === overColumn.id) return;
    
    setColumns(prevColumns => {
      const activeColumnIndex = prevColumns.findIndex(col => col.id === activeColumn.id);
      const overColumnIndex = prevColumns.findIndex(col => col.id === overColumn.id);
      
      const activeTask = activeColumn.tasks.find(task => task.id === activeId);
      if (!activeTask) return prevColumns;
      
      const newColumns = [...prevColumns];
      
      // Remover da coluna original
      newColumns[activeColumnIndex] = {
        ...activeColumn,
        tasks: activeColumn.tasks.filter(task => task.id !== activeId)
      };
      
      // Adicionar à nova coluna
      newColumns[overColumnIndex] = {
        ...overColumn,
        tasks: [...overColumn.tasks, activeTask]
      };
      
      return newColumns;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const activeId = active.id;
    const overId = over.id;
    
    // Encontrar a coluna que contém a task
    const activeColumn = columns.find(col => 
      col.tasks.some(task => task.id === activeId)
    );
    
    if (!activeColumn) return;
    
    const activeIndex = activeColumn.tasks.findIndex(task => task.id === activeId);
    const overIndex = activeColumn.tasks.findIndex(task => task.id === overId);
    
    if (activeIndex !== overIndex && overIndex !== -1) {
      setColumns(prevColumns => {
        const columnIndex = prevColumns.findIndex(col => col.id === activeColumn.id);
        const newColumns = [...prevColumns];

        newColumns[columnIndex] = {
          ...activeColumn,
          tasks: arrayMove(activeColumn.tasks, activeIndex, overIndex)
        };

        return newColumns;
      });
    }
    
    setActiveTask(null);

    // Persist status change when moved between columns
    try {
      const movedToColumn = columns.find(col => col.tasks.some(t => t.id === activeId))
      const newStatus = movedToColumn?.id === 'in-progress' ? 'in-progress' : movedToColumn?.id === 'review' ? 'review' : movedToColumn?.id === 'done' ? 'completed' : 'todo'
      // call taskService to update status
      taskService.updateTaskStatus?.(String(activeId), newStatus as any).catch(() => {})
    } catch (err) {
      // ignore persistence errors for now
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Kanban Board</h1>
          <p className="text-muted-foreground">
            Gerencie suas tarefas com drag and drop
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Tarefa
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto pb-6">
          <SortableContext items={columns.map(col => col.id)} strategy={verticalListSortingStrategy}>
            {columns.map((column) => (
              <KanbanColumn key={column.id} column={column} />
            ))}
          </SortableContext>
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}