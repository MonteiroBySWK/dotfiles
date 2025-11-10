"use client";

import { User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

type UserAuthContext = {
  id: string;
  email: string;
  type: "member" | "client";
};

type AuthContextType = {
  user: UserAuthContext | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserAuthContext | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true);
        if (user) {
          const res = await fetch("/api/users/profile", {
            credentials: "include",
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
          } else {
            setUser(null);
          }
        }
      } catch {
        setError("Error ao carregar usuário");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Falha no login");

      const data = await res.json();
      setUser(data.data.user);

      console.log(user);

      // Em vez de router.push, force uma requisição completa.
      // O navegador tentará carregar /dashboard. O middleware verá que o cookie
      // agora existe e permitirá o acesso.
      window.location.assign("/dashboard");

      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);

    // Força um reload. A página tentará recarregar a rota atual (do dashboard).
    // O middleware vai interceptar, ver que não há cookie, e redirecionar para /login.
    // location.assign(url) é mais robusto que location.reload() para isso.
    window.location.assign("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const res = useContext(AuthContext);

  if (!res) {
    throw new Error("O hook useAuth deve estar dentro de AuthContext");
  }

  return res;
};
