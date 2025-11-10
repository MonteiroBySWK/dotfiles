/**
 * FormPedido - Formulário de criação/edição de pedidos
 * Sistema REVIS - REQ-07
 */

'use client';

import { useState, useEffect } from 'react';
import { usePedidos } from '@/hooks/usePedidos';
import { useIngredientes } from '@/hooks/useIngredientes';
import { Pedido, ItemPedido, StatusPedido } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Trash2, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface FormPedidoProps {
  pedido?: Pedido;
  onSuccess?: () => void;
}

export function FormPedido({ pedido, onSuccess }: FormPedidoProps) {
  const { create, update } = usePedidos();
  const { data: ingredientes } = useIngredientes();
  const [loading, setLoading] = useState(false);

  // Form fields
  const [numero, setNumero] = useState('');
  const [fornecedor, setFornecedor] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [itens, setItens] = useState<ItemPedido[]>([]);

  // Item atual sendo adicionado
  const [ingredienteId, setIngredienteId] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [precoUnitario, setPrecoUnitario] = useState('');

  useEffect(() => {
    if (pedido) {
      setNumero(pedido.numero);
      setFornecedor(pedido.fornecedor || '');
      setObservacoes(pedido.observacoes || '');
      setItens(pedido.itens);
    } else {
      // Gerar número automático
      setNumero(`PED-${Date.now().toString().slice(-6)}`);
    }
  }, [pedido]);

  const handleAddItem = () => {
    if (!ingredienteId || !quantidade || !precoUnitario) {
      toast.error('Preencha todos os campos do item');
      return;
    }

    const ingrediente = ingredientes.find(i => i.id === ingredienteId);
    if (!ingrediente) return;

    const novoItem: ItemPedido = {
      ingredienteId,
      ingredienteNome: ingrediente.nome,
      quantidade: Number(quantidade),
      unidade: ingrediente.unidade,
      precoUnitario: Number(precoUnitario),
      subtotal: Number(quantidade) * Number(precoUnitario),
    };

    setItens([...itens, novoItem]);
    
    // Limpar campos
    setIngredienteId('');
    setQuantidade('');
    setPrecoUnitario('');
    
    toast.success('Item adicionado');
  };

  const handleRemoveItem = (index: number) => {
    setItens(itens.filter((_, i) => i !== index));
    toast.success('Item removido');
  };

  const calcularTotal = () => {
    return itens.reduce((acc, item) => acc + item.subtotal, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (itens.length === 0) {
      toast.error('Adicione pelo menos um item ao pedido');
      return;
    }

    if (!fornecedor.trim()) {
      toast.error('Informe o fornecedor');
      return;
    }

    setLoading(true);

    try {
      const pedidoData: Omit<Pedido, 'id'> = {
        numero,
        fornecedor,
        status: StatusPedido.SOLICITADO,
        itens,
        valorTotal: calcularTotal(),
        observacoes: observacoes || undefined,
        documentos: [],
      };

      if (pedido?.id) {
        await update(pedido.id, pedidoData);
        toast.success('Pedido atualizado com sucesso');
      } else {
        await create(pedidoData);
        toast.success('Pedido criado com sucesso');
      }

      onSuccess?.();
    } catch (error) {
      console.error('Erro ao salvar pedido:', error);
      toast.error('Erro ao salvar pedido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informações Básicas */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="numero">
            Número do Pedido <span className="text-destructive">*</span>
          </Label>
          <Input
            id="numero"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            placeholder="PED-001"
            required
            disabled
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fornecedor">
            Fornecedor <span className="text-destructive">*</span>
          </Label>
          <Input
            id="fornecedor"
            value={fornecedor}
            onChange={(e) => setFornecedor(e.target.value)}
            placeholder="Nome do fornecedor"
            required
          />
        </div>
      </div>

      <Separator />

      {/* Adicionar Itens */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Itens do Pedido</h3>

        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-5">
            <Label htmlFor="ingrediente">Ingrediente</Label>
            <Select value={ingredienteId} onValueChange={setIngredienteId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {ingredientes.map((ing) => (
                  <SelectItem key={ing.id} value={ing.id!}>
                    {ing.nome} ({ing.unidade})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2">
            <Label htmlFor="quantidade">Quantidade</Label>
            <Input
              id="quantidade"
              type="number"
              min="0"
              step="0.01"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="col-span-3">
            <Label htmlFor="preco">Preço Unit. (R$)</Label>
            <Input
              id="preco"
              type="number"
              min="0"
              step="0.01"
              value={precoUnitario}
              onChange={(e) => setPrecoUnitario(e.target.value)}
              placeholder="0,00"
            />
          </div>

          <div className="col-span-2 flex items-end">
            <Button
              type="button"
              onClick={handleAddItem}
              className="w-full"
              variant="outline"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Lista de Itens */}
        {itens.length > 0 && (
          <div className="rounded-lg border border-border">
            <div className="grid grid-cols-12 gap-3 bg-muted px-4 py-2 text-sm font-medium">
              <div className="col-span-5">Item</div>
              <div className="col-span-2 text-right">Quantidade</div>
              <div className="col-span-2 text-right">Preço Unit.</div>
              <div className="col-span-2 text-right">Subtotal</div>
              <div className="col-span-1"></div>
            </div>

            {itens.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-3 border-t border-border px-4 py-3 text-sm"
              >
                <div className="col-span-5">
                  <p className="font-medium">{item.ingredienteNome}</p>
                  <p className="text-xs text-muted-foreground">{item.unidade}</p>
                </div>
                <div className="col-span-2 text-right">{item.quantidade}</div>
                <div className="col-span-2 text-right">
                  R$ {item.precoUnitario.toFixed(2)}
                </div>
                <div className="col-span-2 text-right font-medium">
                  R$ {item.subtotal.toFixed(2)}
                </div>
                <div className="col-span-1 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveItem(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}

            <div className="border-t border-border bg-muted px-4 py-3">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total do Pedido:</span>
                <span>R$ {calcularTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <Separator />

      {/* Observações */}
      <div className="space-y-2">
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea
          id="observacoes"
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          placeholder="Informações adicionais sobre o pedido..."
          rows={3}
        />
      </div>

      {/* Ações */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onSuccess} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading || itens.length === 0}>
          {loading ? 'Salvando...' : pedido ? 'Atualizar Pedido' : 'Criar Pedido'}
        </Button>
      </div>
    </form>
  );
}
