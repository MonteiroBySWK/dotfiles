package br.org.cesjo.sgi.application.dtos.user;

public record LoginResponse(
  String acesssToken,
  String refreshToken,
  long expiresIn
) {}
