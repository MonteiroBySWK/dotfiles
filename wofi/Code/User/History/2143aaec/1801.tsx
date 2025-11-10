/**
 * Card de Detalhes do Evento
 * Sistema REVIS
 */

'use client';

import { useEffect, useState } from 'react';
import { useFirestore } from '@/hooks/useFirestore';
import { Evento, LoteProducao, Venda } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, MapPin, Users, Package, DollarSign, Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CardEventoDetalhesProps {
  eventoId: string;
}

export function CardEventoDetalhes({ eventoId }: CardEventoDetalhesProps) {
  const { getById } = useFirestore<Evento>({ collection: 'eventos' });
  const { getById: getLote } = useFirestore<LoteProducao>({ collection: 'lotesProducao' });
  const { getById: getVenda } = useFirestore<Venda>({ collection: 'vendas' });

  const [evento, setEvento] = useState<Evento | null>(null);
  const [lotes, setLotes] = useState<LoteProducao[]>([]);
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEventoDetalhes = async () => {
      try {
        const eventoData = await getById(eventoId);
        if (!eventoData) {
          setLoading(false);
          return;
        }
        setEvento(eventoData);
      } catch (error) {
        console.error('Erro ao carregar detalhes do evento:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEventoDetalhes();
  }, [eventoId, getById]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!evento) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Evento não encontrado.</p>
      </div>
    );
  }

  const getStatusBadge = () => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataEvento = evento.dataInicio.toDate();
    dataEvento.setHours(0, 0, 0, 0);

    if (dataEvento < hoje) {
      return <Badge variant="secondary">Realizado</Badge>;
    } else if (dataEvento.getTime() === hoje.getTime()) {
      return <Badge className="bg-primary text-white">Hoje</Badge>;
    } else {
      return <Badge variant="outline">Agendado</Badge>;
    }
  };

  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-6">
        {/* Informações Principais */}
        <div className="rounded-lg border border-border bg-surface p-6">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">{evento.nome}</h2>
              {evento.descricao && (
                <p className="mt-1 text-sm text-muted-foreground">{evento.descricao}</p>
              )}
            </div>
            {getStatusBadge()}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">
                {format(evento.dataInicio.toDate(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">{evento.local}</span>
            </div>
            {evento.vendasPrevistas && (
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">
                  {evento.vendasPrevistas} vendas previstas
                  {evento.vendasReais && ` (${evento.vendasReais} realizadas)`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Resumo */}
        <div className="rounded-lg border border-border bg-surface p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Resumo do Evento</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Vendas Previstas:</span>
              <span className="font-medium text-foreground">
                {evento.vendasPrevistas || 'Não informado'}
              </span>
            </div>
            {evento.vendasReais && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Vendas Realizadas:</span>
                <span className="font-medium text-success">{evento.vendasReais}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
