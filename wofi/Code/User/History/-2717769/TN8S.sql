-- Mock data for ClientesCliente
INSERT INTO clientes_cliente (nome, fone, email, categoria, curso, prioridade, data_de_registro) VALUES
('João Silva', '+5511999999999', 'joao.silva@example.com', 'A', 'Engenharia', 2, '2025-08-01 10:00:00'),
('Maria Oliveira', '+5511988888888', 'maria.oliveira@example.com', 'P', NULL, 1, '2025-08-02 11:00:00'),
('Carlos Souza', '+5511977777777', 'carlos.souza@example.com', 'E', NULL, 3, '2025-08-03 12:00:00');

-- Mock data for ServicosPedido
INSERT INTO servicos_pedido (titulo, descricao, data_de_registro, prazo_de_orcamento, orcamento, status, atendente_id, cliente_id, prazo_de_entrega, tecnico_id) VALUES
('Reparo de Notebook', 'Troca de teclado e limpeza interna.', '2025-08-05 09:00:00', '2025-08-10', 150.00, 'P', 1, 1, '2025-08-15', 2),
('Instalação de Software', 'Instalação de pacote Office.', '2025-08-06 10:00:00', '2025-08-12', 50.00, 'A', 2, 2, '2025-08-16', 3),
('Manutenção de Desktop', 'Troca de fonte e limpeza.', '2025-08-07 11:00:00', '2025-08-13', 200.00, 'C', 3, 3, '2025-08-17', 1);

-- Mock data for FinancasEntrada
INSERT INTO financas_entrada (descricao, valor, data, pedido_id) VALUES
('Pagamento pelo reparo de notebook', 150.00, '2025-08-15 14:00:00', 1),
('Pagamento pela instalação de software', 50.00, '2025-08-16 15:00:00', 2);

-- Mock data for FinancasSaida
INSERT INTO financas_saida (descricao, valor, data) VALUES
('Compra de peças para manutenção', 100.00, '2025-08-14 16:00:00'),
('Pagamento de técnico', 80.00, '2025-08-15 17:00:00');
