"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RealTimeHealthData } from "@/components/real-time-health-data"

// Temporário: Token JWT de exemplo
const TEMP_JWT_TOKEN = "seu_token_jwt_aqui"

export default function RealTimePage() {
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all")

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Monitoramento em Tempo Real</h2>
        <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select employee" />
          </SelectTrigger>
          <SelectContent>
            {mockEmployees
              .filter((emp) => emp.status === "Active")
              .map((emp) => (
                <SelectItem key={emp.id} value={emp.id}>
                  {emp.name}
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
            <CardTitle>Individual Employee Monitoring</CardTitle>
            <CardDescription>Detailed real-time health monitoring for {employee.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <RealTimeHeartRateChart employeeId={employee.id} employeeName={employee.name} maxDataPoints={30} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
