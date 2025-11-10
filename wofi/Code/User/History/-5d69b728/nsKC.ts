"use client"

import { useState, useCallback } from "react"
import {
  apiClient,
  type RegisterEmployeeDTO,
  type ReadEmployeeDTO,
  type CreatedEmployeeDTO,
  handleAPIError,
} from "@/lib/api-client"

export function useEmployees() {
  const [employees, setEmployees] = useState<ReadEmployeeDTO[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const registerEmployee = useCallback(
    async (employeeData: RegisterEmployeeDTO): Promise<CreatedEmployeeDTO | null> => {
      try {
        setIsLoading(true)
        const result = await apiClient.registerEmployee(employeeData)
        return result
      } catch (error) {
        handleAPIError(error, "Failed to register employee")
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  const getEmployee = useCallback(async (id: string): Promise<ReadEmployeeDTO | null> => {
    try {
      setIsLoading(true)
      const response = await apiClient.get<ReadEmployeeDTO>(`/employee/${id}`)
      return response.data
    } catch (error) {
      handleAPIError(error, "Failed to fetch employee")
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refreshEmployees = useCallback(async (employeeIds: string[]) => {
    try {
      setIsLoading(true)
      const employeePromises = employeeIds.map((id) => apiClient.getEmployee(id))
      const results = await Promise.allSettled(employeePromises)

      const validEmployees = results
        .filter((result): result is PromiseFulfilledResult<ReadEmployeeDTO> => result.status === "fulfilled")
        .map((result) => result.value)

      setEmployees(validEmployees)
    } catch (error) {
      handleAPIError(error, "Failed to refresh employees")
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    employees,
    isLoading,
    registerEmployee,
    getEmployee,
    refreshEmployees,
  }
}
