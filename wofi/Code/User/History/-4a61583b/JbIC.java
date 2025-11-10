package br.org.cesjo.sgi.infra.controllers;

import br.org.cesjo.sgi.application.dtos.user.UserLoginDto;
import br.org.cesjo.sgi.application.dtos.user.UserRegisterDto;
import br.org.cesjo.sgi.application.usecases.auth.AuthenticationService;
import br.org.cesjo.sgi.application.usecases.auth.RegistrationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationService authenticationService;
    private final RegistrationService registrationService;

    public AuthController(AuthenticationService authenticationService, RegistrationService registrationService) {
        this.authenticationService = authenticationService;
        this.registrationService = registrationService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody UserLoginDto loginDto, HttpServletRequest request) {
        try {
            String clientIp = getClientIp(request);
            String userAgent = request.getHeader("User-Agent");

            var response = authenticationService.authenticate(
                    loginDto.getUsername(),
                    loginDto.getPassword(),
                    clientIp,
                    userAgent
            );

            return ResponseEntity.ok(Map.of(
                    "access_token", response.accessToken(),
                    "refresh_token", response.refreshToken(),
                    "expires_in", response.expiresIn(),
                    "token_type", "Bearer"
            ));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "authentication_failed",
                    "message", e.getMessage()
            ));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody UserRegisterDto registerDto) {
        try {
            Set<String> roleNames = registerDto.getRole() != null ?
                    registerDto.getRole().stream().map(Enum::name).collect(java.util.stream.Collectors.toSet()) :
                    null;

            var user = registrationService.registerUser(
                    registerDto.getUsername(),
                    registerDto.getEmail(),
                    registerDto.getPassword(),
                    roleNames,
                    "system",
                    "system"
            );

            return ResponseEntity.ok(Map.of(
                    "message", "User registered successfully",
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
            String refreshToken = request.get("refresh_token");
            if (refreshToken == null) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "invalid_request",
                        "message", "Refresh token is required"
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
    public ResponseEntity<?> logout() {
        // In a stateless JWT system, logout is typically handled client-side
        // by simply discarding the token. However, you could implement token
        // blacklisting here if needed.
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
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
