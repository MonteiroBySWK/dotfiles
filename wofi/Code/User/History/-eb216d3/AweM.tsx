import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type Status = 
  | "active" | "inactive" | "pending" | "completed" | "cancelled" | "paused"
  | "open" | "closed" | "in-progress" | "review" | "todo"
  | "paid" | "unpaid" | "overdue" | "draft"
  | "low" | "medium" | "high" | "urgent"
  | "success" | "warning" | "error" | "info"

interface StatusBadgeProps {
  status: Status | string
  children?: React.ReactNode
  className?: string
}

const statusConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", className: string }> = {
  // Project/Task Status
  active: { variant: "default", className: "bg-green-100 text-green-800 border-green-300" },
  inactive: { variant: "secondary", className: "bg-gray-100 text-gray-800 border-gray-300" },
  pending: { variant: "outline", className: "bg-yellow-100 text-yellow-800 border-yellow-300" },
  completed: { variant: "default", className: "bg-green-100 text-green-800 border-green-300" },
  cancelled: { variant: "destructive", className: "bg-red-100 text-red-800 border-red-300" },
  paused: { variant: "outline", className: "bg-orange-100 text-orange-800 border-orange-300" },
  
  // Ticket Status
  open: { variant: "default", className: "bg-blue-100 text-blue-800 border-blue-300" },
  closed: { variant: "secondary", className: "bg-gray-100 text-gray-800 border-gray-300" },
  "in-progress": { variant: "outline", className: "bg-yellow-100 text-yellow-800 border-yellow-300" },
  review: { variant: "outline", className: "bg-purple-100 text-purple-800 border-purple-300" },
  todo: { variant: "outline", className: "bg-gray-100 text-gray-800 border-gray-300" },
  
  // Payment Status
  paid: { variant: "default", className: "bg-green-100 text-green-800 border-green-300" },
  unpaid: { variant: "destructive", className: "bg-red-100 text-red-800 border-red-300" },
  overdue: { variant: "destructive", className: "bg-red-100 text-red-800 border-red-300" },
  draft: { variant: "outline", className: "bg-gray-100 text-gray-800 border-gray-300" },
  
  // Priority
  low: { variant: "outline", className: "bg-gray-100 text-gray-800 border-gray-300" },
  medium: { variant: "outline", className: "bg-yellow-100 text-yellow-800 border-yellow-300" },
  high: { variant: "outline", className: "bg-orange-100 text-orange-800 border-orange-300" },
  urgent: { variant: "destructive", className: "bg-red-100 text-red-800 border-red-300" },
  
  // General
  success: { variant: "default", className: "bg-green-100 text-green-800 border-green-300" },
  warning: { variant: "outline", className: "bg-yellow-100 text-yellow-800 border-yellow-300" },
  error: { variant: "destructive", className: "bg-red-100 text-red-800 border-red-300" },
  info: { variant: "outline", className: "bg-blue-100 text-blue-800 border-blue-300" },
}

export function StatusBadge({ status, children, className }: StatusBadgeProps) {
  const config = statusConfig[status.toLowerCase()] || statusConfig.info
  
  return (
    <Badge 
      variant={config.variant}
      className={cn(config.className, className)}
    >
      {children || status}
    </Badge>
  )
}
