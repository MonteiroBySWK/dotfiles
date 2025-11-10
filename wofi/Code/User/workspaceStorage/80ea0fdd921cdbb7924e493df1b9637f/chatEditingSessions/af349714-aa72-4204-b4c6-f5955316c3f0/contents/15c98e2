/**
 * Funções de Negócio - Sistema REVIS
 * Implementação das regras de negócio críticas
 */

import {
  ConfigDistribuicao,
  ItemPlanejado,
  Produto,
  Ingrediente,
  LoteProducao,
  ResultadoConsumo,
  LoteProduto,
  ResultadoFIFO,
  HistoricoMovimentacao,
  TipoMovimentacao,
} from '@/types';
import { Timestamp } from 'firebase/firestore';

/**
 * REQ-17: Distribuição Automática de Produção
 * Calcula a quantidade de cada produto baseado no total de drinks e percentuais configurados
 * 
 * @param totalDrinks - Total de drinks a produzir
 * @param percentuais - Objeto com produtoId: percentual (ex: {tropicana: 30, moginto: 25})
 * @returns Distribuição calculada {produtoId: quantidade}
 */
export function calcularDistribuicao(
  totalDrinks: number,
  percentuais: Record<string, number>
): Record<string, number> {
  const distribuicao: Record<string, number> = {};
  
  Object.keys(percentuais).forEach(produtoId => {
    distribuicao[produtoId] = Math.round(totalDrinks * (percentuais[produtoId] / 100));
  });
  
  return distribuicao;
}

/**
 * REQ-13: Cálculo Automático de Consumo por Receita
 * Calcula o consumo de insumos baseado na produção planejada e receitas (BOM)
 * 
 * @param itensPlanejados - Lista de produtos a serem produzidos
 * @param produtos - Lista de produtos com suas receitas
 * @returns Consumo calculado {ingredienteId: quantidade}
 */
export function calcularConsumoProducao(
  itensPlanejados: ItemPlanejado[],
  produtos: Produto[]
): Record<string, number> {
  const consumo: Record<string, number> = {};
  
  itensPlanejados.forEach(item => {
    const produto = produtos.find(p => p.id === item.produtoId);
    
    if (!produto) {
      console.warn(`Produto ${item.produtoId} não encontrado`);
      return;
    }
    
    produto.receita.forEach(ingrediente => {
      const chave = ingrediente.ingredienteId;
      const quantidadeConsumida = ingrediente.quantidade * item.quantidadeFinal;
      
      consumo[chave] = (consumo[chave] || 0) + quantidadeConsumida;
    });
  });
  
  return consumo;
}

/**
 * Valida se há estoque suficiente para a produção
 * 
 * @param consumoCalculado - Consumo necessário {ingredienteId: quantidade}
 * @param ingredientes - Lista de ingredientes disponíveis
 * @returns Array com resultado da validação por ingrediente
 */
export function validarEstoqueParaProducao(
  consumoCalculado: Record<string, number>,
  ingredientes: Ingrediente[]
): ResultadoConsumo[] {
  const resultados: ResultadoConsumo[] = [];
  
  Object.entries(consumoCalculado).forEach(([ingredienteId, quantidadeNecessaria]) => {
    const ingrediente = ingredientes.find(i => i.id === ingredienteId);
    
    if (!ingrediente) {
      console.warn(`Ingrediente ${ingredienteId} não encontrado`);
      return;
    }
    
    const faltante = Math.max(0, quantidadeNecessaria - ingrediente.estoqueAtual);
    
    resultados.push({
      ingredienteId,
      ingredienteNome: ingrediente.nome,
      quantidadeNecessaria,
      estoqueAtual: ingrediente.estoqueAtual,
      faltante,
      unidade: ingrediente.unidade,
    });
  });
  
  return resultados;
}

/**
 * REQ-06: Controle de Perdas
 * Registra ajuste de estoque e identifica perdas automaticamente
 * 
 * @param estoqueAnterior - Valor anterior do estoque
 * @param novoValor - Novo valor do estoque
 * @param motivo - Motivo do ajuste
 * @returns Objeto de histórico de movimentação
 */
export function registrarAjusteEstoque(
  estoqueAnterior: number,
  novoValor: number,
  motivo: string,
  usuarioId?: string
): HistoricoMovimentacao {
  const diferenca = estoqueAnterior - novoValor;
  
  return {
    data: Timestamp.now(),
    tipo: diferenca > 0 ? TipoMovimentacao.PERDA : TipoMovimentacao.AJUSTE,
    quantidade: Math.abs(diferenca),
    observacao: motivo,
    usuario: usuarioId,
  };
}

/**
 * REQ-16: FIFO - First In, First Out
 * Retorna os lotes na ordem de vencimento para consumo
 * 
 * @param lotes - Lista de lotes de produtos
 * @returns Lotes ordenados do mais antigo para o mais novo
 */
export function aplicarFIFO(lotes: LoteProduto[]): ResultadoFIFO[] {
  const lotesOrdenados = [...lotes]
    .filter(lote => lote.quantidadeDisponivel > 0)
    .sort((a, b) => a.dataProducao.toMillis() - b.dataProducao.toMillis());
  
  return lotesOrdenados.map(lote => {
    const diasParaVencer = Math.floor(
      (lote.dataValidade.toMillis() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    
    return {
      loteId: lote.id,
      produtoId: lote.produtoId,
      quantidadeDisponivel: lote.quantidadeDisponivel,
      dataValidade: lote.dataValidade,
      diasParaVencer,
    };
  });
}

/**
 * REQ-15: Verificação de produtos próximos ao vencimento
 * Retorna produtos que vencem em X dias
 * 
 * @param lotes - Lista de lotes de produtos
 * @param diasLimite - Dias de antecedência para alerta (padrão 7 dias)
 * @returns Lotes próximos ao vencimento
 */
export function verificarProdutosProximosVencimento(
  lotes: LoteProduto[],
  diasLimite: number = 7
): ResultadoFIFO[] {
  const agora = Date.now();
  const limiteMs = diasLimite * 24 * 60 * 60 * 1000;
  
  return lotes
    .filter(lote => {
      const tempoRestante = lote.dataValidade.toMillis() - agora;
      return tempoRestante > 0 && tempoRestante <= limiteMs;
    })
    .map(lote => {
      const diasParaVencer = Math.floor(
        (lote.dataValidade.toMillis() - agora) / (1000 * 60 * 60 * 24)
      );
      
      return {
        loteId: lote.id,
        produtoId: lote.produtoId,
        quantidadeDisponivel: lote.quantidadeDisponivel,
        dataValidade: lote.dataValidade,
        diasParaVencer,
      };
    })
    .sort((a, b) => a.diasParaVencer - b.diasParaVencer);
}

/**
 * REQ-04: Verificação de estoque abaixo do mínimo
 * 
 * @param ingredientes - Lista de ingredientes
 * @returns Ingredientes com estoque abaixo do mínimo
 */
export function verificarEstoquesBaixos(
  ingredientes: Ingrediente[]
): Ingrediente[] {
  return ingredientes.filter(
    ingrediente => ingrediente.estoqueAtual < ingrediente.estoqueMinimo
  );
}

/**
 * Calcula o valor total de um pedido
 * REQ-10: Cálculo do valor total dos pedidos
 * 
 * @param itens - Itens do pedido
 * @returns Valor total
 */
export function calcularValorTotalPedido(
  itens: Array<{ quantidade: number; preco: number }>
): number {
  return itens.reduce((total, item) => {
    return total + (item.quantidade * item.preco);
  }, 0);
}

/**
 * Gera número sequencial de pedido
 * 
 * @param ultimoNumero - Último número usado (ex: 'PED-001')
 * @returns Próximo número (ex: 'PED-002')
 */
export function gerarNumeroPedido(ultimoNumero?: string): string {
  if (!ultimoNumero) {
    return 'PED-001';
  }
  
  const partes = ultimoNumero.split('-');
  const numero = parseInt(partes[1] || '0', 10) + 1;
  
  return `PED-${numero.toString().padStart(3, '0')}`;
}

/**
 * Calcula a data de validade de um produto
 * REQ-14: Controle de validade (3 semanas)
 * 
 * @param dataProducao - Data de produção
 * @param diasValidade - Dias de validade (padrão 21)
 * @returns Data de validade
 */
export function calcularDataValidade(
  dataProducao: Timestamp,
  diasValidade: number = 21
): Timestamp {
  const dataMs = dataProducao.toMillis();
  const validadeMs = diasValidade * 24 * 60 * 60 * 1000;
  
  return Timestamp.fromMillis(dataMs + validadeMs);
}

/**
 * Formata número para moeda brasileira
 * 
 * @param valor - Valor numérico
 * @returns String formatada (ex: "R$ 1.234,56")
 */
export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
}

/**
 * Formata data para padrão brasileiro
 * 
 * @param timestamp - Timestamp do Firebase
 * @returns String formatada (ex: "09/11/2025")
 */
export function formatarData(timestamp: Timestamp): string {
  return new Intl.DateTimeFormat('pt-BR').format(timestamp.toDate());
}

/**
 * Formata data e hora para padrão brasileiro
 * 
 * @param timestamp - Timestamp do Firebase
 * @returns String formatada (ex: "09/11/2025 14:30")
 */
export function formatarDataHora(timestamp: Timestamp): string {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(timestamp.toDate());
}
