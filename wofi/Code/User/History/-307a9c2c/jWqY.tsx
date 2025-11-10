/**
 * Card de Alerta Individual
 * Sistema REVIS - REQ-04, REQ-15
 */

'use client';

import { Alerta } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Clock, Package } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CardAlertaProps {
  alerta: Alerta;
  onMarcarLido: (id: string) => void;
}

export function CardAlerta({ alerta, onMarcarLido }: CardAlertaProps) {
  const getIcon = () => {
    switch (alerta.tipo) {
      case 'estoque_baixo':
        return <Package className="h-5 w-5 text-destructive" aria-hidden="true" />;
      case 'validade_proxima':
        return <Clock className="h-5 w-5 text-warning" aria-hidden="true" />;
      case 'perda_registrada':
        return <AlertTriangle className="h-5 w-5 text-warning" aria-hidden="true" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-muted-foreground" aria-hidden="true" />;
    }
  };

  const getTipoBadge = () => {
    switch (alerta.tipo) {
      case 'estoque_baixo':
        return <Badge variant="destructive">Estoque Baixo</Badge>;
      case 'validade_proxima':
        return <Badge variant="outline" className="border-warning text-warning">Vencimento Próximo</Badge>;
      case 'perda_registrada':
        return <Badge variant="outline" className="border-warning text-warning">Perda</Badge>;
      default:
        return <Badge variant="outline">Outro</Badge>;
    }
  };

  return (
    <div
      className={`rounded-lg border p-4 transition-colors ${
        alerta.lido ? 'border-border bg-muted/50' : 'border-primary/20 bg-card'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Ícone */}
        <div className="flex-shrink-0">{getIcon()}</div>

        {/* Conteúdo */}
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-medium text-foreground">{alerta.titulo}</h3>
              <p className="text-sm text-muted-foreground">{alerta.mensagem}</p>
            </div>
            {getTipoBadge()}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {format(alerta.criadoEm.toDate(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
            </span>

            {!alerta.lido && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMarcarLido(alerta.id)}
                aria-label="Marcar como lido"
              >
                <CheckCircle className="mr-2 h-4 w-4" aria-hidden="true" />
                Marcar como lido
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
