package com.Varejo_Rapido.Varejo.model.dto;

import lombok.Data;

@Data
public class ProdutoDTO {
    private int id;
    private String nome_produto;
    private double valor_unit;
}