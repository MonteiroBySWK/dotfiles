#!/bin/bash

# Script para criar 50 vendas de teste na API Java
echo "🚀 Iniciando criação de 50 vendas de teste..."

# Arrays com dados variados para tornar os testes mais realistas
produtos=(
  '{"id": 1001, "nome_produto": "Teclado Mecânico Gamer RGB", "valor_unit": 299.90}'
  '{"id": 1002, "nome_produto": "Mouse Gamer Wireless", "valor_unit": 159.90}'
  '{"id": 1003, "nome_produto": "Monitor 27 Polegadas 4K", "valor_unit": 1899.00}'
  '{"id": 1004, "nome_produto": "Headset Gamer 7.1", "valor_unit": 249.90}'
  '{"id": 1005, "nome_produto": "Webcam Full HD 1080p", "valor_unit": 189.90}'
  '{"id": 1006, "nome_produto": "Microfone Condensador", "valor_unit": 399.00}'
  '{"id": 1007, "nome_produto": "Cadeira Gamer Ergonômica", "valor_unit": 899.90}'
  '{"id": 1008, "nome_produto": "Mesa Gamer com LED", "valor_unit": 599.00}'
  '{"id": 1009, "nome_produto": "Placa de Vídeo RTX 4060", "valor_unit": 2499.00}'
  '{"id": 1010, "nome_produto": "SSD NVMe 1TB", "valor_unit": 449.90}'
)

clientes=(
  '{"id_cliente": 2001, "nome_cliente": "João Silva Santos"}'
  '{"id_cliente": 2002, "nome_cliente": "Maria Oliveira Costa"}'
  '{"id_cliente": 2003, "nome_cliente": "Pedro Almeida Lima"}'
  '{"id_cliente": 2004, "nome_cliente": "Ana Carolina Souza"}'
  '{"id_cliente": 2005, "nome_cliente": "Carlos Eduardo Pereira"}'
  '{"id_cliente": 2006, "nome_cliente": "Fernanda Rodrigues"}'
  '{"id_cliente": 2007, "nome_cliente": "Roberto Machado"}'
  '{"id_cliente": 2008, "nome_cliente": "Juliana Mendes"}'
  '{"id_cliente": 2009, "nome_cliente": "Lucas Barbosa"}'
  '{"id_cliente": 2010, "nome_cliente": "Camila Ferreira"}'
)

datas=("2025-10-01" "2025-10-02" "2025-10-03" "2025-09-30" "2025-09-29" "2025-09-28")

contador_sucesso=0
contador_erro=0

# Loop para criar 50 vendas
for i in {1..50}; do
  # Selecionar dados aleatórios
  produto_idx=$((RANDOM % ${#produtos[@]}))
  cliente_idx=$((RANDOM % ${#clientes[@]}))
  data_idx=$((RANDOM % ${#datas[@]}))
  quantidade=$((RANDOM % 10 + 1)) # Quantidade entre 1 e 10
  
  produto=${produtos[$produto_idx]}
  cliente=${clientes[$cliente_idx]}
  data=${datas[$data_idx]}
  
  # Construir JSON da venda
  json_data="[{
    \"data_venda\": \"$data\",
    \"qtd_vendida\": $quantidade,
    \"produto\": $produto,
    \"cliente\": $cliente
  }]"
  
  echo "🔄 Criando venda $i/50..."
  
  # Fazer requisição POST
  response=$(curl -s -w "%{http_code}" -X POST http://localhost:8080/vendas \
    -H "Content-Type: application/json" \
    -d "$json_data")
  
  # Extrair status code (últimos 3 caracteres)
  status_code="${response: -3}"
  response_body="${response%???}"
  
  if [[ "$status_code" =~ ^2[0-9][0-9]$ ]]; then
    ((contador_sucesso++))
    echo "✅ Venda $i criada com sucesso (Status: $status_code)"
  else
    ((contador_erro++))
    echo "❌ Erro na venda $i (Status: $status_code)"
    echo "   Resposta: $response_body"
  fi
  
  # Pequena pausa para não sobrecarregar a API
  sleep 0.1
done

echo ""
echo "📊 RESUMO FINAL:"
echo "✅ Vendas criadas com sucesso: $contador_sucesso"
echo "❌ Vendas com erro: $contador_erro"
echo "📈 Total de tentativas: 50"
echo ""

if [ $contador_sucesso -gt 0 ]; then
  echo "🎉 Dados de teste criados! Recarregue a tabela para ver as novas vendas."
else
  echo "⚠️  Nenhuma venda foi criada. Verifique se a API Java está rodando na porta 8080."
fi