import 'package:intl/intl.dart';

class Formatters {
  // Formata valor em moeda brasileira
  static String formatarMoeda(double valor) {
    final formatter = NumberFormat.currency(
      locale: 'pt_BR',
      symbol: 'R\$',
      decimalDigits: 2,
    );
    return formatter.format(valor);
  }

  // Formata percentual
  static String formatarPercentual(double valor, {int decimais = 2}) {
    return '${valor.toStringAsFixed(decimais)}%';
  }

  // Formata data
  static String formatarData(DateTime data) {
    final formatter = DateFormat('dd/MM/yyyy', 'pt_BR');
    return formatter.format(data);
  }

  // Formata data e hora
  static String formatarDataHora(DateTime data) {
    final formatter = DateFormat('dd/MM/yyyy HH:mm', 'pt_BR');
    return formatter.format(data);
  }

  // Formata número com separador de milhar
  static String formatarNumero(double valor, {int decimais = 2}) {
    final formatter = NumberFormat.decimalPattern('pt_BR');
    return formatter.format(valor);
  }

  // Formata peso em Kg
  static String formatarPeso(double peso) {
    return '${peso.toStringAsFixed(2)} Kg';
  }

  // Formata quantidade de aves
  static String formatarQuantidadeAves(int quantidade) {
    final formatter = NumberFormat.decimalPattern('pt_BR');
    return '${formatter.format(quantidade)} aves';
  }

  // Formata meses
  static String formatarMeses(double meses) {
    if (meses < 1) {
      final dias = (meses * 30).round();
      return '$dias dias';
    }
    return '${meses.toStringAsFixed(1)} meses';
  }
}
