package com.Varejo_Rapido.Varejo.repository;

import com.Varejo_Rapido.Varejo.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProdutoRepository extends JpaRepository<Produto, String> {
    List<Produto> findByNomeContainingIgnoreCase(String nome);
}
