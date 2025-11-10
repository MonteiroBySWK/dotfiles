"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { apiClient, type LoginUserDTO, type RegisterUserDTO, type ReadUserDTO, handleAPIError } from "@/lib/api-client"
import { toast } from "@/components/ui/use-toast"

import jwtDecode from 'jwt-decode';

interface DecodedToken {
  sub: string; // O 'sub' (subject) geralmente contém o ID do usuário no JWT
  exp: number; // Tempo de expiração
}

interface AuthContextType {
  user: ReadUserDTO | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginUserDTO) => Promise<boolean>
  register: (userData: RegisterUserDTO) => Promise<boolean>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ReadUserDTO | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const isAuthenticated = !!user && apiClient.isAuthenticated()

    const fetchAndSetUser = async (token: string) => {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      const userId = decoded.sub; // Extrai o ID do usuário do JWT

      // Use o apiClient para buscar os dados completos do usuário
      const userData = await apiClient.getUser(userId);
      setUser(userData); // Atualiza o estado 'user'
      return true;
    } catch (error) {
      console.error("Failed to decode token or fetch user data:", error);
      await logout(); // Se falhar, faça logout para limpar o token
      return false;
    }
  };


  // Load user data on mount
  useEffect(() => {
    const initAuth = async () => {
      if (apiClient.isAuthenticated()) {
        try {
          // Try to get current user data
          // Note: We need the user ID, which should be stored or decoded from JWT
          // For now, we'll handle this in the login flow
          setIsLoading(false)
        } catch (error) {
          console.error("Failed to load user:", error)
          await logout()
        }
      } else {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (credentials: LoginUserDTO): Promise<boolean> => {
    try {
      setIsLoading(true)
      const tokenResponse = await apiClient.login(credentials)

      if (tokenResponse.tokenJWT) {
        


        toast({
          title: "Login successful",
          description: "Welcome back!",
        })

        // Redirect to dashboard
        router.push("/dashboard")
        return true
      }

      return false
    } catch (error) {
      handleAPIError(error, "Login failed")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: RegisterUserDTO): Promise<boolean> => {
    try {
      setIsLoading(true)
      const createdUser = await apiClient.register(userData)

      if (createdUser.id) {
        toast({
          title: "Registration successful",
          description: "Your account has been created. Please log in.",
        })

        router.push("/login")
        return true
      }

      return false
    } catch (error) {
      handleAPIError(error, "Registration failed")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await apiClient.logout()
      setUser(null)
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      })
      router.push("/")
    } catch (error) {
      handleAPIError(error, "Logout failed")
    }
  }

  const refreshUser = async (): Promise<void> => {
    if (!apiClient.isAuthenticated()) return

    try {
      // In a real implementation, you would decode the JWT to get the user ID
      // or have an endpoint that returns current user info
      // For now, we'll skip this step
    } catch (error) {
      console.error("Failed to refresh user:", error)
      await logout()
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// HOC for protected routes
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push("/login")
      }
    }, [isAuthenticated, isLoading, router])

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      )
    }

    if (!isAuthenticated) {
      return null
    }

    return <Component {...props} />
  }
}
