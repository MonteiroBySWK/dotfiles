"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Loader2, RefreshCw } from "lucide-react"

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
  variant?: "default" | "dots" | "pulse"
}

const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ className, size = "md", variant = "default", ...props }, ref) => {
    const sizeClasses = {
      sm: "h-4 w-4",
      md: "h-6 w-6", 
      lg: "h-8 w-8"
    }

    if (variant === "dots") {
      return (
        <div 
          ref={ref}
          className={cn("flex space-x-1", className)} 
          {...props}
        >
          <div className={cn(
            "rounded-full bg-primary animate-bounce",
            size === "sm" ? "h-2 w-2" : size === "md" ? "h-3 w-3" : "h-4 w-4"
          )} style={{ animationDelay: "0ms" }} />
          <div className={cn(
            "rounded-full bg-primary animate-bounce",
            size === "sm" ? "h-2 w-2" : size === "md" ? "h-3 w-3" : "h-4 w-4"
          )} style={{ animationDelay: "150ms" }} />
          <div className={cn(
            "rounded-full bg-primary animate-bounce",
            size === "sm" ? "h-2 w-2" : size === "md" ? "h-3 w-3" : "h-4 w-4"
          )} style={{ animationDelay: "300ms" }} />
        </div>
      )
    }

    if (variant === "pulse") {
      return (
        <div 
          ref={ref}
          className={cn(
            "rounded-full bg-primary animate-pulse",
            sizeClasses[size],
            className
          )} 
          {...props}
        />
      )
    }

    return (
      <div 
        ref={ref}
        className={cn(
          "animate-spin rounded-full border-2 border-muted border-t-primary",
          sizeClasses[size],
          className
        )} 
        {...props}
      />
    )
  }
)
LoadingSpinner.displayName = "LoadingSpinner"

interface LoadingStateProps {
  children?: React.ReactNode
  loading?: boolean
  fallback?: React.ReactNode
  className?: string
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  children, 
  loading = false, 
  fallback,
  className 
}) => {
  if (loading) {
    return (
      <div className={cn("flex items-center justify-center p-8", className)}>
        {fallback || <LoadingSpinner />}
      </div>
    )
  }

  return <>{children}</>
}

interface LoadingOverlayProps {
  isLoading: boolean
  children: React.ReactNode
  message?: string
  className?: string
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isLoading, 
  children, 
  message = "Carregando...",
  className 
}) => {
  return (
    <div className={cn("relative", className)}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-200">
          <div className="text-center space-y-2 flex-col items-center">
            <LoadingSpinner size="lg" />
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
        </div>
      )}
    </div>
  )
}

interface SkeletonProps {
  className?: string
  count?: number
  width?: string | number
  height?: string | number
}

const Skeleton: React.FC<SkeletonProps> = ({
  className,
  count = 1,
  width,
  height
}) => {
  const skeletons = Array.from({ length: count }, (_, index) => (
    <div
      key={index}
      className={cn(
        "animate-pulse bg-muted rounded",
        className
      )}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height
      }}
    />
  ))

  return count === 1 ? skeletons[0] : <div className="space-y-2">{skeletons}</div>
}

interface ProgressBarProps {
  value: number
  max?: number
  className?: string
  showValue?: boolean
  color?: "default" | "success" | "warning" | "error"
  size?: "sm" | "md" | "lg"
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  className,
  showValue = false,
  color = "default",
  size = "md"
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const colorClasses = {
    default: "bg-primary",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500"
  }

  const sizeClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3"
  }

  return (
    <div className={cn("space-y-1", className)}>
      <div className={cn("w-full bg-muted rounded-full overflow-hidden", sizeClasses[size])}>
        <div
          className={cn(
            "h-full transition-all duration-300 ease-out",
            colorClasses[color]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showValue && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{value}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  )
}

interface CircularProgressProps {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  className?: string
  showValue?: boolean
  color?: "default" | "success" | "warning" | "error"
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max = 100,
  size = 80,
  strokeWidth = 8,
  className,
  showValue = true,
  color = "default"
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const colorClasses = {
    default: "stroke-primary",
    success: "stroke-green-500",
    warning: "stroke-yellow-500",
    error: "stroke-red-500"
  }

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-muted"
          opacity={0.2}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn("transition-all duration-300 ease-out", colorClasses[color])}
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-medium">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  )
}

interface PulseLoaderProps {
  count?: number
  size?: number
  color?: string
  className?: string
}

const PulseLoader: React.FC<PulseLoaderProps> = ({
  count = 3,
  size = 8,
  color = "currentColor",
  className
}) => {
  return (
    <div className={cn("flex space-x-1", className)}>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="rounded-full animate-pulse"
          style={{
            width: size,
            height: size,
            backgroundColor: color,
            animationDelay: `${index * 0.2}s`,
            animationDuration: "1s"
          }}
        />
      ))}
    </div>
  )
}

interface RefreshButtonProps {
  onRefresh: () => void | Promise<void>
  className?: string
  disabled?: boolean
  size?: "sm" | "md" | "lg"
}

const RefreshButton: React.FC<RefreshButtonProps> = ({
  onRefresh,
  className,
  disabled = false,
  size = "md"
}) => {
  const [isRefreshing, setIsRefreshing] = React.useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await onRefresh()
    } catch (error) {
      console.error("Erro ao atualizar:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  }

  return (
    <button
      onClick={handleRefresh}
      disabled={disabled || isRefreshing}
      className={cn(
        "inline-flex items-center justify-center rounded-md p-1 hover:bg-muted transition-colors",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      title="Atualizar"
    >
      <RefreshCw 
        className={cn(
          sizeClasses[size],
          isRefreshing && "animate-spin"
        )} 
      />
    </button>
  )
}

export { 
  LoadingSpinner, 
  LoadingState, 
  LoadingOverlay,
  Skeleton,
  ProgressBar,
  CircularProgress,
  PulseLoader,
  RefreshButton
}
