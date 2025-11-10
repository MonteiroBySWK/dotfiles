/**
 * Lista de Alertas com filtros
 * Sistema REVIS
 */

'use client';

import { useState } from 'react';
import { useAlertas } from '@/hooks/useAlertas';
import { CardAlerta } from './CardAlerta';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { CheckCheck } from 'lucide-react';

export function ListaAlertas() {
  const { alertas, loading, update } = useAlertas();
  const [filtro, setFiltro] = useState<'todos' | 'nao_lidos'>('nao_lidos');

  const alertasFiltrados = filtro === 'nao_lidos' 
    ? alertas.filter(a => !a.lido)
    : alertas;

  const handleMarcarLido = async (id: string) => {
    try {
      await update(id, { lido: true });
      toast.success('Alerta marcado como lido');
    } catch (error: any) {
      console.error('Erro ao marcar alerta:', error);
      toast.error('Erro ao marcar alerta como lido');
    }
  };

  const handleMarcarTodosLidos = async () => {
    try {
      const alertasNaoLidos = alertas.filter(a => !a.lido);
      await Promise.all(
        alertasNaoLidos.map(alerta => update(alerta.id, { lido: true }))
      );
      toast.success(`${alertasNaoLidos.length} alertas marcados como lidos`);
    } catch (error: any) {
      console.error('Erro ao marcar todos:', error);
      toast.error('Erro ao marcar alertas como lidos');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  const alertasNaoLidos = alertas.filter(a => !a.lido);

  return (
    <div className="space-y-4">
      {/* Header com ações */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-foreground">
            Alertas {alertasNaoLidos.length > 0 && `(${alertasNaoLidos.length} não lidos)`}
          </h3>
        </div>
        
        {alertasNaoLidos.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarcarTodosLidos}
            aria-label="Marcar todos como lidos"
          >
            <CheckCheck className="mr-2 h-4 w-4" aria-hidden="true" />
            Marcar todos como lidos
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={filtro} onValueChange={(value) => setFiltro(value as any)}>
        <TabsList>
          <TabsTrigger value="nao_lidos">
            Não Lidos {alertasNaoLidos.length > 0 && `(${alertasNaoLidos.length})`}
          </TabsTrigger>
          <TabsTrigger value="todos">
            Todos ({alertas.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="nao_lidos" className="space-y-3">
          {alertasNaoLidos.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">
                Nenhum alerta não lido
              </p>
            </div>
          ) : (
            alertasNaoLidos.map((alerta) => (
              <CardAlerta
                key={alerta.id}
                alerta={alerta}
                onMarcarLido={handleMarcarLido}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="todos" className="space-y-3">
          {alertas.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">
                Nenhum alerta registrado
              </p>
            </div>
          ) : (
            alertas.map((alerta) => (
              <CardAlerta
                key={alerta.id}
                alerta={alerta}
                onMarcarLido={handleMarcarLido}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
