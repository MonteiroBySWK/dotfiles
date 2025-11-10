// Tipos para o processamento dos dados
export type ProductRequestBody = {
  id: number;
  nome_produto: string;
  valor_unit: number;
};

export type ClientRequestBody = {
  id_cliente: number;
  nome_cliente: string;
};

export type ItemRequestBody = {
  data_venda: string;
  qtd_vendida: number;
  produto: ProductRequestBody;
  cliente: ClientRequestBody;
};

/**
 * Processa o conteúdo de um arquivo .dat e converte para array de vendas
 */
export function processDatFileContent(fileContent: string): ItemRequestBody[] {
  if (!fileContent || !fileContent.trim()) {
    return [];
  }

  const lines = fileContent.split('\n').filter(line => line.trim());
  const processedData: ItemRequestBody[] = [];

  lines.forEach((line) => {
    // Verifica se a linha tem o tamanho mínimo esperado
    if (line.length < 136) {
      return; // Pula linhas que não têm o formato esperado
    }

    try {
      const item: ItemRequestBody = {
        data_venda: line.slice(125, 136).trim(),
        qtd_vendida: parseInt(line.slice(112, 116).trim()) || 0,
        produto: {
          id: parseInt(line.slice(0, 4).trim()) || 0,
          nome_produto: line.slice(4, 58).trim(),
          valor_unit: parseFloat(line.slice(116, 125).trim()) || 0,
        },
        cliente: {
          id_cliente: parseInt(line.slice(58, 62).trim()) || 0,
          nome_cliente: line.slice(62, 112).trim(),
        },
      };

      processedData.push(item);
    } catch (error) {
      console.warn('Erro ao processar linha:', line, error);
      // Continua processando outras linhas mesmo se uma falhar
    }
  });

  return processedData;
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