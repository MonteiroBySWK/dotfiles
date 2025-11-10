/**
 * FormVenda - Formulário de registro de venda
 * Sistema REVIS - Histórico de vendas para previsão de demanda
 */

'use client';

import { useState, useEffect } from 'react';
import { useVendas } from '@/hooks/useVendas';
import { useEventos } from '@/hooks/useEventos';
import { usePontosVenda } from '@/hooks/usePontosVenda';
import { useProdutos } from '@/hooks/useProdutos';
import { Venda } from '@/types';
import { Timestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { DollarSign, Package, MapPin, Calendar } from 'lucide-react';

interface FormVendaProps {
  venda?: Venda;
  eventoIdPadrao?: string;
  onSuccess?: () => void;
}

export function FormVenda({ venda, eventoIdPadrao, onSuccess }: FormVendaProps) {
  const { create, update } = useVendas();
  const { eventos } = useEventos();
  const { pontosVenda } = usePontosVenda();
  const { data: produtos } = useProdutos();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    eventoId: eventoIdPadrao || '',
    pontoVendaId: '',
    produtoId: '',
    quantidade: 1,
    valor: 0,
    dataVenda: new Date().toISOString().slice(0, 16), // datetime-local format
  });

  useEffect(() => {
    if (venda) {
      setFormData({
        eventoId: venda.eventoId,
        pontoVendaId: venda.pontoVendaId,
        produtoId: venda.produtoId,
        quantidade: venda.quantidade,
        valor: venda.valor,
        dataVenda: venda.dataVenda.toDate().toISOString().slice(0, 16),
      });
    }
  }, [venda]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validações
      if (!formData.eventoId || !formData.pontoVendaId || !formData.produtoId) {
        toast.error('Preencha todos os campos obrigatórios');
        return;
      }

      if (formData.quantidade <= 0) {
        toast.error('Quantidade deve ser maior que zero');
        return;
      }

      if (formData.valor < 0) {
        toast.error('Valor não pode ser negativo');
        return;
      }

      const vendaData: Omit<Venda, 'id' | 'criadoEm'> = {
        eventoId: formData.eventoId,
        pontoVendaId: formData.pontoVendaId,
        produtoId: formData.produtoId,
        quantidade: formData.quantidade,
        valor: formData.valor,
        dataVenda: Timestamp.fromDate(new Date(formData.dataVenda)),
        criadoEm: Timestamp.now(),
      };

      if (venda) {
        await update(venda.id, vendaData);
        toast.success('Venda atualizada com sucesso!');
      } else {
        await create(vendaData);
        toast.success('Venda registrada com sucesso!');
        
        // Limpar formulário após criar
        setFormData({
          eventoId: eventoIdPadrao || formData.eventoId,
          pontoVendaId: formData.pontoVendaId,
          produtoId: '',
          quantidade: 1,
          valor: 0,
          dataVenda: new Date().toISOString().slice(0, 16),
        });
      }

      onSuccess?.();
    } catch (error: any) {
      console.error('Erro ao salvar venda:', error);
      toast.error(error.message || 'Erro ao salvar venda');
    } finally {
      setLoading(false);
    }
  };

  const eventosAtivos = eventos.filter(e => {
    const hoje = new Date();
    const dataInicio = e.dataInicio.toDate();
    const dataFim = e.dataFim.toDate();
    return dataInicio <= hoje && dataFim >= hoje;
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Evento */}
      <div className="space-y-2">
        <Label htmlFor="eventoId">
          <Calendar className="mr-2 inline h-4 w-4" aria-hidden="true" />
          Evento *
        </Label>
        <Select
          value={formData.eventoId}
          onValueChange={(value) => setFormData({ ...formData, eventoId: value })}
          disabled={!!eventoIdPadrao}
        >
          <SelectTrigger id="eventoId" aria-label="Selecione o evento">
            <SelectValue placeholder="Selecione o evento" />
          </SelectTrigger>
          <SelectContent>
            {eventosAtivos.length === 0 && (
              <SelectItem value="none" disabled>
                Nenhum evento ativo
              </SelectItem>
            )}
            {eventosAtivos.map((evento) => (
              <SelectItem key={evento.id} value={evento.id}>
                {evento.nome} - {evento.local}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Ponto de Venda */}
      <div className="space-y-2">
        <Label htmlFor="pontoVendaId">
          <MapPin className="mr-2 inline h-4 w-4" aria-hidden="true" />
          Ponto de Venda *
        </Label>
        <Select
          value={formData.pontoVendaId}
          onValueChange={(value) => setFormData({ ...formData, pontoVendaId: value })}
        >
          <SelectTrigger id="pontoVendaId" aria-label="Selecione o ponto de venda">
            <SelectValue placeholder="Selecione o ponto de venda" />
          </SelectTrigger>
          <SelectContent>
            {pontosVenda.length === 0 && (
              <SelectItem value="none" disabled>
                Nenhum ponto de venda cadastrado
              </SelectItem>
            )}
            {pontosVenda.map((ponto) => (
              <SelectItem key={ponto.id} value={ponto.id}>
                {ponto.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Produto */}
      <div className="space-y-2">
        <Label htmlFor="produtoId">
          <Package className="mr-2 inline h-4 w-4" aria-hidden="true" />
          Produto *
        </Label>
        <Select
          value={formData.produtoId}
          onValueChange={(value) => setFormData({ ...formData, produtoId: value })}
        >
          <SelectTrigger id="produtoId" aria-label="Selecione o produto">
            <SelectValue placeholder="Selecione o produto" />
          </SelectTrigger>
          <SelectContent>
            {produtos.filter(p => p.ativo).map((produto) => (
              <SelectItem key={produto.id} value={produto.id}>
                {produto.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Quantidade */}
        <div className="space-y-2">
          <Label htmlFor="quantidade">Quantidade *</Label>
          <Input
            id="quantidade"
            type="number"
            min="1"
            value={formData.quantidade}
            onChange={(e) => setFormData({ ...formData, quantidade: Number(e.target.value) })}
            required
          />
        </div>

        {/* Valor */}
        <div className="space-y-2">
          <Label htmlFor="valor">
            <DollarSign className="mr-2 inline h-4 w-4" aria-hidden="true" />
            Valor (R$) *
          </Label>
          <Input
            id="valor"
            type="number"
            step="0.01"
            min="0"
            value={formData.valor}
            onChange={(e) => setFormData({ ...formData, valor: Number(e.target.value) })}
            required
          />
        </div>

        {/* Data/Hora da Venda */}
        <div className="space-y-2">
          <Label htmlFor="dataVenda">Data/Hora *</Label>
          <Input
            id="dataVenda"
            type="datetime-local"
            value={formData.dataVenda}
            onChange={(e) => setFormData({ ...formData, dataVenda: e.target.value })}
            required
          />
        </div>
      </div>

      {/* Valor Total */}
      <div className="rounded-lg border border-border bg-muted p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Valor Total:</span>
          <span className="text-2xl font-semibold text-foreground">
            R$ {(formData.quantidade * formData.valor).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Ações */}
      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : venda ? 'Atualizar Venda' : 'Registrar Venda'}
        </Button>
      </div>
    </form>
  );
}
