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
} from "@/lib/api-client";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  sub: string;
  exp: number;
  role: string;
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

  // Função para validar o token
  const validateToken = (token: string) => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime ? decoded : null;
    } catch {
      return null;
    }
  };

  // Função para verificar autenticação
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        return;
      }

      const decoded = validateToken(token);
      if (!decoded) {
        localStorage.removeItem("token");
        setUser(null);
        return;
      }

      const userData = await apiClient.getUserData(decoded.sub);
      setUser(userData);
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar autenticação ao montar o componente
  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (data: LoginUserDTO) => {
    try {
      setIsLoading(true);

      // Fazer login e obter token
      const response = await apiClient.login(data);
      const { tokenJWT } = response;

      // Validar o token recebido
      const decoded = validateToken(tokenJWT);
      if (!decoded) {
        throw new Error("Token inválido recebido do servidor");
      }

      // Salvar token e buscar dados do usuário
      localStorage.setItem("token", tokenJWT);
      const userData = await apiClient.getUserData(decoded.sub);
      setUser(userData);

      toast.success("Login realizado com sucesso!");
      router.push("/dashboard");
    } catch (error: any) {
      localStorage.removeItem("token");
      setUser(null);
      toast.error(
        error.message || "Erro ao fazer login. Verifique suas credenciais."
      );
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
      toast.error(error.message || "Erro ao registrar. Tente novamente.");
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
