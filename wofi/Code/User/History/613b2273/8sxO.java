package com.Varejo_Rapido.Varejo.repository;
import com.Varejo_Rapido.Varejo.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, String> {
    List<Cliente> findByNomeContainingIgnoreCase(String nome);
}