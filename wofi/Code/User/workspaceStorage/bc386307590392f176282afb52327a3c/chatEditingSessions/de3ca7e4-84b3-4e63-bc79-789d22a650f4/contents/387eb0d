import axios, { AxiosInstance } from "axios";
import { toast } from "sonner";
import Cookies from 'js-cookie';

// API Base Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://vitaport-production.up.railway.app";

// Função auxiliar para obter headers com token
const getAuthHeaders = () => {
  const token = Cookies.get('token');
  return {
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  };
};

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
    Cookies.remove('token');
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
    const token = Cookies.get('token');
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
          Cookies.remove('token');
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
      const response = await axios.post<TokenDTO>(`${API_BASE_URL}/user/login`, data);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Erro ao fazer login. Verifique suas credenciais.");
    }
  },

  async register(data: RegisterUserDTO): Promise<CreatedUserDTO> {
    try {
      const response = await axios.post<CreatedUserDTO>(`${API_BASE_URL}/user/register`, data);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Erro ao registrar usuário.");
    }
  },

  // User endpoints
  async getUserData(id: string): Promise<ReadUserDTO> {
    try {
      // Se parece com um email, usa a rota by-email
      if (id.includes('@')) {
        const response = await axios.get<ReadUserDTO>(`${API_BASE_URL}/user/by-email/${id}`, {
          headers: getAuthHeaders(),
        });
        return response.data;
      }
      // Senão usa a rota por ID
      const response = await axios.get<ReadUserDTO>(`${API_BASE_URL}/user/${id}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error("Acesso negado. Faça login novamente.");
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Erro ao buscar dados do usuário.");
    }
  },

  // Employee endpoints
  async getEmployees(): Promise<ReadEmployeeDTO[]> {
    const response = await axios.get<ReadEmployeeDTO[]>(`${API_BASE_URL}/employee/list`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  async getEmployeeById(id: string): Promise<ReadEmployeeDTO> {
    const response = await axios.get<ReadEmployeeDTO>(`${API_BASE_URL}/employee/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  async getEmployeeByRegistrationNumber(registrationNumber: string): Promise<ReadEmployeeDTO> {
    const response = await axios.get<ReadEmployeeDTO>(`${API_BASE_URL}/employee/${registrationNumber}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  async registerEmployee(data: RegisterEmployeeDTO): Promise<CreatedEmployeeDTO> {
    const response = await axios.post<CreatedEmployeeDTO>(`${API_BASE_URL}/employee/register`, data, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  // Health Data endpoints
  async registerHealthData(data: RegisterHealthDataDTO): Promise<CreatedHealthDataDTO> {
    const response = await axios.post<CreatedHealthDataDTO>(`${API_BASE_URL}/healthdata/register`, data, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  async getHealthData(id: string): Promise<ReadHealthDataDTO> {
    const response = await axios.get<ReadHealthDataDTO>(`${API_BASE_URL}/healthdata/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  async getEmployeeHealthDataList(employeeId: string): Promise<ReadHealthDataDTO[]> {
    const response = await axios.get<ReadHealthDataDTO[]>(`${API_BASE_URL}/healthdata/${employeeId}/list`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  async getLastEmployeeHealthData(employeeId: string): Promise<ReadHealthDataDTO> {
    const response = await axios.get<ReadHealthDataDTO>(`${API_BASE_URL}/healthdata/${employeeId}/last`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  async getLastEmployeeHealthDataList(): Promise<ReadHealthDataDTO[]> {
    const response = await axios.get<ReadHealthDataDTO[]>(`${API_BASE_URL}/healthdata/last/list`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },
};
