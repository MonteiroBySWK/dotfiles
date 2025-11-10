package br.org.cesjo.sgi.application.usecases.auth;

import br.org.cesjo.sgi.domain.user.User;
import br.org.cesjo.sgi.domain.user.UserRepository;
import br.org.cesjo.sgi.infra.security.AuthorizationService;
import br.org.cesjo.sgi.infra.security.JwtService;
import br.org.cesjo.sgi.application.usecases.audit.AuditService;
import br.org.cesjo.sgi.domain.audit.AuditAction;
import br.org.cesjo.sgi.domain.audit.AuditResult;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public class AuthenticationService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final AuthorizationService authorizationService;
    private final AuditService auditService;

    public AuthenticationService(
            UserRepository userRepository,
            AuthenticationManager authenticationManager,
            AuthorizationService authorizationService,
            AuditService auditService,
            JwtService jwtService
    ) {
        this.userRepository = Objects.requireNonNull(userRepository);
        this.jwtService = Objects.requireNonNull(jwtService);
        this.authenticationManager = Objects.requireNonNull(authenticationManager);
        this.authorizationService = Objects.requireNonNull(authorizationService);
        this.auditService = Objects.requireNonNull(auditService);
    }

    public LoginResponse authenticate(String username, String password, String clientIp, String userAgent) {
        try {
            // Find user
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

            // Check if user is active and not locked
            if (!user.isActive()) {
                auditLoginFailure(user, "Account is inactive", clientIp, userAgent);
                throw new BadCredentialsException("Account is inactive");
            }

            if (user.isLocked()) {
                auditLoginFailure(user, "Account is locked", clientIp, userAgent);
                throw new BadCredentialsException("Account is locked");
            }

            // Authenticate
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );

            // Update user login information
            user.recordLogin();
            userRepository.save(user);

            // Generate tokens
            UserDetails userDetails = authorizationService.loadUserByUsername(username);
            String accessToken = jwtService.generateToken(userDetails);
            String refreshToken = jwtService.generateRefreshToken(userDetails);

            // Audit successful login
            auditLoginSuccess(user, clientIp, userAgent);

            return new LoginResponse(accessToken, refreshToken, jwtService.getExpirationTime());

        } catch (Exception e) {
            // Try to find user for audit, even if authentication failed
            userRepository.findByUsername(username).ifPresentOrElse(
                    user -> {
                        user.incrementFailedLoginAttempts();
                        userRepository.save(user);
                        auditLoginFailure(user, "Invalid credentials", clientIp, userAgent);
                    },
                    () -> auditService.auditWithContext(
                            "Authentication",
                            username,
                            AuditAction.LOGIN,
                            null,
                            username,
                            "Login failed - user not found",
                            clientIp,
                            userAgent
                    )
            );
            throw e;
        }
    }

    public String refreshToken(String refreshToken) {
        String username = jwtService.extractUsername(refreshToken);
        UserDetails userDetails = authorizationService.loadUserByUsername(username);

        if (jwtService.isTokenValid(refreshToken, userDetails)) {
            return jwtService.generateToken(userDetails);
        }

        throw new BadCredentialsException("Invalid refresh token");
    }

    private void auditLoginSuccess(User user, String clientIp, String userAgent) {
        auditService.auditWithContext(
                "Authentication",
                user.getId().toString(),
                AuditAction.LOGIN,
                user.getId(),
                user.getUsername(),
                "Login successful",
                clientIp,
                userAgent
        );
    }

    private void auditLoginFailure(User user, String reason, String clientIp, String userAgent) {
        var audit = new br.org.cesjo.sgi.domain.audit.Audit(
                "Authentication",
                user.getId(),
                AuditAction.LOGIN,
                user.getId(),
                user.getUsername()
        );
        audit.setDescription("Login failed: " + reason);
        audit.setResult(AuditResult.ERROR);
        audit.setClientIp(clientIp);
        audit.setUserAgent(userAgent);
        audit.setErrorMessage(reason);
    }

    public record LoginResponse(String accessToken, String refreshToken, long expiresIn) {}
}
