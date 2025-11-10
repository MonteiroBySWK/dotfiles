"use client"

import { useEffect, useState } from "react"
import { useSSEHealthData } from "@/hooks/use-sse-health-data"
import { HealthData } from "@/types/health-data"

interface RealTimeHealthDataProps {
  employeeId?: string
  token: string
}

export function RealTimeHealthData({ employeeId = "all", token }: RealTimeHealthDataProps) {
  const { healthData, connectionState } = useSSEHealthData(employeeId, token)
  const [lastUpdate, setLastUpdate] = useState<HealthData | null>(null)

  useEffect(() => {
    // Atualiza o último dado recebido quando houver mudança nos dados
    if (healthData.size > 0) {
      const lastEntry = Array.from(healthData.values())[healthData.size - 1]
      setLastUpdate(lastEntry)
    }
  }, [healthData])

  if (connectionState.error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        Error: {connectionState.error}
      </div>
    )
  }

  if (connectionState.isConnecting) {
    return (
      <div className="p-4 bg-yellow-100 text-yellow-700 rounded">
        Conectando ao servidor de dados em tempo real...
      </div>
    )
  }

  if (!connectionState.isConnected) {
    return (
      <div className="p-4 bg-gray-100 text-gray-700 rounded">
        Desconectado do servidor. Tentando reconectar...
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-green-100 text-green-700 rounded">
        Conectado! Última atualização: {connectionState.lastUpdate}
      </div>

      {lastUpdate && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-white shadow rounded">
            <h3 className="font-semibold">BPM</h3>
            <p className="text-2xl">{lastUpdate.bpm}</p>
          </div>

          {lastUpdate.spo2 && (
            <div className="p-4 bg-white shadow rounded">
              <h3 className="font-semibold">SpO2</h3>
              <p className="text-2xl">{lastUpdate.spo2}%</p>
            </div>
          )}

          {lastUpdate.stressLevel && (
            <div className="p-4 bg-white shadow rounded">
              <h3 className="font-semibold">Nível de Estresse</h3>
              <p className="text-2xl">{lastUpdate.stressLevel}</p>
            </div>
          )}

          {lastUpdate.skinTemp && (
            <div className="p-4 bg-white shadow rounded">
              <h3 className="font-semibold">Temperatura</h3>
              <p className="text-2xl">{lastUpdate.skinTemp}°C</p>
            </div>
          )}

          {lastUpdate.sleepQuality && (
            <div className="p-4 bg-white shadow rounded">
              <h3 className="font-semibold">Qualidade do Sono</h3>
              <p className="text-2xl">{lastUpdate.sleepQuality}</p>
            </div>
          )}

          {lastUpdate.steps && (
            <div className="p-4 bg-white shadow rounded">
              <h3 className="font-semibold">Passos</h3>
              <p className="text-2xl">{lastUpdate.steps}</p>
            </div>
          )}
        </div>
      )}

      {employeeId === "all" && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Todos os Funcionários</h2>
          <div className="space-y-4">
            {Array.from(healthData.entries()).map(([empId, data]) => (
              <div key={empId} className="p-4 bg-white shadow rounded">
                <h3 className="font-semibold">Funcionário ID: {empId}</h3>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>BPM: {data.bpm}</div>
                  {data.spo2 && <div>SpO2: {data.spo2}%</div>}
                  {data.stressLevel && <div>Estresse: {data.stressLevel}</div>}
                  {data.skinTemp && <div>Temp.: {data.skinTemp}°C</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
