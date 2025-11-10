import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:fl_chart/fl_chart.dart';
import '../providers/lotes_provider.dart';
import '../providers/financas_provider.dart';
import '../services/calculadora_financeira_service.dart';
import '../utils/formatters.dart';
import '../utils/app_theme.dart';
import '../models/custo_variavel.dart';
import '../models/custo_variavel.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final _calculadora = CalculadoraFinanceiraService();
  Map<String, double>? _resultados;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _carregarDados();
  }

  Future<void> _carregarDados() async {
    final lotesProvider = context.read<LotesProvider>();
    final financasProvider = context.read<FinancasProvider>();

    await lotesProvider.carregarLotes();
    await financasProvider.carregarCustosFixos();
    await financasProvider.carregarInvestimentos();
    await financasProvider.carregarParametrosReceita();

    // Carregar custos variáveis de todos os lotes
    for (final lote in lotesProvider.lotes) {
      await financasProvider.carregarCustosVariaveis(lote.id);
    }

    _calcularResultados();

    setState(() {
      _isLoading = false;
    });
  }

  void _calcularResultados() {
    final lotesProvider = context.read<LotesProvider>();
    final financasProvider = context.read<FinancasProvider>();

    if (financasProvider.parametrosReceita == null) {
      return;
    }

    final custosVariaveisPorLote = <String, List<CustoVariavel>>{};
    for (final lote in lotesProvider.lotes) {
      custosVariaveisPorLote[lote.id] = financasProvider.getCustosVariaveis(lote.id);
    }

    _resultados = _calculadora.calcularResultadoTrimestral(
      lotes: lotesProvider.lotes,
      custosVariaveisPorLote: custosVariaveisPorLote,
      custosFixos: financasProvider.custosFixos,
      investimentos: financasProvider.investimentos,
      parametros: financasProvider.parametrosReceita!,
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              setState(() {
                _isLoading = true;
              });
              _carregarDados();
            },
          ),
        ],
      ),
      body: _resultados == null
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.warning, size: 64, color: Colors.grey[400]),
                  const SizedBox(height: 16),
                  const Text('Configure os parâmetros para visualizar o dashboard'),
                ],
              ),
            )
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  _buildKPICards(),
                  const SizedBox(height: 16),
                  _buildResultadosFinanceiros(),
                  const SizedBox(height: 16),
                  _buildGraficoLucratividade(),
                ],
              ),
            ),
    );
  }

  Widget _buildKPICards() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        const Text(
          'Indicadores de Desempenho (KPIs)',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: _buildKPICard(
                'Lucratividade',
                Formatters.formatarPercentual(_resultados!['lucratividade']!),
                Icons.trending_up,
                AppTheme.success,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildKPICard(
                'Ponto de Equilíbrio',
                Formatters.formatarPercentual(_resultados!['pontoEquilibrio']! * 100),
                Icons.balance,
                AppTheme.info,
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        _buildKPICard(
          'Prazo de Retorno do Investimento',
          Formatters.formatarMeses(_resultados!['prazoRetornoInvestimento']!),
          Icons.schedule,
          AppTheme.warning,
        ),
      ],
    );
  }

  Widget _buildKPICard(String titulo, String valor, IconData icon, Color cor) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Icon(icon, size: 40, color: cor),
            const SizedBox(height: 12),
            Text(
              titulo,
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey[600],
              ),
            ),
            const SizedBox(height: 8),
            Text(
              valor,
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: cor,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildResultadosFinanceiros() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Resultados Financeiros (Trimestral)',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const Divider(height: 24),
            _buildResultadoItem(
              'Receita Total',
              _resultados!['receitaTotal']!,
              AppTheme.success,
            ),
            _buildResultadoItem(
              'Custos Variáveis',
              _resultados!['custosVariaveisTotais']!,
              AppTheme.error,
            ),
            _buildResultadoItem(
              'Custos Fixos',
              _resultados!['custosFixosTotais']!,
              AppTheme.error,
            ),
            const Divider(),
            _buildResultadoItem(
              'Margem de Contribuição',
              _resultados!['margemContribuicao']!,
              AppTheme.info,
            ),
            _buildResultadoItem(
              'Lucro Antes do IR',
              _resultados!['lucroAntesIR']!,
              AppTheme.warning,
            ),
            const Divider(),
            _buildResultadoItem(
              'Lucro Líquido',
              _resultados!['lucroLiquido']!,
              AppTheme.primaryGreen,
              isBold: true,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildResultadoItem(String label, double valor, Color cor, {bool isBold = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: 16,
              fontWeight: isBold ? FontWeight.bold : FontWeight.normal,
            ),
          ),
          Text(
            Formatters.formatarMoeda(valor),
            style: TextStyle(
              fontSize: 16,
              fontWeight: isBold ? FontWeight.bold : FontWeight.w500,
              color: cor,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildGraficoLucratividade() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Composição de Resultados',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 24),
            SizedBox(
              height: 200,
              child: PieChart(
                PieChartData(
                  sections: [
                    PieChartSectionData(
                      value: _resultados!['receitaTotal']!,
                      title: 'Receita',
                      color: AppTheme.success,
                      radius: 80,
                      titleStyle: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    PieChartSectionData(
                      value: _resultados!['custosVariaveisTotais']!,
                      title: 'C. Variáveis',
                      color: AppTheme.warning,
                      radius: 80,
                      titleStyle: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    PieChartSectionData(
                      value: _resultados!['custosFixosTotais']!,
                      title: 'C. Fixos',
                      color: AppTheme.error,
                      radius: 80,
                      titleStyle: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ],
                  sectionsSpace: 2,
                  centerSpaceRadius: 40,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
