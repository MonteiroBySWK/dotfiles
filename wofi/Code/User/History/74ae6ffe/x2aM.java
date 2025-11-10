package br.org.cesjo.sgi.application.dtos.user;

public record LoginResponse(
  String accessToken,
  String refreshToken,
  long expiresIn
) {}