import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/financas_provider.dart';

class ParametrosReceitaScreen extends StatefulWidget {
  const ParametrosReceitaScreen({super.key});

  @override
  State<ParametrosReceitaScreen> createState() => _ParametrosReceitaScreenState();
}

class _ParametrosReceitaScreenState extends State<ParametrosReceitaScreen> {
  final _formKey = GlobalKey<FormState>();
  final _aproveitamentoController = TextEditingController();
  final _pesoMedioController = TextEditingController();
  final _valorFrangoController = TextEditingController();
  final _receitaCamaController = TextEditingController();
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _carregarDados();
  }

  Future<void> _carregarDados() async {
    await context.read<FinancasProvider>().carregarParametrosReceita();
    final params = context.read<FinancasProvider>().parametrosReceita;
    
    if (params != null) {
      _aproveitamentoController.text = params.aproveitamentoPercentual.toString();
      _pesoMedioController.text = params.pesoMedioFrangoVivo.toString();
      _valorFrangoController.text = params.valorFrangoVivoKg.toString();
      _receitaCamaController.text = params.receitaCamaAviario.toString();
    }
  }

  @override
  void dispose() {
    _aproveitamentoController.dispose();
    _pesoMedioController.dispose();
    _valorFrangoController.dispose();
    _receitaCamaController.dispose();
    super.dispose();
  }

  Future<void> _salvar() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    setState(() {
      _isLoading = true;
    });

    try {
      await context.read<FinancasProvider>().atualizarParametrosReceita(
            aproveitamentoPercentual: double.parse(_aproveitamentoController.text),
            pesoMedioFrangoVivo: double.parse(_pesoMedioController.text),
            valorFrangoVivoKg: double.parse(_valorFrangoController.text),
            receitaCamaAviario: double.parse(_receitaCamaController.text),
          );

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Parâmetros atualizados com sucesso!')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erro ao salvar: $e')),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Parâmetros de Receita'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text(
                'Configure os parâmetros para cálculo da receita',
                style: TextStyle(fontSize: 16, color: Colors.grey),
              ),
              const SizedBox(height: 24),
              TextFormField(
                controller: _aproveitamentoController,
                decoration: const InputDecoration(
                  labelText: 'Aproveitamento (%)',
                  hintText: 'Ex: 97',
                  prefixIcon: Icon(Icons.percent),
                  helperText: 'Percentual de aves que chegam ao final do ciclo',
                ),
                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Campo obrigatório';
                  }
                  final num = double.tryParse(value);
                  if (num == null || num <= 0 || num > 100) {
                    return 'Digite um valor entre 0 e 100';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _pesoMedioController,
                decoration: const InputDecoration(
                  labelText: 'Peso Médio do Frango Vivo (Kg)',
                  hintText: 'Ex: 2.5',
                  prefixIcon: Icon(Icons.monitor_weight),
                  helperText: 'Peso médio esperado de cada ave ao final',
                ),
                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Campo obrigatório';
                  }
                  if (double.tryParse(value) == null) {
                    return 'Digite um número válido';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _valorFrangoController,
                decoration: const InputDecoration(
                  labelText: 'Valor do Frango Vivo por Kg (R\$)',
                  hintText: 'Ex: 6.50',
                  prefixIcon: Icon(Icons.attach_money),
                  helperText: 'Preço de venda por Kg',
                ),
                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Campo obrigatório';
                  }
                  if (double.tryParse(value) == null) {
                    return 'Digite um número válido';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _receitaCamaController,
                decoration: const InputDecoration(
                  labelText: 'Receita da Cama de Aviário (R\$)',
                  hintText: 'Ex: 100.00',
                  prefixIcon: Icon(Icons.landscape),
                  helperText: 'Receita média obtida com a venda da cama',
                ),
                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Campo obrigatório';
                  }
                  if (double.tryParse(value) == null) {
                    return 'Digite um número válido';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 32),
              ElevatedButton(
                onPressed: _isLoading ? null : _salvar,
                child: _isLoading
                    ? const SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                        ),
                      )
                    : const Text('Salvar Parâmetros'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
