class Lote {
  final String id;
  final String mesAno;
  final String numeroLote;
  final String galpao;
  final String linhagem;
  final DateTime dataNascimento;
  final int quantidadeInicialAves;
  final DateTime dataCriacao;

  Lote({
    required this.id,
    required this.mesAno,
    required this.numeroLote,
    required this.galpao,
    required this.linhagem,
    required this.dataNascimento,
    required this.quantidadeInicialAves,
    required this.dataCriacao,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'mesAno': mesAno,
      'numeroLote': numeroLote,
      'galpao': galpao,
      'linhagem': linhagem,
      'dataNascimento': dataNascimento.toIso8601String(),
      'quantidadeInicialAves': quantidadeInicialAves,
      'dataCriacao': dataCriacao.toIso8601String(),
    };
  }

  factory Lote.fromMap(Map<String, dynamic> map) {
    return Lote(
      id: map['id'],
      mesAno: map['mesAno'],
      numeroLote: map['numeroLote'],
      galpao: map['galpao'],
      linhagem: map['linhagem'],
      dataNascimento: DateTime.parse(map['dataNascimento']),
      quantidadeInicialAves: map['quantidadeInicialAves'],
      dataCriacao: DateTime.parse(map['dataCriacao']),
    );
  }

  Lote copyWith({
    String? id,
    String? mesAno,
    String? numeroLote,
    String? galpao,
    String? linhagem,
    DateTime? dataNascimento,
    int? quantidadeInicialAves,
    DateTime? dataCriacao,
  }) {
    return Lote(
      id: id ?? this.id,
      mesAno: mesAno ?? this.mesAno,
      numeroLote: numeroLote ?? this.numeroLote,
      galpao: galpao ?? this.galpao,
      linhagem: linhagem ?? this.linhagem,
      dataNascimento: dataNascimento ?? this.dataNascimento,
      quantidadeInicialAves: quantidadeInicialAves ?? this.quantidadeInicialAves,
      dataCriacao: dataCriacao ?? this.dataCriacao,
    );
  }
}
