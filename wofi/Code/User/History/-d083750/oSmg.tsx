import React from 'react'
import { cn } from '@/lib/utils'

interface ResponsiveGridProps {
  children: React.ReactNode
  className?: string
  columns?: {
    default?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
}

export function ResponsiveGrid({ 
  children, 
  className,
  columns = { default: 1, sm: 2, md: 3, lg: 4 }
}: ResponsiveGridProps) {
  const gridClasses = cn(
    "grid gap-4 w-full",
    // Default columns
    columns.default === 1 && "grid-cols-1",
    columns.default === 2 && "grid-cols-2", 
    columns.default === 3 && "grid-cols-3",
    columns.default === 4 && "grid-cols-4",
    
    // Small screens
    columns.sm === 1 && "sm:grid-cols-1",
    columns.sm === 2 && "sm:grid-cols-2",
    columns.sm === 3 && "sm:grid-cols-3", 
    columns.sm === 4 && "sm:grid-cols-4",
    
    // Medium screens  
    columns.md === 1 && "md:grid-cols-1",
    columns.md === 2 && "md:grid-cols-2",
    columns.md === 3 && "md:grid-cols-3",
    columns.md === 4 && "md:grid-cols-4",
    
    // Large screens
    columns.lg === 1 && "lg:grid-cols-1", 
    columns.lg === 2 && "lg:grid-cols-2",
    columns.lg === 3 && "lg:grid-cols-3",
    columns.lg === 4 && "lg:grid-cols-4",
    
    // Extra large screens
    columns.xl === 1 && "xl:grid-cols-1",
    columns.xl === 2 && "xl:grid-cols-2", 
    columns.xl === 3 && "xl:grid-cols-3",
    columns.xl === 4 && "xl:grid-cols-4",
    
    className
  )

  return (
    <div className={gridClasses}>
      {children}
    </div>
  )
}

// Export responsive grid for stats specifically
export function StatsGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <ResponsiveGrid 
      columns={{ default: 1, sm: 2, md: 2, lg: 4 }}
      className={className}
    >
      {children}
    </ResponsiveGrid>
  )
}

// Export responsive grid for cards
export function CardsGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <ResponsiveGrid
      columns={{ default: 1, md: 2, lg: 3 }}
      className={className}
    >
      {children}
    </ResponsiveGrid>
  )
}
