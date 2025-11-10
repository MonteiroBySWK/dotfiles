/**
 * ProtectedRoute - Componente de proteção de rotas
 * Sistema REVIS
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { NivelUsuario } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const [timeoutError, setTimeoutError] = useState(false);

  // Timeout de 10 segundos para evitar loading infinito
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.error('Timeout ao carregar autenticação');
        setTimeoutError(true);
      }
    }, 10000);

    return () => clearTimeout(timeout);
  }, [loading]);

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
  if (loading && !timeoutError) {
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

  // Erro de timeout
  if (timeoutError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center space-y-4 p-6 max-w-md">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <h2 className="text-xl font-semibold">Erro de Conexão</h2>
          <p className="text-muted-foreground">
            Não foi possível conectar ao Firebase. 
            Verifique sua conexão com a internet e as configurações do projeto.
          </p>
          <Button onClick={() => window.location.reload()}>
            Tentar Novamente
          </Button>
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
