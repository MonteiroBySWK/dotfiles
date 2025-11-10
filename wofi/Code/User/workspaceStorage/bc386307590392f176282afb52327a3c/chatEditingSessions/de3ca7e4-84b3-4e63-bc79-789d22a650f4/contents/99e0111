"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  apiClient,
  type LoginUserDTO,
  type RegisterUserDTO,
  type ReadUserDTO,
  type TokenDTO,
  handleAPIError,
} from "@/lib/api-client";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import { redirect } from "next/navigation";

interface DecodedToken {
  sub: string;
  exp: number;
}

interface AuthContextType {
  user: ReadUserDTO | null;
  login: (data: LoginUserDTO) => Promise<void>;
  register: (data: RegisterUserDTO) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ReadUserDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsLoading(false);
          return;
        }

        // Verificar se o token está expirado
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          setIsLoading(false);
          return;
        }

        // Buscar dados do usuário
        const response = await apiClient.get<ReadUserDTO>(
          `/user/by-email/${decoded.sub}`
        );
        setUser(response.data);
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("token");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (data: LoginUserDTO) => {
    try {
      setIsLoading(true);
      
      // Clear any existing token before login attempt
      localStorage.removeItem("token");
      
      const response = await apiClient.post<TokenDTO>("/user/login", {
        email: data.email.trim(),
        password: data.password
      });
      
      const { tokenJWT } = response.data;
      if (!tokenJWT) {
        throw new Error("No token received from server");
      }

      // Save the token
      localStorage.setItem("token", tokenJWT);
      apiClient.setToken(tokenJWT);

      // Decode token and fetch user data
      const decoded = jwtDecode<DecodedToken>(tokenJWT);
      const userResponse = await apiClient.get<ReadUserDTO>(
        `/user/by-email/${decoded.sub}`
      );
      setUser(userResponse.data);

      toast.success("Login successful");
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Login failed:", error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "Login failed. Please check your credentials.";
      toast.error(errorMessage);
      // Clear token in case of error
      localStorage.removeItem("token");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterUserDTO) => {
    try {
      setIsLoading(true);
      await apiClient.post("/user/register", data);
      toast.success("Registration successful. Please login.");
      router.push("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    apiClient.clearToken();
    setUser(null);
    router.push("/login");
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

// HOC para proteger rotas
export function withAuth(Component: React.ComponentType<any>) {
  return function ProtectedRoute(props: any) {
    const { user, isLoading } = useAuth();

    useEffect(() => {
      if (!isLoading && !user) {
        redirect("/login");
      }
    }, [user, isLoading]);

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse">...</div>
        </div>
      );
    }

    if (!user) {
      return null; // O redirect será chamado no useEffect
    }

    return <Component {...props} />;
  };
}
