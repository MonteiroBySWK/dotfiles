'use client';

import Link from 'next/link';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';

export default function AcessoNegadoPage() {
  return (
    <PublicLayout withGradient={false}>
      <Card className="mx-auto w-full max-w-md animate-scale-in text-center shadow-xl">
        <CardHeader className="space-y-4">
          {/* Ícone de alerta */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 transition-transform hover:scale-105">
            <ShieldAlert className="h-10 w-10 text-destructive" aria-hidden="true" />
          </div>
          
          <div className="space-y-2">
            <CardTitle className="text-2xl font-semibold text-foreground">
              Acesso Negado
            </CardTitle>
            <CardDescription className="text-sm">
              Você não possui permissão para acessar este recurso
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Mensagem explicativa */}
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">
              Esta página ou funcionalidade está restrita para seu nível de acesso.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Entre em contato com o administrador do sistema se você acredita que isto é um erro.
            </p>
          </div>

          {/* Ações */}
          <div className="flex flex-col gap-2">
            <Link href="/" className="w-full">
              <Button className="w-full gap-2" aria-label="Voltar para a página inicial">
                <Home className="h-4 w-4" aria-hidden="true" />
                Voltar ao Início
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="w-full gap-2"
              aria-label="Voltar para a página anterior"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Página Anterior
            </Button>
          </div>

          {/* Footer com informações de contato */}
          <div className="border-t border-border pt-4">
            <p className="text-xs text-muted-foreground">
              Precisa de ajuda?{' '}
              <span className="font-medium text-primary">
                Entre em contato com o suporte
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </PublicLayout>
  );
}
