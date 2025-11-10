/**
 * FormIngredient - Formulário de cadastro/edição de ingrediente
 * Sistema REVIS
 */

'use client';

import { useState } from 'react';
import { useIngredientes } from '@/hooks/useIngredientes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CategoriaIngrediente, UnidadeMedida, Ingrediente } from '@/types';
import { toast } from 'sonner';

interface FormIngredientProps {
  ingrediente?: Ingrediente;
  onSuccess?: () => void;
}

export function FormIngredient({ ingrediente, onSuccess }: FormIngredientProps) {
  const { create, update } = useIngredientes();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nome: ingrediente?.nome || '',
    categoria: ingrediente?.categoria || CategoriaIngrediente.OUTRO,
    unidade: ingrediente?.unidade || UnidadeMedida.UNIDADE,
    estoqueAtual: ingrediente?.estoqueAtual || 0,
    estoqueMinimo: ingrediente?.estoqueMinimo || 0,
    fornecedor: ingrediente?.fornecedor || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (ingrediente) {
        await update(ingrediente.id, formData);
        toast.success('Ingrediente atualizado com sucesso!');
      } else {
        await create({
          ...formData,
          historico: [],
        } as any);
        toast.success('Ingrediente cadastrado com sucesso!');
      }

      onSuccess?.();
    } catch (error) {
      console.error('Erro ao salvar ingrediente:', error);
      toast.error('Erro ao salvar ingrediente. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome *</Label>
          <Input
            id="nome"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            placeholder="Ex: Vodka"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoria">Categoria *</Label>
          <Select
            value={formData.categoria}
            onValueChange={(value) => setFormData({ ...formData, categoria: value as CategoriaIngrediente })}
          >
            <SelectTrigger id="categoria">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(CategoriaIngrediente).map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="unidade">Unidade de Medida *</Label>
          <Select
            value={formData.unidade}
            onValueChange={(value) => setFormData({ ...formData, unidade: value as UnidadeMedida })}
          >
            <SelectTrigger id="unidade">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(UnidadeMedida).map((un) => (
                <SelectItem key={un} value={un}>
                  {un}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fornecedor">Fornecedor</Label>
          <Input
            id="fornecedor"
            value={formData.fornecedor}
            onChange={(e) => setFormData({ ...formData, fornecedor: e.target.value })}
            placeholder="Nome do fornecedor"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="estoqueAtual">Estoque Atual *</Label>
          <Input
            id="estoqueAtual"
            type="number"
            min="0"
            step="0.01"
            value={formData.estoqueAtual}
            onChange={(e) => setFormData({ ...formData, estoqueAtual: parseFloat(e.target.value) })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="estoqueMinimo">Estoque Mínimo *</Label>
          <Input
            id="estoqueMinimo"
            type="number"
            min="0"
            step="0.01"
            value={formData.estoqueMinimo}
            onChange={(e) => setFormData({ ...formData, estoqueMinimo: parseFloat(e.target.value) })}
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : ingrediente ? 'Atualizar' : 'Cadastrar'}
        </Button>
      </div>
    </form>
  );
}
