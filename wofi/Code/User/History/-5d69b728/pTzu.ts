"use client"

import { useState, useCallback } from "react"
import {
  apiClient,
  type RegisterEmployeeDTO,
  type ReadEmployeeDTO,
  type CreatedEmployeeDTO,
  type PageReadEmployeeDTO,
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

  const getEmployeeByRegistrationNumber = useCallback(
    async (registrationNumber: string): Promise<ReadEmployeeDTO | null> => {
      try {
        setIsLoading(true)
        const response = await apiClient.get<ReadEmployeeDTO>(`/employee/${registrationNumber}`)
        return response.data
      } catch (error) {
        handleAPIError(error, "Failed to fetch employee by registration number")
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  const getEmployeeByEmail = useCallback(
    async (email: string): Promise<ReadEmployeeDTO | null> => {
      try {
        setIsLoading(true)
        const response = await apiClient.get<ReadEmployeeDTO>(`/employee/${email}`)
        return response.data
      } catch (error) {
        handleAPIError(error, "Failed to fetch employee by email")
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  const getEmployeesPage = useCallback(
    async (page: number, size: number, sort?: string[]): Promise<PageReadEmployeeDTO | null> => {
      try {
        setIsLoading(true)
        const params = new URLSearchParams({
          page: page.toString(),
          size: size.toString(),
        })
        if (sort) {
          sort.forEach((s) => params.append("sort", s))
        }
        const response = await apiClient.get<PageReadEmployeeDTO>(`/employee/page?${params.toString()}`)
        return response.data
      } catch (error) {
        handleAPIError(error, "Failed to fetch employees page")
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  const getAllEmployees = useCallback(async (): Promise<ReadEmployeeDTO[] | null> => {
    try {
      setIsLoading(true)
      const response = await apiClient.get<ReadEmployeeDTO[]>("/employee/list")
      return response.data
    } catch (error) {
      handleAPIError(error, "Failed to fetch all employees")
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
    getEmployeeByRegistrationNumber,
    getEmployeeByEmail,
    getEmployeesPage,
    getAllEmployees,
    refreshEmployees,
  }
}
