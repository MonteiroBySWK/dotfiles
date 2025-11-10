/**
 * Login Page - Sistema REVIS
 * Página de autenticação com design moderno e acessível
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      router.push('/');
    } catch (err: any) {
      console.error('Erro no login:', err);
      
      // Mensagens de erro amigáveis e claras
      const errorMessages: Record<string, string> = {
        'auth/invalid-credential': 'Email ou senha incorretos. Verifique suas credenciais.',
        'auth/user-not-found': 'Usuário não encontrado. Verifique o email digitado.',
        'auth/wrong-password': 'Senha incorreta. Tente novamente.',
        'auth/too-many-requests': 'Muitas tentativas falhadas. Aguarde alguns minutos e tente novamente.',
        'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
      };
      
      setError(errorMessages[err.code] || 'Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <Card className="mx-auto w-full max-w-md animate-scale-in shadow-xl">
        <CardHeader className="space-y-3 text-center">
          {/* Logo animado */}
          <div className="mx-auto mb-2 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-primary shadow-lg transition-transform hover:scale-105">
            <span className="text-4xl font-bold text-primary-foreground">R</span>
          </div>
          
          <CardTitle className="text-2xl font-semibold text-foreground">
            Sistema REVIS
          </CardTitle>
          <CardDescription className="text-sm">
            Gestão de Estoque e Produção
            <br />
            <span className="text-xs">Entre com suas credenciais para acessar</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Alerta de erro com melhor visibilidade */}
            {error && (
              <Alert variant="destructive" className="animate-slide-up">
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Campo de Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail 
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" 
                  aria-hidden="true"
                />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="email"
                  className="pl-10 transition-all focus:ring-2 focus:ring-primary"
                  aria-label="Digite seu email"
                />
              </div>
            </div>

            {/* Campo de Senha */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Senha
              </Label>
              <div className="relative">
                <Lock 
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" 
                  aria-hidden="true"
                />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="current-password"
                  className="pl-10 transition-all focus:ring-2 focus:ring-primary"
                  aria-label="Digite sua senha"
                  minLength={6}
                />
              </div>
            </div>

            {/* Botão de Login */}
            <Button
              type="submit"
              className="w-full gap-2 transition-all duration-200 hover:shadow-lg"
              disabled={loading}
              aria-label={loading ? 'Entrando no sistema...' : 'Entrar no sistema'}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  <span>Entrando...</span>
                </>
              ) : (
                <span>Entrar</span>
              )}
            </Button>
          </form>

          {/* Informações adicionais */}
          <div className="mt-6 space-y-2 border-t border-border pt-4 text-center">
            <p className="text-xs text-muted-foreground">
              Sistema de Gestão Integrada
            </p>
            <p className="text-xs font-medium text-muted-foreground">
              <span className="text-primary">REVIS</span> © 2025
            </p>
          </div>
        </CardContent>
      </Card>
    </PublicLayout>
  );
}
