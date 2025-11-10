export interface FormField {
  name: string
  label: string
  type: "text" | "email" | "password" | "textarea" | "select" | "date" | "number" | "checkbox" | "file"
  placeholder?: string
  required?: boolean
  options?: { value: string; label: string }[]
  validation?: Record<string, unknown>
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
