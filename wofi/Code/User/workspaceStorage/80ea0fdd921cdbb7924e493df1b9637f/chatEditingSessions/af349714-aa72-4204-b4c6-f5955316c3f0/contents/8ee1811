/**
 * ModalAjusteEstoque - Modal para ajuste manual de estoque
 * Sistema REVIS - REQ-06: Identificação automática de perdas
 */

'use client';

import { useState } from 'react';
import { Ingrediente, TipoMovimentacao } from '@/types';
import { useIngredientes } from '@/hooks/useIngredientes';
import { registrarAjusteEstoque } from '@/lib/business-rules';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';

interface ModalAjusteEstoqueProps {
  ingrediente: Ingrediente | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ModalAjusteEstoque({
  ingrediente,
  open,
  onOpenChange,
}: ModalAjusteEstoqueProps) {
  const { update } = useIngredientes();
  const [novoEstoque, setNovoEstoque] = useState<number>(0);
  const [motivo, setMotivo] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Resetar ao abrir
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && ingrediente) {
      setNovoEstoque(ingrediente.estoqueAtual);
      setMotivo('');
    }
    onOpenChange(newOpen);
  };

  if (!ingrediente) return null;

  const diferenca = novoEstoque - ingrediente.estoqueAtual;
  const isPerdaDetectada = diferenca < 0;
  const isGanho = diferenca > 0;

  const handleSave = async () => {
    if (!motivo.trim()) {
      toast.error('Por favor, informe o motivo do ajuste');
      return;
    }

    setLoading(true);

    try {
      // Atualizar estoque usando regra de negócio
      const resultado = await registrarAjusteEstoque(
        ingrediente.id!,
        novoEstoque,
        motivo,
        update
      );

      if (resultado.success) {
        toast.success(
          isPerdaDetectada
            ? `Perda de ${Math.abs(diferenca)} ${ingrediente.unidade} registrada`
            : `Estoque ajustado com sucesso`
        );
        onOpenChange(false);
      } else {
        toast.error(resultado.error || 'Erro ao ajustar estoque');
      }
    } catch (error) {
      console.error('Erro ao ajustar estoque:', error);
      toast.error('Erro ao ajustar estoque');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Ajustar Estoque</DialogTitle>
          <DialogDescription>
            Ingrediente: <strong>{ingrediente.nome}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Estoque Atual */}
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">Estoque Atual</p>
            <p className="text-2xl font-semibold">
              {ingrediente.estoqueAtual} {ingrediente.unidade}
            </p>
          </div>

          {/* Novo Estoque */}
          <div className="space-y-2">
            <Label htmlFor="novoEstoque">Novo Estoque</Label>
            <div className="flex gap-2">
              <Input
                id="novoEstoque"
                type="number"
                min="0"
                step="0.01"
                value={novoEstoque}
                onChange={(e) => setNovoEstoque(Number(e.target.value))}
                placeholder="0"
              />
              <span className="flex items-center text-sm text-muted-foreground">
                {ingrediente.unidade}
              </span>
            </div>
          </div>

          {/* Indicador de Diferença */}
          {diferenca !== 0 && (
            <div
              className={`flex items-center gap-2 rounded-lg border p-3 ${
                isPerdaDetectada
                  ? 'border-destructive/50 bg-destructive/5'
                  : 'border-success/50 bg-success/5'
              }`}
            >
              {isPerdaDetectada ? (
                <>
                  <TrendingDown className="h-5 w-5 text-destructive" />
                  <div className="flex-1">
                    <p className="font-medium text-destructive">Perda Detectada</p>
                    <p className="text-sm text-muted-foreground">
                      {Math.abs(diferenca)} {ingrediente.unidade} serão registrados como perda
                    </p>
                  </div>
                  <Badge variant="destructive">
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    Perda
                  </Badge>
                </>
              ) : (
                <>
                  <TrendingUp className="h-5 w-5 text-success" />
                  <div className="flex-1">
                    <p className="font-medium text-success">Acréscimo</p>
                    <p className="text-sm text-muted-foreground">
                      +{diferenca} {ingrediente.unidade}
                    </p>
                  </div>
                  <Badge variant="outline" className="border-success text-success">
                    Entrada
                  </Badge>
                </>
              )}
            </div>
          )}

          {/* Motivo */}
          <div className="space-y-2">
            <Label htmlFor="motivo">
              Motivo do Ajuste <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="motivo"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Ex: Quebra no estoque, contagem física, erro de registro..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading || diferenca === 0}>
            {loading ? 'Salvando...' : 'Confirmar Ajuste'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
