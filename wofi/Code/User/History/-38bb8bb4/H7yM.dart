import 'package:flutter/foundation.dart';
import 'package:uuid/uuid.dart';
import '../models/lote.dart';
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

