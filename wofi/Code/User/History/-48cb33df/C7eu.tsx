"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RealTimeHeartRateChart } from "@/components/real-time-heart-rate-chart"
import { RealTimeDashboardOverview } from "@/components/real-time-dashboard-overview"
import { useEmployees } from "@/hooks/use-employees"
import { Skeleton } from "@/components/ui/skeleton"

export default function RealTimePage() {
  const { employees, isLoading } = useEmployees();
  const [selectedEmployee, setSelectedEmployee] = useState<string>("")

  // Seleciona o primeiro funcionário quando os dados são carregados
  useEffect(() => {
    if (employees.length > 0 && !selectedEmployee) {
      setSelectedEmployee(employees[0].id);
    }
  }, [employees, selectedEmployee]);

  const employee = employees.find((emp) => emp.id === selectedEmployee)

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-10 w-[200px]" />
        </div>
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Monitoramento em Tempo Real</h2>
        <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Selecionar funcionário" />
          </SelectTrigger>
          <SelectContent>
            {employees
              .filter((emp) => emp.user.active)
              .map((emp) => (
                <SelectItem key={emp.id} value={emp.id}>
                  {emp.fullName}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {/* Overview Section */}
      <RealTimeDashboardOverview />

      {/* Individual Employee Monitoring */}
      {employee && (
        <Card>
          <CardHeader>
            <CardTitle>Monitoramento Individual</CardTitle>
            <CardDescription>
              Monitoramento em tempo real de {employee.fullName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RealTimeHeartRateChart 
              employeeId={employee.id} 
              employeeName={employee.fullName} 
              maxDataPoints={30} 
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
