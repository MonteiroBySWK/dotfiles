import { ReactNode, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface FormDialogProps {
  trigger?: ReactNode
  title: string
  description?: string
  children: ReactNode
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onSubmit?: () => void | Promise<void>
  onCancel?: () => void
  submitLabel?: string
  cancelLabel?: string
  isSubmitting?: boolean
  submitDisabled?: boolean
  className?: string
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl"
  maxHeight?: boolean
}

const maxWidthClasses = {
  sm: "sm:max-w-[425px]",
  md: "sm:max-w-[600px]",
  lg: "sm:max-w-[800px]",
  xl: "sm:max-w-[1000px]",
  "2xl": "sm:max-w-[1200px]"
}

export function FormDialog({
  trigger,
  title,
  description,
  children,
  isOpen,
  onOpenChange,
  onSubmit,
  onCancel,
  submitLabel = "Salvar",
  cancelLabel = "Cancelar",
  isSubmitting = false,
  submitDisabled = false,
  className,
  maxWidth = "md",
  maxHeight = true
}: FormDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  
  const open = isOpen !== undefined ? isOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen

  const handleSubmit = async () => {
    if (onSubmit) {
      await onSubmit()
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      setOpen(false)
    }
  }

  const contentClassName = cn(
    maxWidthClasses[maxWidth],
    maxHeight && "max-h-[80vh]",
    className
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      )}
      <DialogContent className={contentClassName}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>
        
        {maxHeight ? (
          <ScrollArea className="max-h-96 overflow-y-auto">
            <div className="space-y-4 pr-4">
              {children}
            </div>
          </ScrollArea>
        ) : (
          <div className="space-y-4">
            {children}
          </div>
        )}
        
        {(onSubmit || onCancel) && (
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              {cancelLabel}
            </Button>
            {onSubmit && (
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting || submitDisabled}
              >
                {isSubmitting ? "Salvando..." : submitLabel}
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
