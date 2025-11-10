package com.Varejo_Rapido.Varejo.model.dto;

import lombok.Data;

@Data
public class ItemRequestBody {
    private String data_venda;
    private int qtd_vendida;
    private ProdutoDTO produto;
    private ClienteDTO cliente;
}