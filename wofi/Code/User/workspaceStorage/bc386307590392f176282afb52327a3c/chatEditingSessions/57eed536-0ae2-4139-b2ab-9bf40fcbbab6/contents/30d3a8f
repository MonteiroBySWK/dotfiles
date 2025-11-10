import { apiClient } from "@/lib/api-client";
import { CreatedHealthDataDTO, ReadHealthDataDTO, RegisterHealthDataDTO } from "@/lib/types";
import { useCallback } from "react";

export function useHealthData() {
  const getHealthData = useCallback(async (id: string) => {
    const response = await apiClient.get<ReadHealthDataDTO>(`/healthdata/${id}`);
    return response.data;
  }, []);

  const getEmployeeHealthDataList = useCallback(async (employeeId: string) => {
    const response = await apiClient.get<ReadHealthDataDTO[]>(`/healthdata/${employeeId}/list`);
    return response.data;
  }, []);

  const getLastEmployeeHealthData = useCallback(async (employeeId: string) => {
    const response = await apiClient.get<ReadHealthDataDTO>(`/healthdata/${employeeId}/last`);
    return response.data;
  }, []);

  const getLastEmployeeHealthDataList = useCallback(async () => {
    const response = await apiClient.get<ReadHealthDataDTO[]>(`/healthdata/last/list`);
    return response.data;
  }, []);

  const registerHealthData = useCallback(async (data: RegisterHealthDataDTO) => {
    const response = await apiClient.post<CreatedHealthDataDTO>("/healthdata/register", data);
    return response.data;
  }, []);

  return {
    getHealthData,
    getEmployeeHealthDataList,
    getLastEmployeeHealthData,
    getLastEmployeeHealthDataList,
    registerHealthData,
  };
}
