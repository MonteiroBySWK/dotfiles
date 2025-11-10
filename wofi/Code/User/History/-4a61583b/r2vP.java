package br.org.cesjo.sgi.infra.controllers;

import br.org.cesjo.sgi.application.dtos.user.LoginRequest;
import br.org.cesjo.sgi.application.dtos.user.RegisterRequest;
import br.org.cesjo.sgi.application.dtos.user.LoginResponse;
import br.org.cesjo.sgi.application.usecases.auth.AuthenticationService;
import br.org.cesjo.sgi.application.usecases.auth.RegistrationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationService authenticationService;
    private final RegistrationService registrationService;

    public AuthController(AuthenticationService authenticationService, RegistrationService registrationService) {
        this.authenticationService = authenticationService;
        this.registrationService = registrationService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginDto, HttpServletRequest request) {
        try {
            String clientIp = getClientIp(request);
            String userAgent = request.getHeader("User-Agent");

            LoginResponse response = authenticationService.authenticate(
                    loginDto.username(),
                    loginDto.password(),
                    clientIp,
                    userAgent
            );
            

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "authentication_failed",
                    "message", e.getMessage()
            ));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerDto) {
        try {
            Set<String> roleNames = registerDto.roles() != null ?
                    registerDto.roles().stream()
                            .map(role -> role.startsWith("ROLE_") ? role : "ROLE_" + role)
                            .collect(Collectors.toSet()) :
                    null;

            var user = registrationService.registerUser(
                    registerDto.username(),
                    registerDto.email(),
                    registerDto.password(),
                    roleNames,
                    "system", // ID do criador (ajustar quando tiver autenticação)
                    "system"  // Nome do criador (ajustar quando tiver autenticação)
            );



            return ResponseEntity.ok(Map.of(
                    "message", "Usuário registrado com sucesso",
                    "userId", user.getId(),
                    "username", user.getUsername(),
                    "email", user.getEmail()
            ));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "registration_failed",
                    "message", e.getMessage()
            ));
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody Map<String, String> request) {
        try {
            String refreshToken = request.get("refreshToken");
            if (refreshToken == null || refreshToken.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "invalid_request",
                        "message", "Refresh token é obrigatório"
                ));
            }

            String newAccessToken = authenticationService.refreshToken(refreshToken);

            return ResponseEntity.ok(Map.of(
                    "access_token", newAccessToken,
                    "token_type", "Bearer"
            ));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "invalid_token",
                    "message", e.getMessage()
            ));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {
        try {
            // Em sistemas JWT stateless, o logout é feito no cliente
            // Mas podemos registrar o logout para auditoria
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                // Podemos adicionar lógica de blacklist aqui se necessário
            }

            return ResponseEntity.ok(Map.of("message", "Logout realizado com sucesso"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "logout_failed",
                    "message", e.getMessage()
            ));
        }
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }

        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }

        return request.getRemoteAddr();
    }
}