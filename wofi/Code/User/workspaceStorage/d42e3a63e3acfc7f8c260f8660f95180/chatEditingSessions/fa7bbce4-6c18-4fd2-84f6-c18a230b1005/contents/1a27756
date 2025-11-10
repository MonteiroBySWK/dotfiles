class ParametrosReceita {
  final String id;
  final double aproveitamentoPercentual; // % (ex: 97.0)
  final double pesoMedioFrangoVivo; // Kg
  final double valorFrangoVivoKg; // R$
  final double receitaCamaAviario; // R$
  final DateTime dataAtualizacao;

  ParametrosReceita({
    required this.id,
    required this.aproveitamentoPercentual,
    required this.pesoMedioFrangoVivo,
    required this.valorFrangoVivoKg,
    required this.receitaCamaAviario,
    required this.dataAtualizacao,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'aproveitamentoPercentual': aproveitamentoPercentual,
      'pesoMedioFrangoVivo': pesoMedioFrangoVivo,
      'valorFrangoVivoKg': valorFrangoVivoKg,
      'receitaCamaAviario': receitaCamaAviario,
      'dataAtualizacao': dataAtualizacao.toIso8601String(),
    };
  }

  factory ParametrosReceita.fromMap(Map<String, dynamic> map) {
    return ParametrosReceita(
      id: map['id'],
      aproveitamentoPercentual: map['aproveitamentoPercentual'],
      pesoMedioFrangoVivo: map['pesoMedioFrangoVivo'],
      valorFrangoVivoKg: map['valorFrangoVivoKg'],
      receitaCamaAviario: map['receitaCamaAviario'],
      dataAtualizacao: DateTime.parse(map['dataAtualizacao']),
    );
  }

  ParametrosReceita copyWith({
    String? id,
    double? aproveitamentoPercentual,
    double? pesoMedioFrangoVivo,
    double? valorFrangoVivoKg,
    double? receitaCamaAviario,
    DateTime? dataAtualizacao,
  }) {
    return ParametrosReceita(
      id: id ?? this.id,
      aproveitamentoPercentual: aproveitamentoPercentual ?? this.aproveitamentoPercentual,
      pesoMedioFrangoVivo: pesoMedioFrangoVivo ?? this.pesoMedioFrangoVivo,
      valorFrangoVivoKg: valorFrangoVivoKg ?? this.valorFrangoVivoKg,
      receitaCamaAviario: receitaCamaAviario ?? this.receitaCamaAviario,
      dataAtualizacao: dataAtualizacao ?? this.dataAtualizacao,
    );
  }
}
