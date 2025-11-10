package br.org.cesjo.sgi.infra.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.org.cesjo.sgi.infra.persistence.UserEntity;

import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/auth")
public class AuthController {

  @PostMapping("/login")
  public UserEntity login(@RequestParam String param) {
    UserEntity u = new UserEntity();
    return u;
  }

}
