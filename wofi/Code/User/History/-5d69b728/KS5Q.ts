"use client"

import { useState, useCallback } from "react"
import { apiClient, handleAPIError } from "@/lib/api-client"
import { CreatedEmployeeDTO, ReadEmployeeDTO, RegisterEmployeeDTO, PageReadEmployeeDTO } from "@/lib/types"

export function useEmployees() {
  const [employees, setEmployees] = useState<ReadEmployeeDTO[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const registerEmployee = useCallback(
    async (employeeData: RegisterEmployeeDTO): Promise<CreatedEmployeeDTO | null> => {
      try {
        setIsLoading(true)
        const response = await apiClient.post<CreatedEmployeeDTO>("/employee/register", employeeData)
        return response.data
      } catch (error) {
        handleAPIError(error)
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
      handleAPIError(error)
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
        handleAPIError(error)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  const getEmployeeByEmail = useCallback(async (email: string): Promise<ReadEmployeeDTO | null> => {
    try {
      setIsLoading(true)
      const response = await apiClient.get<ReadEmployeeDTO>(`/employee/${email}`)
      return response.data
    } catch (error) {
      handleAPIError(error)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

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
        handleAPIError(error)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  const getAllEmployees = useCallback(async (): Promise<ReadEmployeeDTO[]> => {
    try {
      setIsLoading(true)
      const response = await apiClient.get<ReadEmployeeDTO[]>("/employee/list")
      setEmployees(response.data)
      return response.data
    } catch (error) {
      handleAPIError(error)
      return []
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
  }
}
