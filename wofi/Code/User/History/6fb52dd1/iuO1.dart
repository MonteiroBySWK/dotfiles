import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/lotes_provider.dart';

class CadastroLoteScreen extends StatefulWidget {
  const CadastroLoteScreen({super.key});

  @override
  State<CadastroLoteScreen> createState() => _CadastroLoteScreenState();
}

class _CadastroLoteScreenState extends State<CadastroLoteScreen> {
  final _formKey = GlobalKey<FormState>();
  final _mesAnoController = TextEditingController();
  final _numeroLoteController = TextEditingController();
  final _galpaoController = TextEditingController();
  final _linhagemController = TextEditingController();
  final _quantidadeController = TextEditingController();
  DateTime _dataNascimento = DateTime.now();
  bool _isLoading = false;

  @override
  void dispose() {
    _mesAnoController.dispose();
    _numeroLoteController.dispose();
    _galpaoController.dispose();
    _linhagemController.dispose();
    _quantidadeController.dispose();
    super.dispose();
  }

  Future<void> _selecionarData() async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _dataNascimento,
      firstDate: DateTime(2020),
      lastDate: DateTime.now(),
    );
    if (picked != null && picked != _dataNascimento) {
      setState(() {
        _dataNascimento = picked;
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
      await context.read<LotesProvider>().adicionarLote(
            mesAno: _mesAnoController.text,
            numeroLote: _numeroLoteController.text,
            galpao: _galpaoController.text,
            linhagem: _linhagemController.text,
            dataNascimento: _dataNascimento,
            quantidadeInicialAves: int.parse(_quantidadeController.text),
          );

      if (mounted) {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Lote cadastrado com sucesso!')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erro ao cadastrar lote: $e')),
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
        title: const Text('Novo Lote'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              TextFormField(
                controller: _mesAnoController,
                decoration: const InputDecoration(
                  labelText: 'Mês e Ano',
                  hintText: 'Ex: Janeiro/2025',
                  prefixIcon: Icon(Icons.calendar_month),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Campo obrigatório';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _numeroLoteController,
                decoration: const InputDecoration(
                  labelText: 'Número do Lote',
                  hintText: 'Ex: 001',
                  prefixIcon: Icon(Icons.numbers),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Campo obrigatório';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _galpaoController,
                decoration: const InputDecoration(
                  labelText: 'Galpão',
                  hintText: 'Ex: A1',
                  prefixIcon: Icon(Icons.warehouse),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Campo obrigatório';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _linhagemController,
                decoration: const InputDecoration(
                  labelText: 'Linhagem',
                  hintText: 'Ex: Cobb 500',
                  prefixIcon: Icon(Icons.pets),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Campo obrigatório';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              InkWell(
                onTap: _selecionarData,
                child: InputDecorator(
                  decoration: const InputDecoration(
                    labelText: 'Data de Nascimento',
                    prefixIcon: Icon(Icons.calendar_today),
                  ),
                  child: Text(
                    '${_dataNascimento.day.toString().padLeft(2, '0')}/${_dataNascimento.month.toString().padLeft(2, '0')}/${_dataNascimento.year}',
                    style: const TextStyle(fontSize: 16),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _quantidadeController,
                decoration: const InputDecoration(
                  labelText: 'Quantidade Inicial de Aves',
                  hintText: 'Ex: 5000',
                  prefixIcon: Icon(Icons.format_list_numbered),
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
                    : const Text('Salvar Lote'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
