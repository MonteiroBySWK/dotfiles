package com.Varejo_Rapido.Varejo.model.dto;

import lombok.Data;
import java.util.List;

@Data
public class VendaResponse {
    private String message;
    private int totalProcessed;
    private int totalSuccess;
    private int totalErrors;
    private List<String> errors;
}