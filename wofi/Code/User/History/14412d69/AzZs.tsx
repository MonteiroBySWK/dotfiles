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
import { AlertCircle, Loader2, Lock, Mail, TrendingUp } from 'lucide-react';
import Image from 'next/image';

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
      <div className="container mx-auto flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader className="space-y-4 text-center pb-8">
            {/* Logo com imagem real */}
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-[#8666e3] shadow-xl transition-transform hover:scale-105 overflow-hidden">
              <div className="relative h-full w-full p-3">
                <Image
                  src="/logo.png"
                  alt="REVIS Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Sistema REVIS
              </CardTitle>
              <CardDescription className="text-base">
                Gestão de Estoque e Produção de Bebidas
              </CardDescription>
              <p className="text-xs text-muted-foreground">
                Entre com suas credenciais para acessar o sistema
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-5">
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
          <div className="mt-4 space-y-2 border-t border-border pt-6 text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Sistema de Gestão Integrada</span>
            </div>
            <p className="text-xs font-medium text-muted-foreground">
              <span className="text-primary">REVIS</span> © 2025
            </p>
          </div>
        </CardContent>
      </Card>
      </div>
    </PublicLayout>
  );
}
