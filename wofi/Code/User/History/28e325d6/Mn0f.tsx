"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

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
  className?: string
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isLoading, 
  children, 
  className 
}) => {
  return (
    <div className={cn("relative", className)}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-200">
          <LoadingSpinner size="lg" />
        </div>
      )}
    </div>
  )
}

export { LoadingSpinner, LoadingState, LoadingOverlay }
