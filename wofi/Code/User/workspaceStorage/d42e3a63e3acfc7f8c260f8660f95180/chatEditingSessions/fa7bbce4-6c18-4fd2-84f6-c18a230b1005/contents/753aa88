import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import '../models/lote.dart';
import '../models/lancamento_diario.dart';
import '../models/custo_fixo.dart';
import '../models/custo_variavel.dart';
import '../models/investimento.dart';
import '../models/parametros_receita.dart';

class DatabaseHelper {
  static final DatabaseHelper instance = DatabaseHelper._init();
  static Database? _database;

  DatabaseHelper._init();

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDB('avigestor.db');
    return _database!;
  }

  Future<Database> _initDB(String filePath) async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, filePath);

    return await openDatabase(
      path,
      version: 1,
      onCreate: _createDB,
    );
  }

  Future<void> _createDB(Database db, int version) async {
    const idType = 'TEXT PRIMARY KEY';
    const textType = 'TEXT NOT NULL';
    const integerType = 'INTEGER NOT NULL';
    const realType = 'REAL NOT NULL';

    // Tabela Lotes
    await db.execute('''
      CREATE TABLE lotes (
        id $idType,
        mesAno $textType,
        numeroLote $textType,
        galpao $textType,
        linhagem $textType,
        dataNascimento $textType,
        quantidadeInicialAves $integerType,
        dataCriacao $textType
      )
    ''');

    // Tabela Lançamentos Diários
    await db.execute('''
      CREATE TABLE lancamentos_diarios (
        id $idType,
        loteId $textType,
        data $textType,
        semana $integerType,
        mortos $integerType,
        consumoRacaoReal $realType,
        pesoAves $realType,
        FOREIGN KEY (loteId) REFERENCES lotes (id) ON DELETE CASCADE
      )
    ''');

    // Tabela Custos Fixos
    await db.execute('''
      CREATE TABLE custos_fixos (
        id $idType,
        descricao $textType,
        valorMensal $realType,
        dataCriacao $textType
      )
    ''');

    // Tabela Custos Variáveis
    await db.execute('''
      CREATE TABLE custos_variaveis (
        id $idType,
        loteId $textType,
        descricao $textType,
        valor $realType,
        dataCriacao $textType,
        FOREIGN KEY (loteId) REFERENCES lotes (id) ON DELETE CASCADE
      )
    ''');

    // Tabela Investimentos
    await db.execute('''
      CREATE TABLE investimentos (
        id $idType,
        descricao $textType,
        valor $realType,
        dataCriacao $textType
      )
    ''');

    // Tabela Parâmetros de Receita
    await db.execute('''
      CREATE TABLE parametros_receita (
        id $idType,
        aproveitamentoPercentual $realType,
        pesoMedioFrangoVivo $realType,
        valorFrangoVivoKg $realType,
        receitaCamaAviario $realType,
        dataAtualizacao $textType
      )
    ''');
  }

  // ==================== LOTES ====================
  Future<String> insertLote(Lote lote) async {
    final db = await database;
    await db.insert('lotes', lote.toMap());
    return lote.id;
  }

  Future<List<Lote>> getAllLotes() async {
    final db = await database;
    final result = await db.query('lotes', orderBy: 'dataCriacao DESC');
    return result.map((map) => Lote.fromMap(map)).toList();
  }

  Future<Lote?> getLote(String id) async {
    final db = await database;
    final maps = await db.query(
      'lotes',
      where: 'id = ?',
      whereArgs: [id],
    );
    if (maps.isNotEmpty) {
      return Lote.fromMap(maps.first);
    }
    return null;
  }

  Future<int> updateLote(Lote lote) async {
    final db = await database;
    return db.update(
      'lotes',
      lote.toMap(),
      where: 'id = ?',
      whereArgs: [lote.id],
    );
  }

  Future<int> deleteLote(String id) async {
    final db = await database;
    return await db.delete(
      'lotes',
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  // ==================== LANÇAMENTOS DIÁRIOS ====================
  Future<String> insertLancamentoDiario(LancamentoDiario lancamento) async {
    final db = await database;
    await db.insert('lancamentos_diarios', lancamento.toMap());
    return lancamento.id;
  }

  Future<List<LancamentoDiario>> getLancamentosByLote(String loteId) async {
    final db = await database;
    final result = await db.query(
      'lancamentos_diarios',
      where: 'loteId = ?',
      whereArgs: [loteId],
      orderBy: 'data ASC',
    );
    return result.map((map) => LancamentoDiario.fromMap(map)).toList();
  }

  Future<int> updateLancamentoDiario(LancamentoDiario lancamento) async {
    final db = await database;
    return db.update(
      'lancamentos_diarios',
      lancamento.toMap(),
      where: 'id = ?',
      whereArgs: [lancamento.id],
    );
  }

  Future<int> deleteLancamentoDiario(String id) async {
    final db = await database;
    return await db.delete(
      'lancamentos_diarios',
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  // ==================== CUSTOS FIXOS ====================
  Future<String> insertCustoFixo(CustoFixo custo) async {
    final db = await database;
    await db.insert('custos_fixos', custo.toMap());
    return custo.id;
  }

  Future<List<CustoFixo>> getAllCustosFixos() async {
    final db = await database;
    final result = await db.query('custos_fixos', orderBy: 'descricao ASC');
    return result.map((map) => CustoFixo.fromMap(map)).toList();
  }

  Future<int> updateCustoFixo(CustoFixo custo) async {
    final db = await database;
    return db.update(
      'custos_fixos',
      custo.toMap(),
      where: 'id = ?',
      whereArgs: [custo.id],
    );
  }

  Future<int> deleteCustoFixo(String id) async {
    final db = await database;
    return await db.delete(
      'custos_fixos',
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  // ==================== CUSTOS VARIÁVEIS ====================
  Future<String> insertCustoVariavel(CustoVariavel custo) async {
    final db = await database;
    await db.insert('custos_variaveis', custo.toMap());
    return custo.id;
  }

  Future<List<CustoVariavel>> getCustosVariaveisByLote(String loteId) async {
    final db = await database;
    final result = await db.query(
      'custos_variaveis',
      where: 'loteId = ?',
      whereArgs: [loteId],
      orderBy: 'descricao ASC',
    );
    return result.map((map) => CustoVariavel.fromMap(map)).toList();
  }

  Future<int> updateCustoVariavel(CustoVariavel custo) async {
    final db = await database;
    return db.update(
      'custos_variaveis',
      custo.toMap(),
      where: 'id = ?',
      whereArgs: [custo.id],
    );
  }

  Future<int> deleteCustoVariavel(String id) async {
    final db = await database;
    return await db.delete(
      'custos_variaveis',
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  // ==================== INVESTIMENTOS ====================
  Future<String> insertInvestimento(Investimento investimento) async {
    final db = await database;
    await db.insert('investimentos', investimento.toMap());
    return investimento.id;
  }

  Future<List<Investimento>> getAllInvestimentos() async {
    final db = await database;
    final result = await db.query('investimentos', orderBy: 'descricao ASC');
    return result.map((map) => Investimento.fromMap(map)).toList();
  }

  Future<int> updateInvestimento(Investimento investimento) async {
    final db = await database;
    return db.update(
      'investimentos',
      investimento.toMap(),
      where: 'id = ?',
      whereArgs: [investimento.id],
    );
  }

  Future<int> deleteInvestimento(String id) async {
    final db = await database;
    return await db.delete(
      'investimentos',
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  // ==================== PARÂMETROS DE RECEITA ====================
  Future<String> insertParametrosReceita(ParametrosReceita parametros) async {
    final db = await database;
    await db.insert('parametros_receita', parametros.toMap());
    return parametros.id;
  }

  Future<ParametrosReceita?> getParametrosReceita() async {
    final db = await database;
    final result = await db.query(
      'parametros_receita',
      orderBy: 'dataAtualizacao DESC',
      limit: 1,
    );
    if (result.isNotEmpty) {
      return ParametrosReceita.fromMap(result.first);
    }
    return null;
  }

  Future<int> updateParametrosReceita(ParametrosReceita parametros) async {
    final db = await database;
    return db.update(
      'parametros_receita',
      parametros.toMap(),
      where: 'id = ?',
      whereArgs: [parametros.id],
    );
  }

  // Fechar banco de dados
  Future close() async {
    final db = await database;
    db.close();
  }
}
