"use client";

import { useState, useEffect, useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  closestCorners,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Calendar, Clock, Star } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import { useUsers } from "@/hooks/useUsers";
import { Task } from "@/types/task";
import { User } from "@/types/user";
import { LoadingSpinner } from "@/components/custom/loading";
import { useToast } from "@/components/custom/feedback";

type TaskWithAssignee = Task & { assignee?: User };

interface KanbanColumn {
  id: string;
  title: string;
  tasks: TaskWithAssignee[];
  color: string;
}

const columnConfig: Omit<KanbanColumn, "tasks">[] = [
  { id: "todo", title: "A Fazer", color: "bg-gray-100 border-gray-300" },
  { id: "in-progress", title: "Em Progresso", color: "bg-blue-100 border-blue-300" },
  { id: "review", title: "Em Revisão", color: "bg-yellow-100 border-yellow-300" },
  { id: "completed", title: "Concluído", color: "bg-green-100 border-green-300" },
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "urgent":
      return "bg-red-500";
    case "high":
      return "bg-orange-500";
    case "medium":
      return "bg-yellow-500";
    case "low":
      return "bg-green-500";
    default:
      return "bg-gray-500";
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

function KanbanTaskCard({ task }: { task: TaskWithAssignee }) {
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

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow ${
        isDragging ? "shadow-lg" : ""
      } ${isOverdue ? "border-red-200 bg-red-50" : ""}`}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-2 flex-1">
              {task.starred && (
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mt-0.5 flex-shrink-0" />
              )}
              <h4 className="font-medium text-sm leading-tight">{task.title}</h4>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Editar</DropdownMenuItem>
                <DropdownMenuItem>Duplicar</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">Excluir</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {task.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                <span className="text-muted-foreground">{getPriorityLabel(task.priority)}</span>
              </div>
            </div>

            {task.dueDate && (
              <div className="flex items-center space-x-1 text-xs">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span className={`${isOverdue ? "text-red-600 font-medium" : "text-muted-foreground"}`}>
                  {new Date(task.dueDate).toLocaleDateString("pt-BR")}
                </span>
                {task.estimatedHours && (
                  <>
                    <Clock className="h-3 w-3 text-muted-foreground ml-2" />
                    <span className="text-muted-foreground">{task.estimatedHours}h</span>
                  </>
                )}
              </div>
            )}

            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {task.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs px-1 py-0">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {task.assignee && (
              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                  <AvatarFallback className="text-xs">
                    {task.assignee.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">{task.assignee.name}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function KanbanColumnComponent({ column, tasks }: { column: KanbanColumn; tasks: TaskWithAssignee[] }) {
  const { setNodeRef } = useSortable({ id: column.id });
  return (
    <div ref={setNodeRef} className="flex flex-col w-80 flex-shrink-0">
      <div className={`rounded-t-lg border-2 ${column.color} p-4`}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">{column.title}</h3>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-xs">
              {tasks.length}
            </Badge>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      <div className={`border-2 border-t-0 ${column.color} rounded-b-lg p-2 min-h-[600px] bg-gray-50/50`}>
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {tasks.map((task) => (
              <KanbanTaskCard key={task.id} task={task} />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}

export default function Kanban({ projectId }: { projectId?: string }) {
  const { tasks: allTasks, loading: tasksLoading, updateTask } = useTasks();
  const { users, loading: usersLoading } = useUsers();
  const { addNotification } = useToast();
  const [columns, setColumns] = useState<KanbanColumn[]>([]);
  const [activeTask, setActiveTask] = useState<TaskWithAssignee | null>(null);

  const projectTasks = useMemo(() => {
    return projectId ? allTasks.filter((task) => task.projectId === projectId) : allTasks;
  }, [allTasks, projectId]);

  useEffect(() => {
    if (projectTasks.length > 0 && users.length > 0) {
      const tasksWithAssignees = projectTasks.map((task) => ({
        ...task,
        assignee: users.find((u) => u.id === task.assigneeId),
      }));

      const newColumns = columnConfig.map((colConf) => ({
        ...colConf,
        tasks: tasksWithAssignees.filter((task) => task.status === colConf.id),
      }));
      setColumns(newColumns);
    } else if (projectTasks.length === 0) {
      const emptyColumns = columnConfig.map((colConf) => ({ ...colConf, tasks: [] }));
      setColumns(emptyColumns);
    }
  }, [projectTasks, users]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findTask = (id: string) => {
    for (const column of columns) {
      const task = column.tasks.find((task) => task.id === id);
      if (task) return { task, columnId: column.id };
    }
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const taskData = findTask(event.active.id as string);
    if (taskData) {
      setActiveTask(taskData.task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeColumn = columns.find((col) => col.tasks.some((t) => t.id === activeId));
    let overColumn = columns.find((col) => col.id === overId);
    if (!overColumn) {
      overColumn = columns.find((col) => col.tasks.some((t) => t.id === overId));
    }

    if (!activeColumn || !overColumn || activeColumn === overColumn) {
      return;
    }

    setColumns((prev) => {
      const activeItems = activeColumn.tasks;
      const overItems = overColumn.tasks;

      const activeIndex = activeItems.findIndex((t) => t.id === activeId);

      const [movedItem] = activeItems.splice(activeIndex, 1);
      overItems.push(movedItem);

      return [...prev];
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;

    if (!over) return;

    const activeTaskData = findTask(active.id as string);
    if (!activeTaskData) return;

    const sourceColumnId = activeTaskData.columnId;
    let targetColumnId = over.id as string;

    const overIsColumn = columnConfig.some((c) => c.id === over.id);
    if (!overIsColumn) {
      const overTaskData = findTask(over.id as string);
      if (!overTaskData) return;
      targetColumnId = overTaskData.columnId;
    }

    if (sourceColumnId !== targetColumnId) {
      updateTask(active.id as string, { status: targetColumnId as Task["status"] });
      addNotification({
        type: "success",
        message: "Status da tarefa atualizado!",
        duration: 3000,
      });
    } else {
      const columnIndex = columns.findIndex((c) => c.id === sourceColumnId);
      if (columnIndex !== -1) {
        const oldIndex = columns[columnIndex].tasks.findIndex((t) => t.id === active.id);
        const newIndex = columns[columnIndex].tasks.findIndex((t) => t.id === over.id);
        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          const newOrderedTasks = arrayMove(columns[columnIndex].tasks, oldIndex, newIndex);
          const newColumns = [...columns];
          newColumns[columnIndex] = {
            ...newColumns[columnIndex],
            tasks: newOrderedTasks,
          };
          setColumns(newColumns);
        }
      }
    }
  };

  if (tasksLoading || usersLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Kanban{projectId ? ` - Projeto ${projectId}` : ""}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kanban{projectId ? ` - Projeto ${projectId}` : ""}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto pb-4">
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            collisionDetection={closestCorners}
          >
            <div className="flex space-x-6 min-w-max">
              <SortableContext items={columns.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                {columns.map((column) => (
                  <KanbanColumnComponent key={column.id} column={column} tasks={column.tasks} />
                ))}
              </SortableContext>
            </div>

            <DragOverlay>
              {activeTask ? (
                <div className="rotate-6 opacity-90">
                  <KanbanTaskCard task={activeTask} />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </CardContent>
    </Card>
  );
}
