package br.org.cesjo.sgi.infra.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.org.cesjo.sgi.infra.persistence.UserEntity;
import br.org.cesjo.sgi.infra.persistence.UserEntityRepository;

import java.util.List;

import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/auth")
public class AuthController {
  private final UserEntityRepository repo;

  public AuthController(UserEntityRepository repo) {
    this.repo = repo;    
  }


  @GetMapping("/login")
  public List<UserEntity> login() {
    return repo.findAll();
  }
}
