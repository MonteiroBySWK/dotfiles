class CustoFixo {
  final String id;
  final String descricao;
  final double valorMensal;
  final DateTime dataCriacao;

  CustoFixo({
    required this.id,
    required this.descricao,
    required this.valorMensal,
    required this.dataCriacao,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'descricao': descricao,
      'valorMensal': valorMensal,
      'dataCriacao': dataCriacao.toIso8601String(),
    };
  }

  factory CustoFixo.fromMap(Map<String, dynamic> map) {
    return CustoFixo(
      id: map['id'],
      descricao: map['descricao'],
      valorMensal: map['valorMensal'],
      dataCriacao: DateTime.parse(map['dataCriacao']),
    );
  }

  CustoFixo copyWith({
    String? id,
    String? descricao,
    double? valorMensal,
    DateTime? dataCriacao,
  }) {
    return CustoFixo(
      id: id ?? this.id,
      descricao: descricao ?? this.descricao,
      valorMensal: valorMensal ?? this.valorMensal,
      dataCriacao: dataCriacao ?? this.dataCriacao,
    );
  }
}
