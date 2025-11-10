"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { X, AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface BaseModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: "sm" | "md" | "lg" | "xl" | "full"
  closable?: boolean
}

const Modal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  closable = true
}) => {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && closable) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose, closable])

  if (!isOpen) return null

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-4xl"
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closable ? onClose : undefined}
      />
      
      {/* Modal */}
      <div
        className={cn(
          "relative bg-background border rounded-lg shadow-lg w-full mx-4",
          sizeClasses[size],
          "animate-in fade-in-0 zoom-in-95 duration-200"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">{title}</h2>
          {closable && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: "default" | "destructive" | "warning"
  icon?: React.ReactNode
  loading?: boolean
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "default",
  icon,
  loading = false
}) => {
  const [isLoading, setIsLoading] = React.useState(false)

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      await onConfirm()
      onClose()
    } catch (error) {
      console.error("Erro ao confirmar:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const variantIcons = {
    default: <Info className="h-6 w-6 text-blue-500" />,
    destructive: <AlertTriangle className="h-6 w-6 text-red-500" />,
    warning: <AlertTriangle className="h-6 w-6 text-yellow-500" />
  }

  const variantButtons = {
    default: "default",
    destructive: "destructive",
    warning: "default"
  } as const

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {icon || variantIcons[variant]}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {message}
          </p>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading || loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={variantButtons[variant]}
            onClick={handleConfirm}
            disabled={isLoading || loading}
          >
            {isLoading || loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                <span>Processando...</span>
              </div>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

interface FormField {
  name: string
  label: string
  type: "text" | "email" | "password" | "textarea" | "number" | "date"
  placeholder?: string
  required?: boolean
  defaultValue?: string
}

interface FormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Record<string, string>) => void | Promise<void>
  title: string
  fields: FormField[]
  submitText?: string
  cancelText?: string
  loading?: boolean
}

const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  fields,
  submitText = "Salvar",
  cancelText = "Cancelar",
  loading = false
}) => {
  const [formData, setFormData] = React.useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    if (isOpen) {
      const initialData: Record<string, string> = {}
      fields.forEach(field => {
        initialData[field.name] = field.defaultValue || ""
      })
      setFormData(initialData)
    }
  }, [isOpen, fields])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await onSubmit(formData)
      onClose()
    } catch (error) {
      console.error("Erro ao enviar formulário:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map(field => (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {field.type === "textarea" ? (
              <Textarea
                id={field.name}
                placeholder={field.placeholder}
                value={formData[field.name] || ""}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                required={field.required}
              />
            ) : (
              <Input
                id={field.name}
                type={field.type}
                placeholder={field.placeholder}
                value={formData[field.name] || ""}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                required={field.required}
              />
            )}
          </div>
        ))}

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading || loading}
          >
            {cancelText}
          </Button>
          <Button
            type="submit"
            disabled={isLoading || loading}
          >
            {isLoading || loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                <span>Salvando...</span>
              </div>
            ) : (
              submitText
            )}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

interface DetailModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  data: Record<string, unknown>
  actions?: Array<{
    label: string
    onClick: () => void
    variant?: "default" | "destructive" | "outline"
    icon?: React.ReactNode
  }>
}

const DetailModal: React.FC<DetailModalProps> = ({
  isOpen,
  onClose,
  title,
  data,
  actions = []
}) => {
  const renderValue = (value: unknown): React.ReactNode => {
    if (value === null || value === undefined) {
      return <span className="text-muted-foreground">-</span>
    }
    
    if (typeof value === "boolean") {
      return (
        <div className="flex items-center space-x-1">
          {value ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <XCircle className="h-4 w-4 text-red-500" />
          )}
          <span>{value ? "Sim" : "Não"}</span>
        </div>
      )
    }
    
    if (Array.isArray(value)) {
      return (
        <div className="space-y-1">
          {value.map((item, index) => (
            <div key={index} className="text-sm bg-muted px-2 py-1 rounded">
              {typeof item === "object" ? JSON.stringify(item) : String(item)}
            </div>
          ))}
        </div>
      )
    }
    
    if (typeof value === "object") {
      return (
        <pre className="text-sm bg-muted p-2 rounded overflow-auto">
          {JSON.stringify(value, null, 2)}
        </pre>
      )
    }
    
    return <span>{String(value)}</span>
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="lg">
      <div className="space-y-6">
        <div className="grid gap-4">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="grid grid-cols-3 gap-4 py-2 border-b">
              <div className="font-medium text-sm">
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}
              </div>
              <div className="col-span-2 text-sm">
                {renderValue(value)}
              </div>
            </div>
          ))}
        </div>

        {actions.length > 0 && (
          <div className="flex justify-end space-x-2 pt-4 border-t">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || "default"}
                onClick={action.onClick}
                className="flex items-center space-x-2"
              >
                {action.icon}
                <span>{action.label}</span>
              </Button>
            ))}
          </div>
        )}
      </div>
    </Modal>
  )
}

export {
  Modal,
  ConfirmModal,
  FormModal,
  DetailModal
}
