package com.Varejo_Rapido.Varejo.repository;
import com.Varejo_Rapido.Varejo.model.Cliente;
import com.Varejo_Rapido.Varejo.model.Produto;
import com.Varejo_Rapido.Varejo.model.Venda;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VendaRepository extends JpaRepository<Venda, Long> {
    List<Venda> findByCliente(Cliente cliente);
    List<Venda> findByProduto(Produto produto);
}