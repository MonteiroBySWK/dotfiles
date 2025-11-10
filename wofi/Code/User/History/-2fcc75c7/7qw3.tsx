import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ActionItem {
  key: string
  label: string
  icon?: LucideIcon
  onClick: () => void
  variant?: "default" | "destructive"
  disabled?: boolean
}

interface ActionDropdownProps {
  actions: ActionItem[]
  trigger?: React.ReactNode
  label?: string
  className?: string
  triggerClassName?: string
}

export function ActionDropdown({
  actions,
  trigger,
  label = "Ações",
  className,
  triggerClassName
}: ActionDropdownProps) {
  const visibleActions = actions.filter(action => !action.disabled)
  
  if (visibleActions.length === 0) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger || (
          <Button 
            variant="ghost" 
            className={cn("h-8 w-8 p-0", triggerClassName)}
          >
            <span className="sr-only">{label}</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={className}>
        {label && (
          <>
            <DropdownMenuLabel>{label}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        {visibleActions.map((action, index) => {
          const Icon = action.icon
          const isDestructive = action.variant === "destructive"
          
          return (
            <DropdownMenuItem
              key={action.key}
              onClick={action.onClick}
              className={cn(
                "cursor-pointer",
                isDestructive && "text-destructive focus:text-destructive"
              )}
            >
              {Icon && <Icon className="mr-2 h-4 w-4" />}
              {action.label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
