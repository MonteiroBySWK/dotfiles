/**
 * CardPedidoDetalhes - Card com detalhes completos do pedido
 * Sistema REVIS - REQ-08
 */

'use client';

import { useState } from 'react';
import { Pedido, StatusPedido } from '@/types';
import { usePedidos } from '@/hooks/usePedidos';
import { useIngredientes } from '@/hooks/useIngredientes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Package, Truck, CheckCircle, Calendar, User, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CardPedidoDetalhesProps {
  pedido: Pedido;
  onClose: () => void;
}

export function CardPedidoDetalhes({ pedido, onClose }: CardPedidoDetalhesProps) {
  const { update } = usePedidos();
  const { update: updateIngrediente, data: ingredientes } = useIngredientes();
  const [status, setStatus] = useState(pedido.status);
  const [loading, setLoading] = useState(false);

  const dataSolicitacao = pedido.dataSolicitacao?.toDate
    ? pedido.dataSolicitacao.toDate()
    : new Date(pedido.dataSolicitacao as any);

  const handleStatusChange = async (newStatus: StatusPedido) => {
    setStatus(newStatus);
  };

  const handleConfirmarRecebimento = async () => {
    setLoading(true);

    try {
      // Atualizar status do pedido
      await update(pedido.id!, {
        status: StatusPedido.RECEBIDO,
        dataRecebimento: new Date() as any,
      });

      // Atualizar estoque dos ingredientes (REQ-09)
      for (const item of pedido.itens) {
        const ingrediente = ingredientes.find(i => i.id === item.ingredienteId);
        if (ingrediente) {
          const novoEstoque = ingrediente.estoqueAtual + item.quantidade;
          
          // Adicionar ao histórico
          const historico = ingrediente.historico || [];
          historico.push({
            data: new Date() as any,
            tipo: 'entrada' as any,
            quantidade: item.quantidade,
            origem: `Pedido ${pedido.numero}`,
            observacao: `Recebimento do pedido`,
          });

          await updateIngrediente(item.ingredienteId, {
            estoqueAtual: novoEstoque,
            historico,
          });
        }
      }

      toast.success('Pedido recebido e estoque atualizado com sucesso');
      onClose();
    } catch (error) {
      console.error('Erro ao confirmar recebimento:', error);
      toast.error('Erro ao confirmar recebimento');
    } finally {
      setLoading(false);
    }
  };

  const handleSalvarStatus = async () => {
    if (status === pedido.status) {
      toast.info('Status não foi alterado');
      return;
    }

    setLoading(true);

    try {
      await update(pedido.id!, { status });
      toast.success('Status atualizado com sucesso');
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">{pedido.numero}</h2>
          <p className="text-muted-foreground">{pedido.fornecedor}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">
            R$ {pedido.valorTotal.toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground">Valor Total</p>
        </div>
      </div>

      <Separator />

      {/* Informações */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Data da Solicitação</p>
            <p className="text-sm text-muted-foreground">
              {format(dataSolicitacao, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Solicitado por</p>
            <p className="text-sm text-muted-foreground">{pedido.solicitadoPor || '-'}</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Status */}
      <div className="space-y-3">
        <h3 className="font-medium">Status do Pedido</h3>
        <Select value={status} onValueChange={(value) => handleStatusChange(value as StatusPedido)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={StatusPedido.SOLICITADO}>Solicitado</SelectItem>
            <SelectItem value={StatusPedido.SEPARACAO}>Em Separação</SelectItem>
            <SelectItem value={StatusPedido.ENTREGA}>Em Entrega</SelectItem>
            <SelectItem value={StatusPedido.RECEBIDO}>Recebido</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Itens */}
      <div className="space-y-3">
        <h3 className="font-medium">Itens do Pedido</h3>
        <div className="rounded-lg border border-border">
          {pedido.itens.map((item, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 ${
                index !== 0 ? 'border-t border-border' : ''
              }`}
            >
              <div className="flex-1">
                <p className="font-medium">{item.ingredienteNome}</p>
                <p className="text-sm text-muted-foreground">
                  {item.quantidade} {item.unidade}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">R$ {(item.quantidade * item.preco).toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">
                  R$ {item.preco.toFixed(2)} / {item.unidade}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {pedido.observacoes && (
        <>
          <Separator />
          <div className="space-y-2">
            <h3 className="font-medium">Observações</h3>
            <p className="text-sm text-muted-foreground">{pedido.observacoes}</p>
          </div>
        </>
      )}

      <Separator />

      {/* Ações */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose} disabled={loading}>
          Fechar
        </Button>

        {status !== pedido.status && status !== StatusPedido.RECEBIDO && (
          <Button onClick={handleSalvarStatus} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Status'}
          </Button>
        )}

        {status === StatusPedido.RECEBIDO && pedido.status !== StatusPedido.RECEBIDO && (
          <Button onClick={handleConfirmarRecebimento} disabled={loading}>
            <CheckCircle className="mr-2 h-4 w-4" />
            {loading ? 'Processando...' : 'Confirmar Recebimento'}
          </Button>
        )}
      </div>
    </div>
  );
}
