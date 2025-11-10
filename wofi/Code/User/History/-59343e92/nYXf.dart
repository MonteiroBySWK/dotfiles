class LancamentoDiario {
  final String id;
  final String loteId;
  final DateTime data;
  final int semana;
  final int mortos;
  final double consumoRacaoReal; // em gramas
  final double pesoAves; // em Kg

  LancamentoDiario({
    required this.id,
    required this.loteId,
    required this.data,
    required this.semana,
    required this.mortos,
    required this.consumoRacaoReal,
    required this.pesoAves,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'loteId': loteId,
      'data': data.toIso8601String(),
      'semana': semana,
      'mortos': mortos,
      'consumoRacaoReal': consumoRacaoReal,
      'pesoAves': pesoAves,
    };
  }

  factory LancamentoDiario.fromMap(Map<String, dynamic> map) {
    return LancamentoDiario(
      id: map['id'],
      loteId: map['loteId'],
      data: DateTime.parse(map['data']),
      semana: map['semana'],
      mortos: map['mortos'],
      consumoRacaoReal: map['consumoRacaoReal'],
      pesoAves: map['pesoAves'],
    );
  }

  LancamentoDiario copyWith({
    String? id,
    String? loteId,
    DateTime? data,
    int? semana,
    int? mortos,
    double? consumoRacaoReal,
    double? pesoAves,
  }) {
    return LancamentoDiario(
      id: id ?? this.id,
      loteId: loteId ?? this.loteId,
      data: data ?? this.data,
      semana: semana ?? this.semana,
      mortos: mortos ?? this.mortos,
      consumoRacaoReal: consumoRacaoReal ?? this.consumoRacaoReal,
      pesoAves: pesoAves ?? this.pesoAves,
    );
  }
}
