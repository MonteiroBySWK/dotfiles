package br.gov.social.atendimento.service;

import br.gov.social.atendimento.model.Senha;
import br.gov.social.atendimento.repository.ISenhaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Service
public class SenhaService {
    @Autowired
    private final ISenhaRepository senhaRepository;

    SenhaService(ISenhaRepository senhaRepository) {
        this.senhaRepository = senhaRepository;
    }

    @GetMapping
    public List<Senha> findAll() {
        return senhaRepository.findAll();
    }
}
