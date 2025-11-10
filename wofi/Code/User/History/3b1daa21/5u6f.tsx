"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { CheckCircle, AlertCircle, XCircle, Info, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NotificationProps {
  id?: string
  type?: "success" | "error" | "warning" | "info"
  title?: string
  message: string
  duration?: number
  onClose?: () => void
  action?: {
    label: string
    onClick: () => void
  }
}

const Notification: React.FC<NotificationProps> = ({
  type = "info",
  title,
  message,
  duration = 5000,
  onClose,
  action
}) => {
  const [isVisible, setIsVisible] = React.useState(true)

  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => onClose?.(), 300)
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const icons = {
    success: <CheckCircle className="h-5 w-5" />,
    error: <XCircle className="h-5 w-5" />,
    warning: <AlertCircle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />
  }

  const colors = {
    success: "border-green-200 bg-green-50 text-green-800",
    error: "border-red-200 bg-red-50 text-red-800", 
    warning: "border-yellow-200 bg-yellow-50 text-yellow-800",
    info: "border-blue-200 bg-blue-50 text-blue-800"
  }

  const iconColors = {
    success: "text-green-500",
    error: "text-red-500",
    warning: "text-yellow-500", 
    info: "text-blue-500"
  }

  return (
    <div
      className={cn(
        "border rounded-lg p-4 shadow-sm transition-all duration-300 max-w-md",
        colors[type],
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 -translate-y-2 pointer-events-none"
      )}
    >
      <div className="flex items-start space-x-3">
        <div className={cn("flex-shrink-0", iconColors[type])}>
          {icons[type]}
        </div>
        <div className="flex-1 min-w-0">
          {title && (
            <p className="text-sm font-medium">
              {title}
            </p>
          )}
          <p className={cn("text-sm", title && "mt-1")}>
            {message}
          </p>
          {action && (
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={action.onClick}
                className="text-xs"
              >
                {action.label}
              </Button>
            </div>
          )}
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsVisible(false)
              setTimeout(() => onClose(), 300)
            }}
            className="flex-shrink-0 h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

interface ToastContextType {
  notifications: (NotificationProps & { id: string })[]
  addNotification: (notification: Omit<NotificationProps, "id">) => void
  removeNotification: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast deve ser usado dentro de ToastProvider")
  }
  return context
}

interface ToastProviderProps {
  children: React.ReactNode
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = React.useState<(NotificationProps & { id: string })[]>([])

  const addNotification = React.useCallback((notification: Omit<NotificationProps, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    setNotifications(prev => [...prev, { ...notification, id }])
  }, [])

  const removeNotification = React.useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            {...notification}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: "default" | "destructive"
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "default"
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background border rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6">{message}</p>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            {cancelText}
          </Button>
          <Button 
            variant={variant === "destructive" ? "destructive" : "default"}
            onClick={() => {
              onConfirm()
              onClose()
            }}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}

interface FeedbackButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
  loading?: boolean
  success?: boolean
  error?: boolean
}

const FeedbackButton: React.FC<FeedbackButtonProps> = ({
  children,
  onClick,
  className,
  disabled,
  loading,
  success,
  error
}) => {
  const [isPressed, setIsPressed] = React.useState(false)

  const handleClick = () => {
    setIsPressed(true)
    setTimeout(() => setIsPressed(false), 150)
    onClick?.()
  }

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || loading}
      className={cn(
        "transition-all duration-150",
        isPressed && "scale-95",
        success && "bg-green-500 hover:bg-green-600",
        error && "bg-red-500 hover:bg-red-600",
        className
      )}
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
          <span>Carregando...</span>
        </div>
      ) : success ? (
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-4 w-4" />
          <span>Sucesso!</span>
        </div>
      ) : error ? (
        <div className="flex items-center space-x-2">
          <XCircle className="h-4 w-4" />
          <span>Erro</span>
        </div>
      ) : (
        children
      )}
    </Button>
  )
}

export { 
  Notification, 
  ConfirmDialog, 
  FeedbackButton 
}
