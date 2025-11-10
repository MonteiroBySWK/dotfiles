import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/lotes_provider.dart';
import '../providers/lancamentos_provider.dart';
import '../providers/financas_provider.dart';
import '../models/lote.dart';
import '../utils/formatters.dart';
import 'lancamento_diario_screen.dart';

class DetalhesLoteScreen extends StatefulWidget {
  final String loteId;

  const DetalhesLoteScreen({super.key, required this.loteId});

  @override
  State<DetalhesLoteScreen> createState() => _DetalhesLoteScreenState();
}

class _DetalhesLoteScreenState extends State<DetalhesLoteScreen> {
  Lote? _lote;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _carregarDados();
  }

  Future<void> _carregarDados() async {
    final lotesProvider = context.read<LotesProvider>();
    final lancamentosProvider = context.read<LancamentosProvider>();
    final financasProvider = context.read<FinancasProvider>();

    final lote = await lotesProvider.getLote(widget.loteId);
    await lancamentosProvider.carregarLancamentos(widget.loteId);
    await financasProvider.carregarCustosVariaveis(widget.loteId);

    setState(() {
      _lote = lote;
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading || _lote == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Detalhes do Lote')),
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: Text('Lote ${_lote!.numeroLote}'),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            _buildInfoCard(),
            _buildLancamentosCard(),
            _buildCustosVariaveisCard(),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => LancamentoDiarioScreen(loteId: widget.loteId),
            ),
          );
        },
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildInfoCard() {
    return Card(
      margin: const EdgeInsets.all(16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Informações do Lote',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const Divider(height: 24),
            _buildInfoRow(Icons.calendar_month, 'Mês/Ano', _lote!.mesAno),
            _buildInfoRow(Icons.warehouse, 'Galpão', _lote!.galpao),
            _buildInfoRow(Icons.pets, 'Linhagem', _lote!.linhagem),
            _buildInfoRow(
              Icons.calendar_today,
              'Data Nascimento',
              Formatters.formatarData(_lote!.dataNascimento),
            ),
            _buildInfoRow(
              Icons.format_list_numbered,
              'Quantidade Inicial',
              Formatters.formatarQuantidadeAves(_lote!.quantidadeInicialAves),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Icon(icon, size: 20, color: Colors.grey[600]),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey[600],
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  value,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLancamentosCard() {
    return Consumer<LancamentosProvider>(
      builder: (context, provider, child) {
        final lancamentos = provider.getLancamentos(widget.loteId);
        
        return Card(
          margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Lançamentos Diários',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const Divider(height: 24),
                if (lancamentos.isEmpty)
                  Center(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Text(
                        'Nenhum lançamento registrado',
                        style: TextStyle(color: Colors.grey[600]),
                      ),
                    ),
                  )
                else
                  ...lancamentos.take(5).map((lanc) => ListTile(
                        contentPadding: EdgeInsets.zero,
                        leading: CircleAvatar(
                          child: Text('S${lanc.semana}'),
                        ),
                        title: Text(Formatters.formatarData(lanc.data)),
                        subtitle: Text(
                          'Mortos: ${lanc.mortos} | Peso: ${Formatters.formatarPeso(lanc.pesoAves)}',
                        ),
                      )),
                if (lancamentos.length > 5)
                  Center(
                    child: TextButton(
                      onPressed: () {
                        // Navegar para lista completa
                      },
                      child: const Text('Ver todos'),
                    ),
                  ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildCustosVariaveisCard() {
    return Consumer<FinancasProvider>(
      builder: (context, provider, child) {
        final custos = provider.getCustosVariaveis(widget.loteId);
        final total = custos.fold(0.0, (sum, c) => sum + c.valor);
        
        return Card(
          margin: const EdgeInsets.all(16),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Custos Variáveis',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const Divider(height: 24),
                if (custos.isEmpty)
                  Center(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Text(
                        'Nenhum custo variável registrado',
                        style: TextStyle(color: Colors.grey[600]),
                      ),
                    ),
                  )
                else ...[
                  ...custos.map((custo) => ListTile(
                        contentPadding: EdgeInsets.zero,
                        title: Text(custo.descricao),
                        trailing: Text(
                          Formatters.formatarMoeda(custo.valor),
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                      )),
                  const Divider(),
                  ListTile(
                    contentPadding: EdgeInsets.zero,
                    title: const Text(
                      'Total',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                    trailing: Text(
                      Formatters.formatarMoeda(total),
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 18,
                        color: Theme.of(context).colorScheme.primary,
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),
        );
      },
    );
  }
}
