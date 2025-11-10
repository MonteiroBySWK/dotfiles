import 'package:flutter/foundation.dart';
import 'package:uuid/uuid.dart';
import '../models/custo_fixo.dart';
import '../models/custo_variavel.dart';
import '../models/investimento.dart';
import '../models/parametros_receita.dart';
import '../database/database_helper.dart';

class FinancasProvider with ChangeNotifier {
  final DatabaseHelper _dbHelper = DatabaseHelper.instance;
  final _uuid = const Uuid();

  List<CustoFixo> _custosFixos = [];
  List<Investimento> _investimentos = [];
  ParametrosReceita? _parametrosReceita;
  Map<String, List<CustoVariavel>> _custosVariaveisPorLote = {};
  bool _isLoading = false;

  List<CustoFixo> get custosFixos => _custosFixos;
  List<Investimento> get investimentos => _investimentos;
  ParametrosReceita? get parametrosReceita => _parametrosReceita;
  bool get isLoading => _isLoading;

  List<CustoVariavel> getCustosVariaveis(String loteId) {
    return _custosVariaveisPorLote[loteId] ?? [];
  }

  // ==================== CUSTOS FIXOS ====================
  Future<void> carregarCustosFixos() async {
    _isLoading = true;
    notifyListeners();

    try {
      _custosFixos = await _dbHelper.getAllCustosFixos();
    } catch (e) {
      debugPrint('Erro ao carregar custos fixos: $e');
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> adicionarCustoFixo({
    required String descricao,
    required double valorMensal,
  }) async {
    final custo = CustoFixo(
      id: _uuid.v4(),
      descricao: descricao,
      valorMensal: valorMensal,
      dataCriacao: DateTime.now(),
    );

    await _dbHelper.insertCustoFixo(custo);
    await carregarCustosFixos();
  }

  Future<void> atualizarCustoFixo(CustoFixo custo) async {
    await _dbHelper.updateCustoFixo(custo);
    await carregarCustosFixos();
  }

  Future<void> deletarCustoFixo(String id) async {
    await _dbHelper.deleteCustoFixo(id);
    await carregarCustosFixos();
  }

  double get totalCustosFixosMensal {
    return _custosFixos.fold(0.0, (sum, custo) => sum + custo.valorMensal);
  }

  // ==================== CUSTOS VARIÁVEIS ====================
  Future<void> carregarCustosVariaveis(String loteId) async {
    _isLoading = true;
    notifyListeners();

    try {
      final custos = await _dbHelper.getCustosVariaveisByLote(loteId);
      _custosVariaveisPorLote[loteId] = custos;
    } catch (e) {
      debugPrint('Erro ao carregar custos variáveis: $e');
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> adicionarCustoVariavel({
    required String loteId,
    required String descricao,
    required double valor,
  }) async {
    final custo = CustoVariavel(
      id: _uuid.v4(),
      loteId: loteId,
      descricao: descricao,
      valor: valor,
      dataCriacao: DateTime.now(),
    );

    await _dbHelper.insertCustoVariavel(custo);
    await carregarCustosVariaveis(loteId);
  }

  Future<void> atualizarCustoVariavel(CustoVariavel custo) async {
    await _dbHelper.updateCustoVariavel(custo);
    await carregarCustosVariaveis(custo.loteId);
  }

  Future<void> deletarCustoVariavel(String id, String loteId) async {
    await _dbHelper.deleteCustoVariavel(id);
    await carregarCustosVariaveis(loteId);
  }

  // ==================== INVESTIMENTOS ====================
  Future<void> carregarInvestimentos() async {
    _isLoading = true;
    notifyListeners();

    try {
      _investimentos = await _dbHelper.getAllInvestimentos();
    } catch (e) {
      debugPrint('Erro ao carregar investimentos: $e');
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> adicionarInvestimento({
    required String descricao,
    required double valor,
  }) async {
    final investimento = Investimento(
      id: _uuid.v4(),
      descricao: descricao,
      valor: valor,
      dataCriacao: DateTime.now(),
    );

    await _dbHelper.insertInvestimento(investimento);
    await carregarInvestimentos();
  }

  Future<void> atualizarInvestimento(Investimento investimento) async {
    await _dbHelper.updateInvestimento(investimento);
    await carregarInvestimentos();
  }

  Future<void> deletarInvestimento(String id) async {
    await _dbHelper.deleteInvestimento(id);
    await carregarInvestimentos();
  }

  double get totalInvestimentos {
    return _investimentos.fold(0.0, (sum, inv) => sum + inv.valor);
  }

  // ==================== PARÂMETROS DE RECEITA ====================
  Future<void> carregarParametrosReceita() async {
    _isLoading = true;
    notifyListeners();

    try {
      _parametrosReceita = await _dbHelper.getParametrosReceita();
      
      // Se não existir, criar parâmetros padrão
      if (_parametrosReceita == null) {
        await criarParametrosPadrao();
      }
    } catch (e) {
      debugPrint('Erro ao carregar parâmetros de receita: $e');
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> criarParametrosPadrao() async {
    final parametros = ParametrosReceita(
      id: _uuid.v4(),
      aproveitamentoPercentual: 97.0,
      pesoMedioFrangoVivo: 2.5,
      valorFrangoVivoKg: 6.50,
      receitaCamaAviario: 100.0,
      dataAtualizacao: DateTime.now(),
    );

    await _dbHelper.insertParametrosReceita(parametros);
    _parametrosReceita = parametros;
    notifyListeners();
  }

  Future<void> atualizarParametrosReceita({
    required double aproveitamentoPercentual,
    required double pesoMedioFrangoVivo,
    required double valorFrangoVivoKg,
    required double receitaCamaAviario,
  }) async {
    if (_parametrosReceita == null) {
      await carregarParametrosReceita();
    }

    final parametros = ParametrosReceita(
      id: _parametrosReceita?.id ?? _uuid.v4(),
      aproveitamentoPercentual: aproveitamentoPercentual,
      pesoMedioFrangoVivo: pesoMedioFrangoVivo,
      valorFrangoVivoKg: valorFrangoVivoKg,
      receitaCamaAviario: receitaCamaAviario,
      dataAtualizacao: DateTime.now(),
    );

    if (_parametrosReceita == null) {
      await _dbHelper.insertParametrosReceita(parametros);
    } else {
      await _dbHelper.updateParametrosReceita(parametros);
    }

    _parametrosReceita = parametros;
    notifyListeners();
  }
}
