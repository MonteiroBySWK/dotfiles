import type { ProductRequestBody, ClientRequestBody, ItemRequestBody } from '@/types/sales';

/**
 * Processa o conteúdo de um arquivo .dat usando a mesma lógica do Reader.tsx
 */
export function processDatFileContent(fileContent: string): ItemRequestBody[] {
  if (!fileContent || !fileContent.trim()) {
    return [];
  }

  const arr = fileContent.split('\n');
  const requestBody: ItemRequestBody[] = [];

  arr.forEach((e) => {
    if (!e.trim()) return; // Pula linhas vazias

    try {
      const item: ItemRequestBody = {
        data_venda: e.slice(125, 136).trim(),
        qtd_vendida: parseInt(e.slice(112, 116).trim()),
        produto: {
          id: parseInt(e.slice(0, 4).trim()),
          nome_produto: e.slice(4, 58).trim(),
          valor_unit: parseFloat(e.slice(116, 125).trim()),
        },
        cliente: {
          id_cliente: parseInt(e.slice(58, 62).trim()),
          nome_cliente: e.slice(62, 112).trim(),
        },
      };

      requestBody.push(item);
    } catch (error) {
      console.warn('Erro ao processar linha:', e, error);
    }
  });

  return requestBody;
}

/**
 * Converte dados processados do .dat para o formato da tabela de vendas
 */
export function convertToSalesData(datData: ItemRequestBody[]) {
  return datData.map((item, index) => ({
    id: `dat-${index + 1}`,
    saleDate: item.data_venda,
    customerName: item.cliente.nome_cliente,
    productName: item.produto.nome_produto,
    quantity: item.qtd_vendida,
    unitValue: item.produto.valor_unit,
    totalValue: item.qtd_vendida * item.produto.valor_unit,
  }));
}