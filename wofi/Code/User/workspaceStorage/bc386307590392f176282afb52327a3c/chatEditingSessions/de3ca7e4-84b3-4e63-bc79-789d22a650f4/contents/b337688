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
} from "@/lib/api-client";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import router from "next/router";

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

        // Decode and validate token
        const decoded = jwtDecode<DecodedToken>(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
          // Token expired
          localStorage.removeItem("token");
          setIsLoading(false);
          return;
        }

        // Get user data
        const userData = await apiClient.getUserData(decoded.sub);
        setUser(userData);
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
      const { tokenJWT } = await apiClient.login(data);
      localStorage.setItem("token", tokenJWT);
      
      const decoded = jwtDecode<DecodedToken>(tokenJWT);
      const userData = await apiClient.getUserData(decoded.sub);
      
      setUser(userData);
      toast.success("Login realizado com sucesso!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Falha ao fazer login");
      // Clear token in case of error
      localStorage.removeItem("token");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterUserDTO) => {
    try {
      setIsLoading(true);
      await apiClient.register(data);
      toast.success("Registro realizado com sucesso! Faça login para continuar.");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message || "Falha ao registrar");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
    toast.success("Logout realizado com sucesso!");
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
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}

// HOC para proteger rotas
export function withAuth(Component: React.ComponentType<any>) {
  return function ProtectedRoute(props: any) {
    const { user, isLoading } = useAuth();

    useEffect(() => {
      if (!isLoading && !user) {
        router.push("/login");
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
