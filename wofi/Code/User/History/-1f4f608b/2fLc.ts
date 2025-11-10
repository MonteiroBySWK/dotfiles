import { apiClient } from "@/lib/api-client";
import { PageReadUserDTO, ReadUserDTO } from "@/lib/types";
import { useCallback } from "react";

export function useUsers() {
  const getUser = useCallback(async (id: string) => {
    const response = await apiClient.get<ReadUserDTO>(`/user/${id}`);
    return response.data;
  }, []);

  const getUserByEmail = useCallback(async (email: string) => {
    const response = await apiClient.get<ReadUserDTO>(`/user/by-email/${email}`);
    return response.data;
  }, []);

  const getUsersPage = useCallback(async (page: number, size: number, sort?: string[]) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    if (sort) {
      sort.forEach(s => params.append('sort', s));
    }
    const response = await apiClient.get<PageReadUserDTO>(`/user/page?${params.toString()}`);
    return response.data;
  }, []);

  const getAllUsers = useCallback(async () => {
    const response = await apiClient.get<ReadUserDTO[]>('/user/list');
    return response.data;
  }, []);

  return {
    getUser,
    getUserByEmail,
    getUsersPage,
    getAllUsers,
  };
}
