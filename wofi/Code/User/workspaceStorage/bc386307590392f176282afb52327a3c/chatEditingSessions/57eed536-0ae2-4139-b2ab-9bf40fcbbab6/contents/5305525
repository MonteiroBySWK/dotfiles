"use client";

import { useCallback, useEffect, useState } from "react";
import { Card } from "./ui/card";
import { useSSEHealthData } from "@/hooks/use-sse-health-data";
import { ReadHealthDataDTO } from "@/lib/types";
import { useHealthData } from "@/hooks/use-health-data";

interface RealTimeHealthDataProps {
  employeeId?: string;
}

export function RealTimeHealthData({ employeeId }: RealTimeHealthDataProps) {
  const [latestData, setLatestData] = useState<ReadHealthDataDTO | null>(null);
  const { getLastEmployeeHealthData } = useHealthData();
  const { healthData, connectionState } = useSSEHealthData();

  const fetchInitialData = useCallback(async () => {
    if (employeeId) {
      try {
        const data = await getLastEmployeeHealthData(employeeId);
        setLatestData(data);
      } catch (error) {
        console.error("Error fetching initial health data:", error);
      }
    }
  }, [employeeId, getLastEmployeeHealthData]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    if (healthData.size > 0) {
      const sseData = employeeId
        ? healthData.get(employeeId)
        : Array.from(healthData.values())[healthData.size - 1];

      if (sseData && sseData.bpm) {
        const healthDataDTO: ReadHealthDataDTO = {
          healthdata_id: sseData.healthdata_id ?? crypto.randomUUID(),
          employee_id: employeeId ?? sseData.employee_id ?? "",
          bpm: sseData.bpm,
          spo2: sseData.spo2,
          timestamp: sseData.timestamp ?? new Date().toISOString(),
          stressLevel: sseData.stressLevel,
        };
        setLatestData(healthDataDTO);
      }
    }
  }, [healthData, employeeId]);

  if (!latestData) {
    return (
      <Card className="p-6">
        <div className="text-center">
          {connectionState === "CONNECTING"
            ? "Connecting..."
            : "Waiting for data..."}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div>
          <p className="text-sm text-gray-500">Heart Rate</p>
          <p className="text-2xl font-semibold">{latestData.bpm} BPM</p>
        </div>
        {latestData.spo2 && (
          <div>
            <p className="text-sm text-gray-500">SpO2</p>
            <p className="text-2xl font-semibold">{latestData.spo2}%</p>
          </div>
        )}
        {latestData.stressLevel && (
          <div>
            <p className="text-sm text-gray-500">Stress Level</p>
            <p className="text-2xl font-semibold">{latestData.stressLevel}</p>
          </div>
        )}
      </div>
      <div className="mt-4 text-sm text-gray-500">
        Last updated: {new Date(latestData.timestamp).toLocaleString()}
      </div>
    </Card>
  );
}
