"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Search, Filter, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface FilterOption {
  key: string
  label: string
  options: { value: string; label: string }[]
}

interface SearchAndFilterProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  filters?: FilterOption[]
  activeFilters?: Record<string, string>
  onFilterChange?: (key: string, value: string) => void
  onFilterClear?: (key: string) => void
  onClearAll?: () => void
  placeholder?: string
  className?: string
  showFilterButton?: boolean
}

export function SearchAndFilter({
  searchQuery,
  onSearchChange,
  filters = [],
  activeFilters = {},
  onFilterChange,
  onFilterClear,
  onClearAll,
  placeholder = "Buscar...",
  className,
  showFilterButton = true
}: SearchAndFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  
  const activeFilterCount = Object.keys(activeFilters).length
  const hasActiveFilters = activeFilterCount > 0

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filter Button */}
      {showFilterButton && filters.length > 0 && (
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="relative">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Filtros</h4>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onClearAll?.()
                      setIsFilterOpen(false)
                    }}
                  >
                    Limpar todos
                  </Button>
                )}
              </div>
              
              {filters.map((filter) => (
                <div key={filter.key} className="space-y-2">
                  <label className="text-sm font-medium">{filter.label}</label>
                  <Select
                    value={activeFilters[filter.key] || ""}
                    onValueChange={(value) => onFilterChange?.(filter.key, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`Selecionar ${filter.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {filter.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex items-center gap-1 flex-wrap">
          {Object.entries(activeFilters).map(([key, value]) => {
            const filter = filters.find(f => f.key === key)
            const option = filter?.options.find(o => o.value === value)
            
            if (!option) return null
            
            return (
              <Badge key={key} variant="secondary" className="gap-1">
                {option.label}
                <button
                  onClick={() => onFilterClear?.(key)}
                  className="hover:bg-muted rounded-sm p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )
          })}
        </div>
      )}
    </div>
  )
}
