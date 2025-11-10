"use client";

import React, { useState } from 'react';
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

// Tipos
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

// Dados iniciais
const initialColumns: Column[] = [
  {
    id: 'todo',
    title: 'To Do',
    color: 'bg-gray-100',
    tasks: [
      {
        id: 'task-1',
        title: 'Implementar autenticação',
        description: 'Criar sistema de login e registro de usuários',
        assignee: 'Ana Silva',
        priority: 'high',
        tags: ['Backend', 'Security'],
        dueDate: '2025-09-25',
        estimatedHours: 8
      },
      {
        id: 'task-2',
        title: 'Design da homepage',
        description: 'Criar wireframes e protótipo da página inicial',
        assignee: 'Carla Oliveira',
        priority: 'medium',
        tags: ['Design', 'UI/UX'],
        dueDate: '2025-09-23',
        estimatedHours: 12
      }
    ]
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    color: 'bg-blue-100',
    tasks: [
      {
        id: 'task-3',
        title: 'API de produtos',
        description: 'Desenvolver endpoints para CRUD de produtos',
        assignee: 'Bruno Santos',
        priority: 'high',
        tags: ['Backend', 'API'],
        dueDate: '2025-09-24',
        estimatedHours: 16
      }
    ]
  },
  {
    id: 'review',
    title: 'Review',
    color: 'bg-yellow-100',
    tasks: [
      {
        id: 'task-4',
        title: 'Testes unitários',
        description: 'Implementar testes para módulo de usuários',
        assignee: 'Felipe Lima',
        priority: 'medium',
        tags: ['Testing', 'Quality'],
        dueDate: '2025-09-22',
        estimatedHours: 6
      }
    ]
  },
  {
    id: 'done',
    title: 'Done',
    color: 'bg-green-100',
    tasks: [
      {
        id: 'task-5',
        title: 'Setup do projeto',
        description: 'Configuração inicial do ambiente de desenvolvimento',
        assignee: 'Diego Costa',
        priority: 'low',
        tags: ['DevOps', 'Setup'],
        dueDate: '2025-09-20',
        estimatedHours: 4
      }
    ]
  }
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
      <Card className="mb-3 hover:shadow-md transition-shadow bg-white border border-gray-200">
        <CardContent className="p-3">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-medium text-sm text-gray-900 leading-tight">
              {task.title}
            </h4>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Editar</DropdownMenuItem>
                <DropdownMenuItem>Duplicar</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">Excluir</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {task.description && (
            <p className="text-xs text-gray-600 mb-3 line-clamp-2">
              {task.description}
            </p>
          )}
          
          <div className="flex flex-wrap gap-1 mb-3">
            {task.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs px-2 py-0">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {task.assignee && (
                <Avatar className="h-6 w-6">
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-semibold">
                    {task.assignee.split(' ').map(n => n[0]).join('')}
                  </div>
                </Avatar>
              )}
              
              <div className={`h-2 w-2 rounded-full ${getPriorityColor(task.priority)}`} />
              {getPriorityIcon(task.priority)}
            </div>
            
            <div className="flex items-center gap-2 text-xs text-gray-500">
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
      <div className={`${column.color} rounded-lg p-4`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-800">{column.title}</h3>
            <Badge variant="secondary" className="bg-white/70 text-gray-700">
              {column.tasks.length}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-white/50"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <SortableContext items={column.tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {column.tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </SortableContext>
        
        <Button 
          variant="ghost" 
          className="w-full mt-2 h-8 text-gray-600 hover:bg-white/50 border-2 border-dashed border-gray-300"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar card
        </Button>
      </div>
    </div>
  );
}

// Componente principal do Kanban
export default function Kanban() {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

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
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kanban Board</h1>
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