class CustoVariavel {
  final String id;
  final String loteId;
  final String descricao; // Ex: Ração, Pintinhos, Medicamentos, etc.
  final double valor;
  final DateTime dataCriacao;

  CustoVariavel({
    required this.id,
    required this.loteId,
    required this.descricao,
    required this.valor,
    required this.dataCriacao,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'loteId': loteId,
      'descricao': descricao,
      'valor': valor,
      'dataCriacao': dataCriacao.toIso8601String(),
    };
  }

  factory CustoVariavel.fromMap(Map<String, dynamic> map) {
    return CustoVariavel(
      id: map['id'],
      loteId: map['loteId'],
      descricao: map['descricao'],
      valor: map['valor'],
      dataCriacao: DateTime.parse(map['dataCriacao']),
    );
  }

  CustoVariavel copyWith({
    String? id,
    String? loteId,
    String? descricao,
    double? valor,
    DateTime? dataCriacao,
  }) {
    return CustoVariavel(
      id: id ?? this.id,
      loteId: loteId ?? this.loteId,
      descricao: descricao ?? this.descricao,
      valor: valor ?? this.valor,
      dataCriacao: dataCriacao ?? this.dataCriacao,
    );
  }
}
