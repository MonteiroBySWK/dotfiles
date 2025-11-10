/**
 * CardLoteDetalhes - Detalhes e execução do lote de produção
 * Sistema REVIS - REQ-12, REQ-13
 */

'use client';

import { useState } from 'react';
import { LoteProducao, StatusLoteProducao, TipoMovimentacao } from '@/types';
import { useLotesProducao } from '@/hooks/useLotesProducao';
import { useIngredientes } from '@/hooks/useIngredientes';
import { useProdutos } from '@/hooks/useProdutos';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Calendar, Package, CheckCircle, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CardLoteDetalhesProps {
  lote: LoteProducao;
  onClose: () => void;
}

export function CardLoteDetalhes({ lote, onClose }: CardLoteDetalhesProps) {
  const { update } = useLotesProducao();
  const { update: updateIngrediente, data: ingredientes } = useIngredientes();
  const { data: produtos } = useProdutos();
  const [loading, setLoading] = useState(false);

  const dataProducao = lote.dataProducao?.toDate
    ? lote.dataProducao.toDate()
    : new Date(lote.dataProducao as any);

  const handleExecutarProducao = async () => {
    if (lote.status === StatusLoteProducao.EXECUTADO) {
      toast.error('Lote já foi executado');
      return;
    }

    setLoading(true);

    try {
      // 1. Atualizar status do lote
      await update(lote.id!, {
        status: StatusLoteProducao.EXECUTADO,
        dataExecucao: new Date() as any,
      });

      // 2. Consumir ingredientes do estoque (REQ-13)
      for (const [ingredienteId, quantidadeConsumida] of Object.entries(lote.consumoCalculado)) {
        const ingrediente = ingredientes.find(i => i.id === ingredienteId);
        if (!ingrediente) continue;

        const novoEstoque = ingrediente.estoqueAtual - quantidadeConsumida;

        // Adicionar ao histórico
        const historico = ingrediente.historico || [];
        historico.push({
          data: new Date() as any,
          tipo: TipoMovimentacao.SAIDA,
          quantidade: quantidadeConsumida,
          origem: `Produção do dia ${format(dataProducao, 'dd/MM/yyyy', { locale: ptBR })}`,
          observacao: `Consumo na produção`,
        });

        await updateIngrediente(ingredienteId, {
          estoqueAtual: novoEstoque,
          historico,
        });
      }

      // 3. TODO: Criar lotes de produtos acabados com validade (REQ-14, REQ-15, REQ-16)
      // Isso será implementado quando criarmos o controle de produtos acabados

      toast.success('Produção executada com sucesso! Estoque atualizado.');
      onClose();
    } catch (error) {
      console.error('Erro ao executar produção:', error);
      toast.error('Erro ao executar produção');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-bold">
              {format(dataProducao, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </h2>
          </div>
          {lote.status === StatusLoteProducao.PLANEJADO ? (
            <Badge variant="secondary">Aguardando Execução</Badge>
          ) : (
            <Badge variant="outline" className="border-success text-success">
              <CheckCircle className="mr-1 h-3 w-3" />
              Executado
            </Badge>
          )}
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-primary">
            {lote.configDistribuicao.totalDrinks}
          </p>
          <p className="text-sm text-muted-foreground">Drinks Planejados</p>
        </div>
      </div>

      <Separator />

      {/* Distribuição de Produtos */}
      <div className="space-y-3">
        <h3 className="font-medium flex items-center gap-2">
          <Package className="h-4 w-4" />
          Distribuição de Produtos
        </h3>
        <div className="space-y-2">
          {lote.itensPlanejados.map((item, index) => {
            const percentual = (item.quantidadeFinal / lote.configDistribuicao.totalDrinks) * 100;
            
            return (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.produtoNome}</span>
                  <span className="text-muted-foreground">
                    {item.quantidadeFinal} unidades ({percentual.toFixed(1)}%)
                  </span>
                </div>
                <Progress value={percentual} className="h-2" />
              </div>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* Consumo de Insumos */}
      <div className="space-y-3">
        <h3 className="font-medium">Consumo de Insumos Calculado (REQ-13)</h3>
        <div className="rounded-lg border border-border divide-y divide-border">
          {Object.entries(lote.consumoCalculado).map(([ingredienteId, quantidade]) => {
            const ingrediente = ingredientes.find(i => i.id === ingredienteId);
            const disponivel = ingrediente?.estoqueAtual || 0;
            const suficiente = disponivel >= quantidade;
            const percentualDisponivel = disponivel > 0 ? (quantidade / disponivel) * 100 : 0;

            return (
              <div key={ingredienteId} className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium">{ingrediente?.nome}</p>
                    <p className="text-sm text-muted-foreground">
                      Consumo: {quantidade} {ingrediente?.unidade}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant={suficiente ? 'outline' : 'destructive'}>
                      {suficiente ? 'Disponível' : 'Insuficiente'}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">
                      Estoque: {disponivel} {ingrediente?.unidade}
                    </p>
                  </div>
                </div>
                {suficiente && (
                  <div className="space-y-1">
                    <Progress value={Math.min(percentualDisponivel, 100)} className="h-1" />
                    <p className="text-xs text-muted-foreground text-right">
                      Após produção: {(disponivel - quantidade).toFixed(2)} {ingrediente?.unidade}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {lote.observacoes && (
        <>
          <Separator />
          <div className="space-y-2">
            <h3 className="font-medium">Observações</h3>
            <p className="text-sm text-muted-foreground">{lote.observacoes}</p>
          </div>
        </>
      )}

      <Separator />

      {/* Verificação de Estoque */}
      {lote.status === StatusLoteProducao.PLANEJADO && (
        <>
          {Object.entries(lote.consumoCalculado).some(([id, qtd]) => {
            const ing = ingredientes.find(i => i.id === id);
            return !ing || ing.estoqueAtual < qtd;
          }) && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
              <div className="flex gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
                <div>
                  <p className="font-medium text-destructive">Estoque Insuficiente</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Alguns ingredientes não possuem estoque suficiente para executar esta produção.
                    Realize pedidos antes de executar.
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Ações */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose} disabled={loading}>
          Fechar
        </Button>

        {lote.status === StatusLoteProducao.PLANEJADO && (
          <Button
            onClick={handleExecutarProducao}
            disabled={
              loading ||
              Object.entries(lote.consumoCalculado).some(([id, qtd]) => {
                const ing = ingredientes.find(i => i.id === id);
                return !ing || ing.estoqueAtual < qtd;
              })
            }
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            {loading ? 'Executando...' : 'Executar Produção'}
          </Button>
        )}
      </div>
    </div>
  );
}
