import '../models/lote.dart';
import '../models/lancamento_diario.dart';
import '../models/parametros_receita.dart';
import '../models/custo_variavel.dart';
import '../models/custo_fixo.dart';
import '../models/investimento.dart';

/// Service responsável por todos os cálculos econômico-financeiros
/// baseados nas fórmulas da planilha de custos de produção
class CalculadoraFinanceiraService {
  
  /// A. Receita Total por Lote
  
  /// Calcula a Quantidade Final de Aves
  /// Fórmula: Qfinal = Qinicial × (Aproveitamento% / 100)
  double calcularQuantidadeFinalAves({
    required int quantidadeInicial,
    required double aproveitamentoPercentual,
  }) {
    return quantidadeInicial * (aproveitamentoPercentual / 100);
  }

  /// Calcula o Peso Médio Total do Lote em Kg
  /// Fórmula: Plote = Qfinal × Pfrango
  double calcularPesoTotalLote({
    required double quantidadeFinal,
    required double pesoMedioFrango,
  }) {
    return quantidadeFinal * pesoMedioFrango;
  }

  /// Calcula a Receita Total por Lote
  /// Fórmula: Rlote = (Plote × Vfrango) + Rcama
  double calcularReceitaTotalLote({
    required double pesoTotalLote,
    required double valorFrangoVivoKg,
    required double receitaCamaAviario,
  }) {
    return (pesoTotalLote * valorFrangoVivoKg) + receitaCamaAviario;
  }

  /// Calcula a receita total com base no lote e parâmetros
  double calcularReceitaLoteCompleta({
    required Lote lote,
    required ParametrosReceita parametros,
  }) {
    final quantidadeFinal = calcularQuantidadeFinalAves(
      quantidadeInicial: lote.quantidadeInicialAves,
      aproveitamentoPercentual: parametros.aproveitamentoPercentual,
    );

    final pesoTotal = calcularPesoTotalLote(
      quantidadeFinal: quantidadeFinal,
      pesoMedioFrango: parametros.pesoMedioFrangoVivo,
    );

    return calcularReceitaTotalLote(
      pesoTotalLote: pesoTotal,
      valorFrangoVivoKg: parametros.valorFrangoVivoKg,
      receitaCamaAviario: parametros.receitaCamaAviario,
    );
  }

  /// B. Avaliação Econômico-Financeira (Trimestral)
  
  /// Calcula a Margem de Contribuição Trimestral
  /// Fórmula: MCT = RTotal,T - CVTotal,T
  double calcularMargemContribuicao({
    required double receitaTotalTrimestral,
    required double custosVariaveisTotais,
  }) {
    return receitaTotalTrimestral - custosVariaveisTotais;
  }

  /// Calcula o Lucro Antes do Imposto de Renda Trimestral
  /// Fórmula: LAIRT = MCT - CFTotal,T
  double calcularLucroAntesIR({
    required double margemContribuicao,
    required double custosFixosTotais,
  }) {
    return margemContribuicao - custosFixosTotais;
  }

  /// Calcula o Lucro Líquido Total
  /// Fórmula: LLT = LAIRT - (LAIRT × alíquotaIR)
  double calcularLucroLiquido({
    required double lucroAntesIR,
    double aliquotaIR = 0.15, // 15% padrão
  }) {
    return lucroAntesIR - (lucroAntesIR * aliquotaIR);
  }

  /// C. Indicadores de Desempenho (KPIs)
  
  /// Calcula a Lucratividade
  /// Fórmula: Lucratividade = (LLT / RTotal,T) × 100
  double calcularLucratividade({
    required double lucroLiquido,
    required double receitaTotal,
  }) {
    if (receitaTotal == 0) return 0;
    return (lucroLiquido / receitaTotal) * 100;
  }

  /// Calcula o Ponto de Equilíbrio Operacional
  /// Fórmula: PEO = CFTotal,T / MCT
  /// Retorna um percentual da Receita Total que cobre os Custos Fixos
  double calcularPontoEquilibrioOperacional({
    required double custosFixosTotais,
    required double margemContribuicao,
  }) {
    if (margemContribuicao == 0) return 0;
    return custosFixosTotais / margemContribuicao;
  }

  /// Calcula o Prazo de Retorno do Investimento em Meses
  /// Fórmula: PRImeses = InvestimentoTotal / (LLT / 3)
  double calcularPrazoRetornoInvestimento({
    required double investimentoTotal,
    required double lucroLiquidoTrimestral,
  }) {
    final lucroMedioMensal = lucroLiquidoTrimestral / 3;
    if (lucroMedioMensal == 0) return 0;
    return investimentoTotal / lucroMedioMensal;
  }

  /// Calcula o total de mortes acumuladas de um lote
  int calcularTotalMortes(List<LancamentoDiario> lancamentos) {
    return lancamentos.fold(0, (sum, lancamento) => sum + lancamento.mortos);
  }

  /// Calcula o total de custos variáveis de um lote
  double calcularTotalCustosVariaveis(List<CustoVariavel> custos) {
    return custos.fold(0.0, (sum, custo) => sum + custo.valor);
  }

  /// Calcula o total de custos fixos mensais
  double calcularTotalCustosFixosMensal(List<CustoFixo> custos) {
    return custos.fold(0.0, (sum, custo) => sum + custo.valorMensal);
  }

  /// Calcula o total de investimentos
  double calcularTotalInvestimentos(List<Investimento> investimentos) {
    return investimentos.fold(0.0, (sum, inv) => sum + inv.valor);
  }

  /// Calcula taxa de aproveitamento real baseado nas mortes
  double calcularAproveitamentoReal({
    required int quantidadeInicial,
    required int totalMortes,
  }) {
    if (quantidadeInicial == 0) return 0;
    final quantidadeFinal = quantidadeInicial - totalMortes;
    return (quantidadeFinal / quantidadeInicial) * 100;
  }

  /// Calcula resultado completo trimestral
  Map<String, double> calcularResultadoTrimestral({
    required List<Lote> lotes,
    required Map<String, List<CustoVariavel>> custosVariaveisPorLote,
    required List<CustoFixo> custosFixos,
    required List<Investimento> investimentos,
    required ParametrosReceita parametros,
    double aliquotaIR = 0.15,
  }) {
    // Receita total trimestral
    double receitaTotal = 0;
    for (final lote in lotes) {
      receitaTotal += calcularReceitaLoteCompleta(
        lote: lote,
        parametros: parametros,
      );
    }

    // Custos variáveis totais
    double custosVariaveisTotais = 0;
    for (final custos in custosVariaveisPorLote.values) {
      custosVariaveisTotais += calcularTotalCustosVariaveis(custos);
    }

    // Custos fixos trimestrais (mensal × 3)
    final custosFixosMensal = calcularTotalCustosFixosMensal(custosFixos);
    final custosFixosTotais = custosFixosMensal * 3;

    // Investimento total
    final investimentoTotal = calcularTotalInvestimentos(investimentos);

    // Margem de contribuição
    final margemContribuicao = calcularMargemContribuicao(
      receitaTotalTrimestral: receitaTotal,
      custosVariaveisTotais: custosVariaveisTotais,
    );

    // Lucro antes do IR
    final lucroAntesIR = calcularLucroAntesIR(
      margemContribuicao: margemContribuicao,
      custosFixosTotais: custosFixosTotais,
    );

    // Lucro líquido
    final lucroLiquido = calcularLucroLiquido(
      lucroAntesIR: lucroAntesIR,
      aliquotaIR: aliquotaIR,
    );

    // KPIs
    final lucratividade = calcularLucratividade(
      lucroLiquido: lucroLiquido,
      receitaTotal: receitaTotal,
    );

    final pontoEquilibrio = calcularPontoEquilibrioOperacional(
      custosFixosTotais: custosFixosTotais,
      margemContribuicao: margemContribuicao,
    );

    final prazoRetorno = calcularPrazoRetornoInvestimento(
      investimentoTotal: investimentoTotal,
      lucroLiquidoTrimestral: lucroLiquido,
    );

    return {
      'receitaTotal': receitaTotal,
      'custosVariaveisTotais': custosVariaveisTotais,
      'custosFixosTotais': custosFixosTotais,
      'margemContribuicao': margemContribuicao,
      'lucroAntesIR': lucroAntesIR,
      'lucroLiquido': lucroLiquido,
      'lucratividade': lucratividade,
      'pontoEquilibrio': pontoEquilibrio,
      'prazoRetornoInvestimento': prazoRetorno,
      'investimentoTotal': investimentoTotal,
    };
  }
}
