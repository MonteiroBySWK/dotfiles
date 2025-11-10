"use client";

import { Card } from "./ui/card";
import { useEmployees } from "@/hooks/use-employees";
import { useMultiMockHealthData } from "@/hooks/use-mock-health-data";
import { ReadEmployeeDTO } from "@/lib/types";

export function RealTimeDashboardOverview() {
  const { employees } = useEmployees();
  const healthDataMap = useMultiMockHealthData(
    employees.map((emp: ReadEmployeeDTO) => emp.id) || []
  );

  const calculateAverages = () => {
    if (!Object.keys(healthDataMap).length) return null;

    const totals = {
      bpm: 0,
      spo2: 0,
      stressLevel: 0,
      steps: 0,
      count: 0,
    };

    Object.values(healthDataMap).forEach((data) => {
      totals.bpm += data.bpm;
      totals.spo2 += data.spo2 || 0;
      totals.stressLevel += data.stressLevel || 0;
      totals.steps += data.steps || 0;
      totals.count++;
    });

    return {
      avgBpm: Math.round(totals.bpm / totals.count),
      avgSpo2: Math.round(totals.spo2 / totals.count),
      avgStress: (totals.stressLevel / totals.count).toFixed(1),
      totalSteps: totals.steps,
    };
  };

  const averages = calculateAverages();

  if (!averages) {
    return (
      <Card className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">Visão Geral em Tempo Real</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">BPM Médio</h3>
          <p className="text-2xl font-bold">{averages.avgBpm}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">SpO2 Médio</h3>
          <p className="text-2xl font-bold">{averages.avgSpo2}%</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">
            Nível de Estresse Médio
          </h3>
          <p className="text-2xl font-bold">{averages.avgStress}/5</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Total de Passos</h3>
          <p className="text-2xl font-bold">
            {averages.totalSteps.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Monitorando {Object.keys(healthDataMap).length} funcionário(s)
      </div>
    </Card>
  );
}
