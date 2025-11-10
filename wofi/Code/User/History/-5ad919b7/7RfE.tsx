"use client"

import { cn } from "@/lib/utils"

interface Props {
  children: React.ReactNode
  className?: string
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full"
  padding?: "none" | "sm" | "md" | "lg"
}

export function PageContainer({
  children,
  className,
  maxWidth = "full",
  padding = "none"
}: Props) {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md", 
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "w-full"
  }

  const paddingClasses = {
    none: "",
    sm: "p-2",
    md: "p-4", 
    lg: "p-6"
  }

  return (
    <div className={cn(
      "mx-auto",
      maxWidthClasses[maxWidth],
      paddingClasses[padding],
      className
    )}>
      {children}
    </div>
  )
}
