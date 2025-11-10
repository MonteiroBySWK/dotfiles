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
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface FormIngredientProps {
  ingrediente?: Ingrediente;
  onSuccess?: () => void;
}

export function FormIngredient({ ingrediente, onSuccess }: FormIngredientProps) {
  const { create, update } = useIngredientes();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    nome: ingrediente?.nome || '',
    categoria: ingrediente?.categoria || CategoriaIngrediente.OUTRO,
    unidade: ingrediente?.unidade || UnidadeMedida.UNIDADE,
    estoqueAtual: ingrediente?.estoqueAtual || 0,
    estoqueMinimo: ingrediente?.estoqueMinimo || 0,
    fornecedor: ingrediente?.fornecedor || '',
  });

  const validateField = (name: string, value: any) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'nome':
        if (!value || value.trim().length < 2) {
          newErrors.nome = 'Nome deve ter pelo menos 2 caracteres';
        } else {
          delete newErrors.nome;
        }
        break;
      case 'estoqueAtual':
        if (value < 0) {
          newErrors.estoqueAtual = 'Estoque atual não pode ser negativo';
        } else {
          delete newErrors.estoqueAtual;
        }
        break;
      case 'estoqueMinimo':
        if (value < 0) {
          newErrors.estoqueMinimo = 'Estoque mínimo não pode ser negativo';
        } else if (value > formData.estoqueAtual) {
          newErrors.estoqueMinimo = 'Estoque mínimo não pode ser maior que o atual';
        } else {
          delete newErrors.estoqueMinimo;
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (name: string, value: any) => {
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar todos os campos
    const allValid = ['nome', 'estoqueAtual', 'estoqueMinimo'].every((field) =>
      validateField(field, formData[field as keyof typeof formData])
    );

    if (!allValid) {
      toast.error('Corrija os erros antes de continuar');
      return;
    }

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

  const isEstoqueBaixo = formData.estoqueAtual <= formData.estoqueMinimo && formData.estoqueMinimo > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {/* Nome */}
        <div className="space-y-2">
          <Label htmlFor="nome" className="flex items-center gap-1">
            Nome <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => handleChange('nome', e.target.value)}
              onBlur={() => validateField('nome', formData.nome)}
              placeholder="Ex: Vodka"
              required
              className={`transition-all duration-200 ${
                errors.nome
                  ? 'border-destructive focus-visible:ring-destructive'
                  : formData.nome.length >= 2
                  ? 'border-success focus-visible:ring-success'
                  : ''
              }`}
            />
            {formData.nome.length >= 2 && !errors.nome && (
              <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-success animate-in fade-in-0 zoom-in-50" />
            )}
          </div>
          {errors.nome && (
            <p className="text-xs text-destructive flex items-center gap-1 animate-in fade-in-0 slide-in-from-top-1">
              <AlertCircle className="h-3 w-3" />
              {errors.nome}
            </p>
          )}
        </div>

        {/* Categoria */}
        <div className="space-y-2">
          <Label htmlFor="categoria">
            Categoria <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.categoria}
            onValueChange={(value) => handleChange('categoria', value as CategoriaIngrediente)}
          >
            <SelectTrigger id="categoria" className="transition-all duration-200">
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

        {/* Unidade */}
        <div className="space-y-2">
          <Label htmlFor="unidade">
            Unidade de Medida <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.unidade}
            onValueChange={(value) => handleChange('unidade', value as UnidadeMedida)}
          >
            <SelectTrigger id="unidade" className="transition-all duration-200">
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

        {/* Fornecedor */}
        <div className="space-y-2">
          <Label htmlFor="fornecedor">Fornecedor</Label>
          <Input
            id="fornecedor"
            value={formData.fornecedor}
            onChange={(e) => handleChange('fornecedor', e.target.value)}
            placeholder="Nome do fornecedor"
            className="transition-all duration-200"
          />
        </div>

        {/* Estoque Atual */}
        <div className="space-y-2">
          <Label htmlFor="estoqueAtual" className="flex items-center gap-1">
            Estoque Atual <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Input
              id="estoqueAtual"
              type="number"
              min="0"
              step="0.01"
              value={formData.estoqueAtual}
              onChange={(e) => handleChange('estoqueAtual', parseFloat(e.target.value) || 0)}
              onBlur={() => validateField('estoqueAtual', formData.estoqueAtual)}
              required
              className={`transition-all duration-200 ${
                errors.estoqueAtual
                  ? 'border-destructive focus-visible:ring-destructive'
                  : ''
              }`}
            />
          </div>
          {errors.estoqueAtual && (
            <p className="text-xs text-destructive flex items-center gap-1 animate-in fade-in-0 slide-in-from-top-1">
              <AlertCircle className="h-3 w-3" />
              {errors.estoqueAtual}
            </p>
          )}
        </div>

        {/* Estoque Mínimo */}
        <div className="space-y-2">
          <Label htmlFor="estoqueMinimo" className="flex items-center gap-1">
            Estoque Mínimo <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Input
              id="estoqueMinimo"
              type="number"
              min="0"
              step="0.01"
              value={formData.estoqueMinimo}
              onChange={(e) => handleChange('estoqueMinimo', parseFloat(e.target.value) || 0)}
              onBlur={() => validateField('estoqueMinimo', formData.estoqueMinimo)}
              required
              className={`transition-all duration-200 ${
                errors.estoqueMinimo
                  ? 'border-destructive focus-visible:ring-destructive'
                  : ''
              }`}
            />
          </div>
          {errors.estoqueMinimo && (
            <p className="text-xs text-destructive flex items-center gap-1 animate-in fade-in-0 slide-in-from-top-1">
              <AlertCircle className="h-3 w-3" />
              {errors.estoqueMinimo}
            </p>
          )}
        </div>
      </div>

      {/* Alerta de estoque baixo */}
      {isEstoqueBaixo && !errors.estoqueAtual && !errors.estoqueMinimo && (
        <div className="rounded-lg border border-warning/50 bg-warning/5 p-3 flex items-start gap-2 animate-in fade-in-0 slide-in-from-top-2">
          <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-warning text-sm">Atenção: Estoque baixo</p>
            <p className="text-xs text-muted-foreground mt-1">
              O estoque atual está no nível mínimo ou abaixo. Considere fazer um pedido.
            </p>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button
          type="submit"
          disabled={loading || Object.keys(errors).length > 0}
          className="transition-all duration-200 min-w-[120px]"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
              Salvando...
            </span>
          ) : (
            ingrediente ? 'Atualizar' : 'Cadastrar'
          )}
        </Button>
      </div>
    </form>
  );
}

