class Investimento {
  final String id;
  final String descricao;
  final double valor;
  final DateTime dataCriacao;

  Investimento({
    required this.id,
    required this.descricao,
    required this.valor,
    required this.dataCriacao,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'descricao': descricao,
      'valor': valor,
      'dataCriacao': dataCriacao.toIso8601String(),
    };
  }

  factory Investimento.fromMap(Map<String, dynamic> map) {
    return Investimento(
      id: map['id'],
      descricao: map['descricao'],
      valor: map['valor'],
      dataCriacao: DateTime.parse(map['dataCriacao']),
    );
  }

  Investimento copyWith({
    String? id,
    String? descricao,
    double? valor,
    DateTime? dataCriacao,
  }) {
    return Investimento(
      id: id ?? this.id,
      descricao: descricao ?? this.descricao,
      valor: valor ?? this.valor,
      dataCriacao: dataCriacao ?? this.dataCriacao,
    );
  }
}
