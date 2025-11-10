/**
 * ProtectedRoute - Componente de proteção de rotas
 * Sistema REVIS
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { NivelUsuario } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: NivelUsuario[];
}

/**
 * Componente que protege rotas verificando autenticação e autorização
 * 
 * @param children - Conteúdo a ser renderizado se autorizado
 * @param allowedRoles - Níveis de usuário permitidos (opcional)
 */
export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Não autenticado
      if (!user) {
        router.push('/login');
        return;
      }

      // Verificar autorização por nível
      if (allowedRoles && userData) {
        if (!allowedRoles.includes(userData.nivel)) {
          router.push('/acesso-negado');
          return;
        }
      }
    }
  }, [user, userData, loading, allowedRoles, router]);

  // Loading state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="space-y-4 w-full max-w-md p-6">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  // Não autenticado ou não autorizado
  if (!user || (allowedRoles && userData && !allowedRoles.includes(userData.nivel))) {
    return null;
  }

  return <>{children}</>;
}
