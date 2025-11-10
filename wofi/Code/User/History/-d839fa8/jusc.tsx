"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useHealthData } from "@/hooks/use-health-data";
import { ReadHealthDataDTO } from "@/lib/types";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function EmployeesPage() {
  const { user } = useAuth();
  const { getLastEmployeeHealthDataList } = useHealthData();
  const [healthData, setHealthData] = useState<ReadHealthDataDTO[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getLastEmployeeHealthDataList();
        setHealthData(data);
      } catch (error) {
        console.error("Error fetching health data:", error);
      }
    };

    fetchData();
  }, [getLastEmployeeHealthDataList]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Employees</h1>
        {user?.userRole === "SYSTEM_MANAGER" && (
          <Link href="/dashboard/employees/new">
            <Button>Add Employee</Button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {healthData.map((data) => (
          <Link
            key={data.employee_id}
            href={`/dashboard/employees/${data.employee_id}`}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">BPM</p>
                    <p className="text-xl font-semibold">{data.bpm}</p>
                  </div>
                  {data.spo2 && (
                    <div>
                      <p className="text-sm text-gray-500">SpO2</p>
                      <p className="text-xl font-semibold">{data.spo2}%</p>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Update</p>
                  <p>{new Date(data.timestamp).toLocaleString()}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
