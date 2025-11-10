import axios, { AxiosInstance } from "axios";
import { toast } from "sonner";

// API Base Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://vitaport-production.up.railway.app";

// Types based on API documentation
export interface RegisterUserDTO {
  name: string;
  email: string;
  password: string;
  role: "employee" | "data_analyst" | "system_manager";
}

export interface CreatedUserDTO {
  id: string;
  name: string;
  email: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface TokenDTO {
  tokenJWT: string;
}

export interface ReadUserDTO {
  id: string;
  name: string;
  email: string;
  userRole: "EMPLOYEE" | "DATA_ANALYST" | "SYSTEM_MANAGER";
  active: boolean;
}

export interface RegisterEmployeeDTO {
  user_id: string;
  registrationNumber: string;
  cpf: string;
  fullName: string;
  socialName: string;
}

export interface CreatedEmployeeDTO {
  id: string;
  user_id: string;
  registrationNumber: string;
  cpf: string;
  fullName: string;
  socialName: string;
}

export interface ReadEmployeeDTO {
  id: string;
  user: ReadUserDTO;
  registrationNumber: string;
  cpf: string;
  fullName: string;
  socialName: string;
  healthCarePages: ReadHealthDataDTO[];
}

export interface RegisterHealthDataDTO {
  employee_id: string;
  bpm: number;
  spo2?: number;
  ecgSignal?: string;
  sleepDuration?: number;
  sleepQuality?: string;
  stressLevel?: number;
  steps?: number;
  distanceM?: number;
  calories?: number;
  bpSystolic?: number;
  bpDiastolic?: number;
  skinTemp?: number;
  timestamp: string;
}

export interface ReadHealthDataDTO {
  healthdata_id: string;
  employee_id: string;
  bpm: number;
  spo2?: number;
  ecgSignal?: string;
  sleepDuration?: number;
  sleepQuality?: "POOR" | "AVERAGE" | "GOOD" | "EXCEPTIONAL";
  stressLevel?: number;
  steps?: number;
  distanceM?: number;
  calories?: number;
  bpSystolic?: number;
  bpDiastolic?: number;
  skinTemp?: number;
  timestamp: string;
}

export interface CreatedHealthDataDTO extends ReadHealthDataDTO {}

// API Error types
export interface APIError {
  message: string;
  status: number;
  details?: any;
}

export const handleAPIError = (error: any) => {
  console.error("API Error: ", error);
  const message =
    error.response?.data?.message || error.message || "An error occurred";
  toast.error(message);
  if (error.response?.status === 401 || error.response?.status === 403) {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }
};

// Create axios instance with interceptors
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific error cases
      switch (error.response.status) {
        case 401:
          localStorage.removeItem("token");
          window.location.href = "/login";
          return Promise.reject(new Error("Sua sessão expirou. Por favor, faça login novamente."));
        case 403:
          return Promise.reject(new Error("Você não tem permissão para realizar esta ação."));
        case 422:
          // Validation errors
          const validationErrors = error.response.data.errors;
          if (validationErrors) {
            return Promise.reject(new Error(Object.values(validationErrors).join(", ")));
          }
          break;
        case 500:
          return Promise.reject(new Error("Erro interno do servidor. Tente novamente mais tarde."));
      }
    }
    return Promise.reject(error);
  }
);

export const apiClient = {
  // Auth endpoints
  async login(data: LoginUserDTO): Promise<TokenDTO> {
    try {
      const response = await axiosInstance.post<TokenDTO>("/user/login", data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || "Erro ao fazer login");
    }
  },

  async register(data: RegisterUserDTO): Promise<CreatedUserDTO> {
    try {
      const response = await axiosInstance.post<CreatedUserDTO>("/user/register", data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || "Erro ao registrar usuário");
    }
  },

  // User endpoints
  async getUserData(id: string): Promise<ReadUserDTO> {
    try {
      const response = await axiosInstance.get<ReadUserDTO>(`/user/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || "Erro ao buscar dados do usuário");
    }
  },

  // Employee endpoints
  async getEmployees() {
    try {
      const response = await axiosInstance.get<ReadEmployeeDTO[]>("/employee/list");
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || "Erro ao buscar funcionários");
    }
  },

  async getEmployeeById(id: string) {
    try {
      const response = await axiosInstance.get<ReadEmployeeDTO>(`/employee/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || "Erro ao buscar funcionário");
    }
  },

  async registerEmployee(data: RegisterEmployeeDTO): Promise<CreatedEmployeeDTO> {
    try {
      const response = await axiosInstance.post<CreatedEmployeeDTO>("/employee/register", data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || "Erro ao registrar funcionário");
    }
  },
  // ...existing code...
