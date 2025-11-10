import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/financas_provider.dart';
import '../utils/formatters.dart';

class CustosFixosScreen extends StatefulWidget {
  const CustosFixosScreen({super.key});

  @override
  State<CustosFixosScreen> createState() => _CustosFixosScreenState();
}

class _CustosFixosScreenState extends State<CustosFixosScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(
      () => context.read<FinancasProvider>().carregarCustosFixos(),
    );
  }

  Future<void> _mostrarDialogoCadastro({String? id, String? descricaoInicial, double? valorInicial}) async {
    final descricaoController = TextEditingController(text: descricaoInicial);
    final valorController = TextEditingController(text: valorInicial?.toString());
    final formKey = GlobalKey<FormState>();

    return showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(id == null ? 'Novo Custo Fixo' : 'Editar Custo Fixo'),
        content: Form(
          key: formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextFormField(
                controller: descricaoController,
                decoration: const InputDecoration(
                  labelText: 'Descrição',
                  hintText: 'Ex: Telefone, Contabilidade',
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
                controller: valorController,
                decoration: const InputDecoration(
                  labelText: 'Valor Mensal (R\$)',
                  hintText: 'Ex: 150.00',
                ),
                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Campo obrigatório';
                  }
                  if (double.tryParse(value) == null) {
                    return 'Digite um valor válido';
                  }
                  return null;
                },
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancelar'),
          ),
          ElevatedButton(
            onPressed: () async {
              if (formKey.currentState!.validate()) {
                await context.read<FinancasProvider>().adicionarCustoFixo(
                      descricao: descricaoController.text,
                      valorMensal: double.parse(valorController.text),
                    );
                if (mounted) Navigator.pop(context);
              }
            },
            child: const Text('Salvar'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Custos Fixos'),
      ),
      body: Consumer<FinancasProvider>(
        builder: (context, provider, child) {
          if (provider.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          return Column(
            children: [
              Expanded(
                child: provider.custosFixos.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.attach_money, size: 80, color: Colors.grey[400]),
                            const SizedBox(height: 16),
                            Text(
                              'Nenhum custo fixo cadastrado',
                              style: TextStyle(fontSize: 18, color: Colors.grey[600]),
                            ),
                          ],
                        ),
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: provider.custosFixos.length,
                        itemBuilder: (context, index) {
                          final custo = provider.custosFixos[index];
                          return Card(
                            margin: const EdgeInsets.only(bottom: 12),
                            child: ListTile(
                              leading: CircleAvatar(
                                backgroundColor: Theme.of(context).colorScheme.primary,
                                child: const Icon(Icons.attach_money, color: Colors.white),
                              ),
                              title: Text(custo.descricao),
                              subtitle: Text('Mensal: ${Formatters.formatarMoeda(custo.valorMensal)}'),
                              trailing: IconButton(
                                icon: const Icon(Icons.delete, color: Colors.red),
                                onPressed: () async {
                                  await provider.deletarCustoFixo(custo.id);
                                },
                              ),
                            ),
                          );
                        },
                      ),
              ),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.grey.withOpacity(0.3),
                      spreadRadius: 1,
                      blurRadius: 5,
                      offset: const Offset(0, -2),
                    ),
                  ],
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Total Mensal:',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    Text(
                      Formatters.formatarMoeda(provider.totalCustosFixosMensal),
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Theme.of(context).colorScheme.primary,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _mostrarDialogoCadastro(),
        child: const Icon(Icons.add),
      ),
    );
  }
}
