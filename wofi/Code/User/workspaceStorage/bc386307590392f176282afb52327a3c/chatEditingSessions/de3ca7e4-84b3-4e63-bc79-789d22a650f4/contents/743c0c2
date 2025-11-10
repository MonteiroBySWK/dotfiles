"use client"

import { useState, useCallback, useEffect } from "react"
import { apiClient } from "@/lib/api-client"
import { CreatedEmployeeDTO, ReadEmployeeDTO, RegisterEmployeeDTO } from "@/lib/types"
import { toast } from "sonner"

export function useEmployees() {
  const [employees, setEmployees] = useState<ReadEmployeeDTO[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Carregar lista de funcionários
  const fetchEmployees = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await apiClient.getEmployees()
      setEmployees(data)
    } catch (err: any) {
      setError(err.message || "Erro ao carregar funcionários")
      toast.error(err.message || "Erro ao carregar funcionários")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Carregar funcionários ao montar o componente
  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  const registerEmployee = useCallback(
    async (employeeData: RegisterEmployeeDTO): Promise<CreatedEmployeeDTO | null> => {
      try {
        setIsLoading(true)
        const data = await apiClient.registerEmployee(employeeData)
        await fetchEmployees() // Recarrega a lista após registrar
        return data
      } catch (err: any) {
        toast.error(err.message || "Erro ao registrar funcionário")
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [fetchEmployees],
  )

  const getEmployee = useCallback(async (id: string): Promise<ReadEmployeeDTO | null> => {
    try {
      setIsLoading(true)
      const data = await apiClient.getEmployeeById(id)
      return data
    } catch (err: any) {
      toast.error(err.message || "Erro ao buscar funcionário")
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getEmployeeByRegistrationNumber = useCallback(
    async (registrationNumber: string): Promise<ReadEmployeeDTO | null> => {
      try {
        setIsLoading(true)
        const response = await apiClient.getEmployeeByRegistrationNumber(registrationNumber)
        return response
      } catch (err: any) {
        toast.error(err.message || "Erro ao buscar funcionário")
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  return {
    employees,
    isLoading,
    error,
    registerEmployee,
    getEmployee,
    getEmployeeByRegistrationNumber,
    refreshEmployees: fetchEmployees,
  }
}
