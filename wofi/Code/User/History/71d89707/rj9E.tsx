"use client";

import { Card } from "./ui/card";
import { ReadHealthDataDTO } from "@/lib/types";
import { useMockHealthData } from "@/hooks/use-mock-health-data";

interface RealTimeHealthDataProps {
  employeeId: string;
}

export function RealTimeHealthData({ employeeId }: RealTimeHealthDataProps) {
  const healthData = useMockHealthData(employeeId);

  if (!healthData) {
    return (
      <Card className="p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">
            Batimentos Cardíacos
          </h3>
          <p className="text-2xl font-bold">{healthData.bpm} BPM</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">
            Saturação de O2
          </h3>
          <p className="text-2xl font-bold">{healthData.spo2}%</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">
            Pressão Arterial
          </h3>
          <p className="text-2xl font-bold">
            {healthData.bpSystolic}/{healthData.bpDiastolic}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Temperatura</h3>
          <p className="text-2xl font-bold">{healthData.skinTemp}°C</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Nível de Estresse</h3>
          <p className="text-2xl font-bold">{healthData.stressLevel}/5</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Passos</h3>
          <p className="text-2xl font-bold">{healthData.steps}</p>
        </div>
      </div>

      <div className="text-xs text-gray-500 text-right">
        Atualizado em:{" "}
        {new Date(healthData.timestamp).toLocaleString("pt-BR")}
      </div>
    </Card>
  );
}
