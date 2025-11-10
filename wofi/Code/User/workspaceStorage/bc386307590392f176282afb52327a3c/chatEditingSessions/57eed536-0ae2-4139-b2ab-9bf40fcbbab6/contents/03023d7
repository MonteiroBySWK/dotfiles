"use client";

import { useEmployees } from "@/hooks/use-employees";
import { useHealthData } from "@/hooks/use-health-data";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ReadEmployeeDTO, ReadHealthDataDTO } from "@/lib/types";

interface EmployeeDetailsProps {
  params: {
    id: string;
  };
}

export default function EmployeeDetailsPage({ params }: EmployeeDetailsProps) {
  const { getEmployee } = useEmployees();
  const { getEmployeeHealthDataList } = useHealthData();
  const [employee, setEmployee] = useState<ReadEmployeeDTO | null>(null);
  const [healthData, setHealthData] = useState<ReadHealthDataDTO[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeeData = await getEmployee(params.id);
        setEmployee(employeeData);
        const healthDataList = await getEmployeeHealthDataList(params.id);
        setHealthData(healthDataList);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchData();
  }, [params.id, getEmployee, getEmployeeHealthDataList]);

  if (!employee) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">{employee.fullName}</h1>
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Employee Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Registration Number</p>
            <p>{employee.registrationNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Social Name</p>
            <p>{employee.socialName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">CPF</p>
            <p>{employee.cpf}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p>{employee.user.email}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Health Data History</h2>
        <div className="space-y-4">
          {healthData.map((data) => (
            <div key={data.healthdata_id} className="border-b pb-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">BPM</p>
                  <p>{data.bpm}</p>
                </div>
                {data.spo2 && (
                  <div>
                    <p className="text-sm text-gray-500">SpO2</p>
                    <p>{data.spo2}%</p>
                  </div>
                )}
                {data.stressLevel && (
                  <div>
                    <p className="text-sm text-gray-500">Stress Level</p>
                    <p>{data.stressLevel}</p>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(data.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
