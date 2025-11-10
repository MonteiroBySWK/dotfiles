/**
 * FormLoteProducao - Formulário de planejamento de produção
 * Sistema REVIS - REQ-12, REQ-13, REQ-17
 */

'use client';

import { useState, useEffect } from 'react';
import { useLotesProducao } from '@/hooks/useLotesProducao';
import { useProdutos } from '@/hooks/useProdutos';
import { useIngredientes } from '@/hooks/useIngredientes';
import { LoteProducao, ItemPlanejado, StatusLoteProducao } from '@/types';
import { calcularDistribuicao, calcularConsumoProducao } from '@/lib/business-rules';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { AlertTriangle, Calculator, Package, TrendingUp } from 'lucide-react';

interface FormLoteProducaoProps {
  lote?: LoteProducao;
  onSuccess?: () => void;
}

export function FormLoteProducao({ lote, onSuccess }: FormLoteProducaoProps) {
  const { create, update } = useLotesProducao();
  const { data: produtos } = useProdutos();
  const { data: ingredientes } = useIngredientes();
  const [loading, setLoading] = useState(false);

  // Form fields
  const [dataProducao, setDataProducao] = useState('');
  const [totalDrinks, setTotalDrinks] = useState<number>(0);
  const [percentuais, setPercentuais] = useState<Record<string, number>>({});
  const [itensPlanejados, setItensPlanejados] = useState<ItemPlanejado[]>([]);
  const [consumoCalculado, setConsumoCalculado] = useState<Record<string, number>>({});
  const [alertas, setAlertas] = useState<string[]>([]);

  useEffect(() => {
    if (lote) {
      setDataProducao(lote.dataProducao?.toDate?.()?.toISOString().split('T')[0] || '');
      setItensPlanejados(lote.itensPlanejados);
      setConsumoCalculado(lote.consumoCalculado);
    } else {
      // Inicializar percentuais padrão
      const percentuaisPadrao: Record<string, number> = {};
      produtos.forEach(produto => {
        percentuaisPadrao[produto.id!] = 0;
      });
      setPercentuais(percentuaisPadrao);
    }
  }, [lote, produtos]);

  // Calcular distribuição quando totalDrinks ou percentuais mudam
  useEffect(() => {
    if (totalDrinks > 0 && produtos.length > 0) {
      handleCalcularDistribuicao();
    }
  }, [totalDrinks]);

  const handlePercentualChange = (produtoId: string, valor: number) => {
    setPercentuais(prev => ({
      ...prev,
      [produtoId]: valor,
    }));
  };

  const handleCalcularDistribuicao = () => {
    if (totalDrinks <= 0) {
      toast.error('Informe o total de drinks');
      return;
    }

    const totalPercentual = Object.values(percentuais).reduce((sum, val) => sum + val, 0);
    if (Math.abs(totalPercentual - 100) > 0.1) {
      toast.error(`Total de percentuais deve ser 100% (atual: ${totalPercentual.toFixed(1)}%)`);
      return;
    }

    // REQ-17: Calcular distribuição automática
    const distribuicao = calcularDistribuicao(totalDrinks, percentuais);

    const itens: ItemPlanejado[] = Object.entries(distribuicao).map(([produtoId, quantidade]) => {
      const produto = produtos.find(p => p.id === produtoId);
      return {
        produtoId,
        produtoNome: produto?.nome || '',
        quantidadeSugerida: quantidade,
        quantidadeFinal: quantidade,
      };
    });

    setItensPlanejados(itens);
    toast.success('Distribuição calculada com sucesso');
  };

  const handleQuantidadeFinalChange = (index: number, valor: number) => {
    const novosItens = [...itensPlanejados];
    novosItens[index].quantidadeFinal = valor;
    setItensPlanejados(novosItens);
  };

  const handleCalcularConsumo = async () => {
    if (itensPlanejados.length === 0) {
      toast.error('Calcule a distribuição primeiro');
      return;
    }

    // REQ-13: Calcular consumo de insumos
    const consumo = await calcularConsumoProducao(itensPlanejados, produtos);
    setConsumoCalculado(consumo);

    // Verificar disponibilidade de estoque
    const novosAlertas: string[] = [];
    Object.entries(consumo).forEach(([ingredienteId, quantidadeNecessaria]) => {
      const ingrediente = ingredientes.find(i => i.id === ingredienteId);
      if (ingrediente && ingrediente.estoqueAtual < quantidadeNecessaria) {
        novosAlertas.push(
          `${ingrediente.nome}: necessário ${quantidadeNecessaria} ${ingrediente.unidade}, disponível ${ingrediente.estoqueAtual} ${ingrediente.unidade}`
        );
      }
    });

    setAlertas(novosAlertas);
    
    if (novosAlertas.length > 0) {
      toast.warning('Estoque insuficiente para alguns ingredientes');
    } else {
      toast.success('Consumo calculado - estoque suficiente');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dataProducao) {
      toast.error('Informe a data de produção');
      return;
    }

    if (itensPlanejados.length === 0) {
      toast.error('Calcule a distribuição primeiro');
      return;
    }

    if (Object.keys(consumoCalculado).length === 0) {
      toast.error('Calcule o consumo de insumos');
      return;
    }

    if (alertas.length > 0) {
      toast.error('Resolva os alertas de estoque antes de continuar');
      return;
    }

    setLoading(true);

    try {
      const loteData: any = {
        dataProducao: new Date(dataProducao),
        status: StatusLoteProducao.PLANEJADO,
        configDistribuicao: {
          totalDrinks,
          percentuais,
        },
        itensPlanejados,
        consumoCalculado,
        criadoPor: 'sistema', // TODO: pegar usuário logado
      };

      if (lote?.id) {
        await update(lote.id, loteData);
        toast.success('Lote atualizado com sucesso');
      } else {
        await create(loteData);
        toast.success('Lote de produção planejado com sucesso');
      }

      onSuccess?.();
    } catch (error) {
      console.error('Erro ao salvar lote:', error);
      toast.error('Erro ao salvar lote de produção');
    } finally {
      setLoading(false);
    }
  };

  const totalPercentual = Object.values(percentuais).reduce((sum, val) => sum + val, 0);
  const percentualValido = Math.abs(totalPercentual - 100) < 0.1;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Data de Produção */}
      <div className="space-y-2">
        <Label htmlFor="dataProducao">
          Data de Produção <span className="text-destructive">*</span>
        </Label>
        <Input
          id="dataProducao"
          type="date"
          value={dataProducao}
          onChange={(e) => setDataProducao(e.target.value)}
          required
        />
      </div>

      <Separator />

      {/* Distribuição Automática - REQ-17 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Distribuição Automática
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="totalDrinks">
              Total de Drinks <span className="text-destructive">*</span>
            </Label>
            <Input
              id="totalDrinks"
              type="number"
              min="1"
              value={totalDrinks || ''}
              onChange={(e) => setTotalDrinks(Number(e.target.value))}
              placeholder="Ex: 150"
            />
          </div>

          {/* Percentuais por Produto */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Percentuais por Produto</Label>
              <Badge variant={percentualValido ? 'default' : 'destructive'}>
                Total: {totalPercentual.toFixed(1)}%
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {produtos.map((produto) => (
                <div key={produto.id} className="flex items-center gap-2">
                  <Label className="flex-1 text-sm">{produto.nome}</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={percentuais[produto.id!] || 0}
                    onChange={(e) => handlePercentualChange(produto.id!, Number(e.target.value))}
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
              ))}
            </div>
          </div>

          <Button
            type="button"
            onClick={handleCalcularDistribuicao}
            disabled={!percentualValido || totalDrinks <= 0}
            className="w-full"
          >
            <Calculator className="mr-2 h-4 w-4" />
            Calcular Distribuição
          </Button>
        </CardContent>
      </Card>

      {/* Itens Planejados */}
      {itensPlanejados.length > 0 && (
        <>
          <Separator />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Itens Planejados (editável)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {itensPlanejados.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-5">
                      <Label className="text-sm">{item.produtoNome}</Label>
                    </div>
                    <div className="col-span-3">
                      <div className="text-sm text-muted-foreground">
                        Sugerido: {item.quantidadeSugerida}
                      </div>
                    </div>
                    <div className="col-span-4">
                      <Input
                        type="number"
                        min="0"
                        value={item.quantidadeFinal}
                        onChange={(e) => handleQuantidadeFinalChange(index, Number(e.target.value))}
                        placeholder="Quantidade final"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <Button
                type="button"
                onClick={handleCalcularConsumo}
                variant="outline"
                className="w-full"
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Calcular Consumo de Insumos
              </Button>
            </CardContent>
          </Card>
        </>
      )}

      {/* Consumo Calculado */}
      {Object.keys(consumoCalculado).length > 0 && (
        <>
          <Separator />

          <Card>
            <CardHeader>
              <CardTitle>Consumo de Insumos (REQ-13)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(consumoCalculado).map(([ingredienteId, quantidade]) => {
                  const ingrediente = ingredientes.find(i => i.id === ingredienteId);
                  const disponivel = ingrediente?.estoqueAtual || 0;
                  const suficiente = disponivel >= quantidade;

                  return (
                    <div
                      key={ingredienteId}
                      className="flex items-center justify-between p-3 rounded-lg border border-border"
                    >
                      <div>
                        <p className="font-medium">{ingrediente?.nome}</p>
                        <p className="text-sm text-muted-foreground">
                          Necessário: {quantidade} {ingrediente?.unidade}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={suficiente ? 'outline' : 'destructive'}>
                          {suficiente ? 'OK' : 'Insuficiente'}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          Disponível: {disponivel} {ingrediente?.unidade}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Alertas */}
      {alertas.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <p className="font-medium mb-2">Estoque insuficiente:</p>
            <ul className="list-disc list-inside space-y-1">
              {alertas.map((alerta, index) => (
                <li key={index} className="text-sm">{alerta}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Ações */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onSuccess} disabled={loading}>
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={loading || alertas.length > 0 || Object.keys(consumoCalculado).length === 0}
        >
          {loading ? 'Salvando...' : lote ? 'Atualizar Lote' : 'Planejar Produção'}
        </Button>
      </div>
    </form>
  );
}
