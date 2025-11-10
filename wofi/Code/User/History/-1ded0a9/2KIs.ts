/**
 * Sistema REVIS - Definições de Tipos TypeScript
 * Baseado na modelagem Firestore e requisitos funcionais
 */

import { Timestamp } from 'firebase/firestore';

// ===== ENUMS =====

export enum UnidadeMedida {
  ML = 'ml',
  L = 'l',
  G = 'g',
  KG = 'kg',
  UNIDADE = 'unidade',
}

export enum CategoriaIngrediente {
  BEBIDA = 'Bebida',
  XAROPE = 'Xarope',
  FRUTA = 'Fruta',
  GELO = 'Gelo',
  DESCARTAVEL = 'Descartável',
  OUTRO = 'Outro',
}

export enum TipoMovimentacao {
  ENTRADA = 'entrada',
  SAIDA = 'saida',
  PERDA = 'perda',
  AJUSTE = 'ajuste',
}

export enum StatusPedido {
  SOLICITADO = 'solicitado',
  SEPARACAO = 'separacao',
  ENTREGA = 'entrega',
  RECEBIDO = 'recebido',
  CANCELADO = 'cancelado',
}

export enum StatusLoteProducao {
  PLANEJADO = 'planejado',
  EM_EXECUCAO = 'em_execucao',
  EXECUTADO = 'executado',
  CANCELADO = 'cancelado',
}

export enum TipoDocumento {
  NOTA_FISCAL = 'nota_fiscal',
  COMPROVANTE = 'comprovante',
  BOLETO = 'boleto',
  OUTRO = 'outro',
}

export enum NivelUsuario {
  ADMIN = 'admin',
  PRODUCAO = 'producao',
  PEDIDOS = 'pedidos',
  VISUALIZADOR = 'visualizador',
}

// ===== INTERFACES =====

/**
 * Histórico de movimentação de estoque
 * REQ-05: Histórico completo de movimentações
 */
export interface HistoricoMovimentacao {
  data: Timestamp;
  tipo: TipoMovimentacao;
  quantidade: number;
  origem?: string; // ID do pedido, lote de produção, etc.
  observacao?: string;
  usuario?: string; // ID do usuário que fez a movimentação
}

/**
 * Ingrediente (Insumo)
 * REQ-01: Cadastro de insumos
 * REQ-04: Alertas de estoque abaixo do mínimo
 * REQ-06: Identificação automática de perdas
 */
export interface Ingrediente {
  id: string;
  nome: string;
  categoria: CategoriaIngrediente;
  unidade: UnidadeMedida;
  estoqueAtual: number;
  estoqueMinimo: number;
  fornecedor?: string;
  historico: HistoricoMovimentacao[];
  criadoEm: Timestamp;
  atualizadoEm: Timestamp;
}

/**
 * Item da receita (BOM - Bill of Materials)
 * REQ-13: Cálculo automático de consumo por receita
 */
export interface ItemReceita {
  ingredienteId: string;
  quantidade: number;
  unidade: UnidadeMedida;
}

/**
 * Produto acabado (Drink)
 * REQ-14: Controle de validade (3 semanas)
 */
export interface Produto {
  id: string;
  nome: string;
  descricao?: string;
  validade: number; // Dias de validade (padrão 21)
  receita: ItemReceita[]; // BOM
  imagemUrl?: string;
  ativo: boolean;
  criadoEm: Timestamp;
  atualizadoEm: Timestamp;
}

/**
 * Configuração de distribuição de produção
 * REQ-17: Distribuição automática de produção por percentuais
 */
export interface ConfigDistribuicao {
  totalDrinks: number;
  percentuais: Record<string, number>; // produtoId: percentual
}

/**
 * Item planejado para produção
 */
export interface ItemPlanejado {
  produtoId: string;
  produtoNome: string;
  quantidadeSugerida: number;
  quantidadeFinal: number; // Editável pelo usuário
}

/**
 * Lote de Produção
 * REQ-12: Registro de produção diária
 * REQ-13: Cálculo automático de consumo
 * REQ-17: Distribuição automática
 */
export interface LoteProducao {
  id: string;
  eventoId?: string;
  dataProducao: Timestamp;
  status: StatusLoteProducao;
  
  // Distribuição automática
  configDistribuicao: ConfigDistribuicao;
  itensPlanejados: ItemPlanejado[];
  
  // Consumo calculado automaticamente (REQ-13)
  consumoCalculado: Record<string, number>; // ingredienteId: quantidade
  
  // Sobras do evento anterior
  sobrasUtilizadas?: Record<string, number>; // produtoId: quantidade
  
  observacoes?: string;
  criadoPor: string;
  criadoEm: Timestamp;
  atualizadoEm: Timestamp;
}

/**
 * Lote de Produto (para controle FIFO)
 * REQ-15: Alertas de produtos próximos ao vencimento
 * REQ-16: Priorização FIFO
 */
export interface LoteProduto {
  id: string;
  produtoId: string;
  loteProducaoId: string;
  quantidade: number;
  quantidadeDisponivel: number;
  dataProducao: Timestamp;
  dataValidade: Timestamp;
  criadoEm: Timestamp;
}

/**
 * Documento anexado
 * REQ-11: Anexação de documentos (notas fiscais)
 */
export interface Documento {
  id: string;
  tipo: TipoDocumento;
  url: string;
  nome: string;
  uploadedEm: Timestamp;
  uploadedPor: string;
}

/**
 * Item do pedido
 */
export interface ItemPedido {
  ingredienteId: string;
  ingredienteNome: string;
  quantidade: number;
  unidade: UnidadeMedida;
  preco: number;
}

/**
 * Pedido de compra
 * REQ-07: Criação de pedidos com múltiplos itens
 * REQ-08: Rastreamento de status
 * REQ-09: Atualização automática do estoque no recebimento
 * REQ-10: Cálculo do valor total dos pedidos
 */
export interface Pedido {
  id: string;
  numero: string; // Ex: PED-001
  fornecedor: string;
  status: StatusPedido;
  itens: ItemPedido[];
  valorTotal: number;
  documentos: Documento[];
  
  dataSolicitacao: Timestamp;
  dataEntregaPrevista?: Timestamp;
  dataRecebimento?: Timestamp;
  
  solicitadoPor: string;
  observacoes?: string;
  criadoEm: Timestamp;
  atualizadoEm: Timestamp;
}

/**
 * Evento (Feira, Show, etc.)
 */
export interface Evento {
  id: string;
  nome: string;
  descricao?: string;
  local: string;
  dataInicio: Timestamp;
  dataFim: Timestamp;
  
  // Histórico para previsão de demanda
  vendasPrevistas?: number;
  vendasReais?: number;
  
  criadoEm: Timestamp;
  atualizadoEm: Timestamp;
}

/**
 * Ponto de venda (Ilha)
 */
export interface PontoVenda {
  id: string;
  nome: string;
  descricao?: string;
  ativo: boolean;
}

/**
 * Venda
 * Para histórico e previsão de demanda
 */
export interface Venda {
  id: string;
  eventoId: string;
  pontoVendaId: string;
  produtoId: string;
  quantidade: number;
  valor: number;
  dataVenda: Timestamp;
  criadoEm: Timestamp;
}

/**
 * Alerta do sistema
 * REQ-04: Alertas de estoque abaixo do mínimo
 * REQ-15: Alertas de produtos próximos ao vencimento
 */
export interface Alerta {
  id: string;
  tipo: 'estoque_baixo' | 'validade_proxima' | 'perda_registrada' | 'outro';
  titulo: string;
  mensagem: string;
  referencia?: string; // ID do ingrediente, produto, etc.
  lido: boolean;
  criadoEm: Timestamp;
}

/**
 * Usuário do sistema
 * REQ-23: Autenticação usuário/senha
 * REQ-25: Diferentes níveis de acesso
 */
export interface Usuario {
  id: string;
  nome: string;
  email: string;
  nivel: NivelUsuario;
  ativo: boolean;
  criadoEm: Timestamp;
  atualizadoEm: Timestamp;
}

/**
 * Log de operações
 * REQ-24: Log de operações críticas
 */
export interface LogOperacao {
  id: string;
  usuarioId: string;
  acao: string;
  entidade: string;
  entidadeId: string;
  detalhes?: Record<string, any>;
  timestamp: Timestamp;
}

// ===== TIPOS UTILITÁRIOS =====

/**
 * Formulário de criação de ingrediente
 */
export type IngredienteForm = Omit<
  Ingrediente,
  'id' | 'historico' | 'criadoEm' | 'atualizadoEm'
>;

/**
 * Formulário de criação de produto
 */
export type ProdutoForm = Omit<
  Produto,
  'id' | 'criadoEm' | 'atualizadoEm'
>;

/**
 * Formulário de criação de pedido
 */
export type PedidoForm = Omit<
  Pedido,
  'id' | 'numero' | 'valorTotal' | 'documentos' | 'criadoEm' | 'atualizadoEm'
>;

/**
 * Formulário de criação de lote de produção
 */
export type LoteProducaoForm = Omit<
  LoteProducao,
  'id' | 'consumoCalculado' | 'criadoEm' | 'atualizadoEm'
>;

/**
 * Resultado do cálculo de consumo
 * REQ-13: Cálculo automático de consumo por receita
 */
export interface ResultadoConsumo {
  ingredienteId: string;
  ingredienteNome: string;
  quantidadeNecessaria: number;
  estoqueAtual: number;
  faltante: number;
  unidade: UnidadeMedida;
}

/**
 * Resultado da verificação FIFO
 * REQ-16: Priorização FIFO
 */
export interface ResultadoFIFO {
  loteId: string;
  produtoId: string;
  quantidadeDisponivel: number;
  dataValidade: Timestamp;
  diasParaVencer: number;
}
