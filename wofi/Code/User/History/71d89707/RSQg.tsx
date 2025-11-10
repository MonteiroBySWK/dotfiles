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
  const { data: sseData } = useSseHealthData();

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
    if (sseData && (!employeeId || sseData.employee_id === employeeId)) {
      setLatestData(sseData);
    }
  }, [sseData, employeeId]);

  if (!latestData) {
    return <div>Loading...</div>;
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
        {latestData.steps && (
          <div>
            <p className="text-sm text-gray-500">Steps</p>
            <p className="text-2xl font-semibold">{latestData.steps}</p>
          </div>
        )}
        {latestData.distanceM && (
          <div>
            <p className="text-sm text-gray-500">Distance</p>
            <p className="text-2xl font-semibold">
              {(latestData.distanceM / 1000).toFixed(2)} km
            </p>
          </div>
        )}
        {latestData.calories && (
          <div>
            <p className="text-sm text-gray-500">Calories</p>
            <p className="text-2xl font-semibold">
              {Math.round(latestData.calories)} kcal
            </p>
          </div>
        )}
        {latestData.sleepDuration && (
          <div>
            <p className="text-sm text-gray-500">Sleep Duration</p>
            <p className="text-2xl font-semibold">
              {Math.round(latestData.sleepDuration / 60)}h{" "}
              {latestData.sleepDuration % 60}m
            </p>
          </div>
        )}
        {latestData.sleepQuality && (
          <div>
            <p className="text-sm text-gray-500">Sleep Quality</p>
            <p className="text-2xl font-semibold">{latestData.sleepQuality}</p>
          </div>
        )}
      </div>
      <div className="mt-4 text-sm text-gray-500">
        Last updated: {new Date(latestData.timestamp).toLocaleString()}
      </div>
    </Card>
  );
}
