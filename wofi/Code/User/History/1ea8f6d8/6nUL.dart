import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/lancamentos_provider.dart';

class LancamentoDiarioScreen extends StatefulWidget {
  final String loteId;

  const LancamentoDiarioScreen({super.key, required this.loteId});

  @override
  State<LancamentoDiarioScreen> createState() => _LancamentoDiarioScreenState();
}

class _LancamentoDiarioScreenState extends State<LancamentoDiarioScreen> {
  final _formKey = GlobalKey<FormState>();
  DateTime _data = DateTime.now();
  final _semanaController = TextEditingController();
  final _mortosController = TextEditingController();
  final _consumoRacaoController = TextEditingController();
  final _pesoAvesController = TextEditingController();
  bool _isLoading = false;

  @override
  void dispose() {
    _semanaController.dispose();
    _mortosController.dispose();
    _consumoRacaoController.dispose();
    _pesoAvesController.dispose();
    super.dispose();
  }

  Future<void> _selecionarData() async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _data,
      firstDate: DateTime(2020),
      lastDate: DateTime.now(),
    );
    if (picked != null && picked != _data) {
      setState(() {
        _data = picked;
      });
    }
  }

  Future<void> _salvar() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    setState(() {
      _isLoading = true;
    });

    try {
      await context.read<LancamentosProvider>().adicionarLancamento(
            loteId: widget.loteId,
            data: _data,
            semana: int.parse(_semanaController.text),
            mortos: int.parse(_mortosController.text),
            consumoRacaoReal: double.parse(_consumoRacaoController.text),
            pesoAves: double.parse(_pesoAvesController.text),
          );

      if (mounted) {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Lançamento registrado com sucesso!')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erro ao salvar lançamento: $e')),
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
        title: const Text('Lançamento Diário'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              InkWell(
                onTap: _selecionarData,
                child: InputDecorator(
                  decoration: const InputDecoration(
                    labelText: 'Data',
                    prefixIcon: Icon(Icons.calendar_today),
                  ),
                  child: Text(
                    '${_data.day.toString().padLeft(2, '0')}/${_data.month.toString().padLeft(2, '0')}/${_data.year}',
                    style: const TextStyle(fontSize: 16),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _semanaController,
                decoration: const InputDecoration(
                  labelText: 'Semana',
                  hintText: 'Ex: 1',
                  prefixIcon: Icon(Icons.view_week),
                ),
                keyboardType: TextInputType.number,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Campo obrigatório';
                  }
                  if (int.tryParse(value) == null) {
                    return 'Digite um número válido';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _mortosController,
                decoration: const InputDecoration(
                  labelText: 'Mortos (Aves)',
                  hintText: 'Ex: 10',
                  prefixIcon: Icon(Icons.warning),
                ),
                keyboardType: TextInputType.number,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Campo obrigatório';
                  }
                  if (int.tryParse(value) == null) {
                    return 'Digite um número válido';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _consumoRacaoController,
                decoration: const InputDecoration(
                  labelText: 'Consumo de Ração Real (gramas)',
                  hintText: 'Ex: 150.5',
                  prefixIcon: Icon(Icons.restaurant),
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
                controller: _pesoAvesController,
                decoration: const InputDecoration(
                  labelText: 'Peso das Aves (Kg)',
                  hintText: 'Ex: 2.5',
                  prefixIcon: Icon(Icons.monitor_weight),
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
                    : const Text('Salvar Lançamento'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
