package br.org.cesjo.sgi.application.usecases.auth;

public interface TokenProvider {
  String generateAccessToken(String subject, Collection<String> authorities);

  String generateRefreshToken(String subject);

  String extractUsername(String token);

  boolean isTokenValid(String token, String expectedSubject);

  long getAccessTokenExpirationMillis();

}
