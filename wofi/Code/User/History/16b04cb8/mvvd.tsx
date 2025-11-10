"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Plus,
	Search,
	Filter,
	MoreHorizontal,
	Calendar,
	Clock,
	Flag,
	Star,
} from "lucide-react";
import { FadeIn } from "@/components/custom/animations";
import { useToast } from "@/components/custom/feedback";
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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTasks } from "@/hooks/useTasks";
import { useUsers } from "@/hooks/useUsers";
import { Task } from "@/types/task";
import { User } from "@/types/user";
import { LoadingSpinner } from "@/components/custom/loading";

type TaskWithAssignee = Task & { assignee?: User };

interface KanbanColumn {
	id: string;
	title: string;
	tasks: TaskWithAssignee[];
	color: string;
	limit?: number;
}

const columnConfig: Omit<KanbanColumn, "tasks">[] = [
	{ id: "todo", title: "A Fazer", color: "bg-gray-100 border-gray-300" },
	{
		id: "in-progress",
		title: "Em Progresso",
		color: "bg-blue-100 border-blue-300",
		limit: 3,
	},
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
							<h4 className="font-medium text-sm leading-tight">
								{task.title}
							</h4>
						</div>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="sm"
									className="h-6 w-6 p-0"
								>
									<MoreHorizontal className="h-3 w-3" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem>Editar</DropdownMenuItem>
								<DropdownMenuItem>Duplicar</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem className="text-red-600">
									Excluir
								</DropdownMenuItem>
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
								<div
									className={`w-2 h-2 rounded-full ${getPriorityColor(
										task.priority
									)}`}
								/>
								<span className="text-muted-foreground">
									{getPriorityLabel(task.priority)}
								</span>
							</div>
							{task.projectId && (
								<Badge
									variant="outline"
									className="text-xs px-1 py-0"
								>
									{task.projectId}
								</Badge>
							)}
						</div>

						{task.dueDate && (
							<div className="flex items-center space-x-1 text-xs">
								<Calendar className="h-3 w-3 text-muted-foreground" />
								<span
									className={`${
										isOverdue
											? "text-red-600 font-medium"
											: "text-muted-foreground"
									}`}
								>
									{new Date(task.dueDate).toLocaleDateString("pt-BR")}
								</span>
								{task.estimatedHours && (
									<>
										<Clock className="h-3 w-3 text-muted-foreground ml-2" />
										<span className="text-muted-foreground">
											{task.estimatedHours}h
										</span>
									</>
								)}
							</div>
						)}

						{task.tags && task.tags.length > 0 && (
							<div className="flex flex-wrap gap-1">
								{task.tags.slice(0, 3).map((tag) => (
									<Badge
										key={tag}
										variant="secondary"
										className="text-xs px-1 py-0"
									>
										{tag}
									</Badge>
								))}
								{task.tags.length > 3 && (
									<Badge
										variant="secondary"
										className="text-xs px-1 py-0"
									>
										+{task.tags.length - 3}
									</Badge>
								)}
							</div>
						)}

						{task.assignee && (
							<div className="flex items-center space-x-2">
								<Avatar className="h-6 w-6">
									<AvatarImage
										src={task.assignee.avatar}
										alt={task.assignee.name}
									/>
									<AvatarFallback className="text-xs">
										{task.assignee.name
											.split(" ")
											.map((n) => n[0])
											.join("")}
									</AvatarFallback>
								</Avatar>
								<span className="text-xs text-muted-foreground">
									{task.assignee.name}
								</span>
							</div>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

function KanbanColumn({
	column,
	tasks,
}: {
	column: KanbanColumn;
	tasks: TaskWithAssignee[];
}) {
	const { setNodeRef } = useSortable({ id: column.id });
	return (
		<div ref={setNodeRef} className="flex flex-col w-80 flex-shrink-0">
			<div className={`rounded-t-lg border-2 ${column.color} p-4`}>
				<div className="flex items-center justify-between">
					<h3 className="font-semibold text-sm">{column.title}</h3>
					<div className="flex items-center space-x-2">
						<Badge variant="secondary" className="text-xs">
							{tasks.length}
							{column.limit && `/${column.limit}`}
						</Badge>
						<Button
							variant="ghost"
							size="sm"
							className="h-6 w-6 p-0"
						>
							<Plus className="h-3 w-3" />
						</Button>
					</div>
				</div>
			</div>

			<div
				className={`border-2 border-t-0 ${column.color} rounded-b-lg p-2 min-h-[600px] bg-gray-50/50`}
			>
				<SortableContext
					items={tasks.map((t) => t.id)}
					strategy={verticalListSortingStrategy}
				>
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

export default function KanbanPage() {
	const { tasks: allTasks, loading: tasksLoading, updateTask } = useTasks();
	const { users, loading: usersLoading } = useUsers();
	const { addNotification } = useToast();
	const [columns, setColumns] = useState<KanbanColumn[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [activeTask, setActiveTask] = useState<TaskWithAssignee | null>(null);

	useEffect(() => {
		if (allTasks.length > 0 && users.length > 0) {
			const tasksWithAssignees = allTasks.map((task) => ({
				...task,
				assignee: users.find((u) => u.id === task.assigneeId),
			}));

			const newColumns = columnConfig.map((colConf) => ({
				...colConf,
				tasks: tasksWithAssignees.filter((task) => task.status === colConf.id),
			}));
			setColumns(newColumns);
		}
	}, [allTasks, users]);

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

		// Find the columns
		const activeColumn = columns.find((col) =>
			col.tasks.some((t) => t.id === activeId)
		);
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
			updateTask(active.id as string, {
				status: targetColumnId as Task["status"],
			});
			addNotification({
				type: "success",
				message: "Status da tarefa atualizado!",
				duration: 3000,
			});
		} else {
			// Reorder within the same column
			const columnIndex = columns.findIndex((c) => c.id === sourceColumnId);
			if (columnIndex !== -1) {
				const oldIndex = columns[columnIndex].tasks.findIndex(
					(t) => t.id === active.id
				);
				const newIndex = columns[columnIndex].tasks.findIndex(
					(t) => t.id === over.id
				);
				if (oldIndex !== -1 && newIndex !== -1) {
					const newOrderedTasks = arrayMove(
						columns[columnIndex].tasks,
						oldIndex,
						newIndex
					);
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

	const filteredColumns = useMemo(
		() =>
			columns.map((column) => ({
				...column,
				tasks: column.tasks.filter(
					(task) =>
						task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
						(task.description || "").toLowerCase().includes(
							searchQuery.toLowerCase()
						) ||
						(task.assignee?.name || "").toLowerCase().includes(
							searchQuery.toLowerCase()
						)
				),
			})),
		[columns, searchQuery]
	);

	const totalTasks = allTasks.length;
	const completedTasks = allTasks.filter(
		(t) => t.status === "completed"
	).length;
	const inProgressTasks = allTasks.filter(
		(t) => t.status === "in-progress"
	).length;
	const overdueTasks = allTasks.filter(
		(t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "completed"
	).length;

	if (tasksLoading || usersLoading) {
		return <LoadingSpinner />;
	}

	return (
		<div className="flex-1 space-y-6 p-6">
			<FadeIn>
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">
							Kanban Board
						</h1>
						<p className="text-muted-foreground">
							Visualize e gerencie tarefas com drag & drop
						</p>
					</div>
					<div className="flex items-center space-x-4">
						<div className="flex items-center space-x-2 text-sm text-muted-foreground">
							<span>Total: {totalTasks}</span>
							<span>•</span>
							<span>Concluídas: {completedTasks}</span>
							<span>•</span>
							<span>Em Progresso: {inProgressTasks}</span>
							{overdueTasks > 0 && (
								<>
									<span>•</span>
									<span className="text-red-600">
										Atrasadas: {overdueTasks}
									</span>
								</>
							)}
						</div>
						<Button>
							<Plus className="mr-2 h-4 w-4" />
							Nova Tarefa
						</Button>
					</div>
				</div>
			</FadeIn>

			<FadeIn delay={100}>
				<div className="flex items-center space-x-4">
					<div className="relative flex-1 max-w-md">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
						<Input
							placeholder="Buscar tarefas, pessoas ou projetos..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10"
						/>
					</div>
					<Button variant="outline" size="sm">
						<Filter className="mr-2 h-4 w-4" />
						Filtros
					</Button>
				</div>
			</FadeIn>

			<FadeIn delay={200}>
				<div className="overflow-x-auto pb-4">
					<DndContext
						sensors={sensors}
						onDragStart={handleDragStart}
						onDragEnd={handleDragEnd}
						onDragOver={handleDragOver}
						collisionDetection={closestCorners}
					>
						<div className="flex space-x-6 min-w-max">
							<SortableContext
								items={columns.map((c) => c.id)}
								strategy={verticalListSortingStrategy}
							>
								{filteredColumns.map((column) => (
									<KanbanColumn
										key={column.id}
										column={column}
										tasks={column.tasks}
									/>
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
			</FadeIn>

			<FadeIn delay={300}>
				<div className="border-t pt-4 mt-8">
					<div className="flex items-center justify-between text-sm text-muted-foreground">
						<div className="flex items-center space-x-6">
							<span>Total de tarefas: {totalTasks}</span>
							<span>
								Taxa de conclusão:{" "}
								{totalTasks > 0
									? Math.round((completedTasks / totalTasks) * 100)
									: 0}
								%
							</span>
							<span>Usuários ativos: {users.length}</span>
						</div>
						<div className="flex items-center space-x-2">
							<span>
								Atualizado em{" "}
								{new Date().toLocaleTimeString("pt-BR")}
							</span>
						</div>
					</div>
				</div>
			</FadeIn>
		</div>
	);
}
