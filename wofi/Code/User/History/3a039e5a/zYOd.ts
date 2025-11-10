import axios, { AxiosInstance } from "axios";
import { toast } from "sonner";

// API Base Configuration
const API_BASE_URL = "http://localhost:8081";

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

export class APIClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        handleAPIError(error);
        return Promise.reject(error);
      }
    );
  }

  setToken(token: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
  }

  clearToken() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  }

  async get<T>(path: string): Promise<{ data: T }> {
    try {
      const response = await this.axiosInstance.get<T>(path);
      return { data: response.data };
    } catch (error) {
      // O interceptor já trata o erro
      throw error;
    }
  }

  async post<T>(path: string, data: any): Promise<{ data: T }> {
    try {
      const response = await this.axiosInstance.post<T>(path, data);
      return { data: response.data };
    } catch (error) {
      // O interceptor já trata o erro
      throw error;
    }
  }
}

export const apiClient = new APIClient();

// Custom error class
export class APIError extends Error {
  constructor(message: string, public status: number, public details?: any) {
    super(message);
    this.name = "APIError";
  }
}
