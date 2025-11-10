package com.Varejo_Rapido.Varejo.controller;

import com.Varejo_Rapido.Varejo.model.Cliente;
import com.Varejo_Rapido.Varejo.model.Produto;
import com.Varejo_Rapido.Varejo.model.Venda;
import com.Varejo_Rapido.Varejo.model.dto.ItemRequestBody;
import com.Varejo_Rapido.Varejo.repository.ClienteRepository;
import com.Varejo_Rapido.Varejo.repository.ProdutoRepository;
import com.Varejo_Rapido.Varejo.repository.VendaRepository;
import com.Varejo_Rapido.Varejo.service.DatParserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/vendas")
public class VendaController {
    private final VendaRepository vendaRepository;
    private final DatParserService datParserService;
    private final ProdutoRepository produtoRepository;
    private final ClienteRepository clienteRepository;

    public VendaController(VendaRepository vendaRepository, DatParserService datParserService, 
                          ProdutoRepository produtoRepository, ClienteRepository clienteRepository) {
        this.vendaRepository = vendaRepository;
        this.datParserService = datParserService;
        this.produtoRepository = produtoRepository;
        this.clienteRepository = clienteRepository;
    }

    // Endpoint principal
    @GetMapping
    public List<Venda> listar() {
        return vendaRepository.findAll();
    }

    // Forçar reload do arquivo
    @PostMapping("/reload")
    public ResponseEntity<?> reload() throws IOException {
        return ResponseEntity.ok(datParserService.parseAndStore());
    }

    // Criar nova venda
    @PostMapping
    public ResponseEntity<Venda> criarVenda(@RequestBody Venda venda) {
        Venda saved = vendaRepository.save(venda);
        return ResponseEntity.ok(saved);
    }
}