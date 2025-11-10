import 'package:flutter/foundation.dart';
import 'package:uuid/uuid.dart';
import '../models/lote.dart';
import '../models/lancamento_diario.dart';
import '../database/database_helper.dart';

class LotesProvider with ChangeNotifier {
  final DatabaseHelper _dbHelper = DatabaseHelper.instance;
  final _uuid = const Uuid();

  List<Lote> _lotes = [];
  bool _isLoading = false;

  List<Lote> get lotes => _lotes;
  bool get isLoading => _isLoading;

  Future<void> carregarLotes() async {
    _isLoading = true;
    notifyListeners();

    try {
      _lotes = await _dbHelper.getAllLotes();
    } catch (e) {
      debugPrint('Erro ao carregar lotes: $e');
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> adicionarLote({
    required String mesAno,
    required String numeroLote,
    required String galpao,
    required String linhagem,
    required DateTime dataNascimento,
    required int quantidadeInicialAves,
  }) async {
    final lote = Lote(
      id: _uuid.v4(),
      mesAno: mesAno,
      numeroLote: numeroLote,
      galpao: galpao,
      linhagem: linhagem,
      dataNascimento: dataNascimento,
      quantidadeInicialAves: quantidadeInicialAves,
      dataCriacao: DateTime.now(),
    );

    await _dbHelper.insertLote(lote);
    await carregarLotes();
  }

  Future<void> atualizarLote(Lote lote) async {
    await _dbHelper.updateLote(lote);
    await carregarLotes();
  }

  Future<void> deletarLote(String id) async {
    await _dbHelper.deleteLote(id);
    await carregarLotes();
  }

  Future<Lote?> getLote(String id) async {
    return await _dbHelper.getLote(id);
  }
}

class LancamentosProvider with ChangeNotifier {
  final DatabaseHelper _dbHelper = DatabaseHelper.instance;
  final _uuid = const Uuid();

  Map<String, List<LancamentoDiario>> _lancamentosPorLote = {};
  bool _isLoading = false;

  List<LancamentoDiario> getLancamentos(String loteId) {
    return _lancamentosPorLote[loteId] ?? [];
  }

  bool get isLoading => _isLoading;

  Future<void> carregarLancamentos(String loteId) async {
    _isLoading = true;
    notifyListeners();

    try {
      final lancamentos = await _dbHelper.getLancamentosByLote(loteId);
      _lancamentosPorLote[loteId] = lancamentos;
    } catch (e) {
      debugPrint('Erro ao carregar lançamentos: $e');
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> adicionarLancamento({
    required String loteId,
    required DateTime data,
    required int semana,
    required int mortos,
    required double consumoRacaoReal,
    required double pesoAves,
  }) async {
    final lancamento = LancamentoDiario(
      id: _uuid.v4(),
      loteId: loteId,
      data: data,
      semana: semana,
      mortos: mortos,
      consumoRacaoReal: consumoRacaoReal,
      pesoAves: pesoAves,
    );

    await _dbHelper.insertLancamentoDiario(lancamento);
    await carregarLancamentos(loteId);
  }

  Future<void> atualizarLancamento(LancamentoDiario lancamento) async {
    await _dbHelper.updateLancamentoDiario(lancamento);
    await carregarLancamentos(lancamento.loteId);
  }

  Future<void> deletarLancamento(String id, String loteId) async {
    await _dbHelper.deleteLancamentoDiario(id);
    await carregarLancamentos(loteId);
  }
}
