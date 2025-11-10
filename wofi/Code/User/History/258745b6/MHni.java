package br.org.cesjo.sgi.application.usecases.auth;

import br.org.cesjo.sgi.application.dtos.user.LoginResponse;
import br.org.cesjo.sgi.application.usecases.audit.AuditService;
import br.org.cesjo.sgi.domain.audit.AuditAction;
import br.org.cesjo.sgi.domain.audit.AuditResult;
import br.org.cesjo.sgi.domain.user.User;
import br.org.cesjo.sgi.domain.user.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class AuthenticationService {

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final AuditService auditService;
    private final TokenProvider tokenProvider;

    public AuthenticationService(
            UserRepository userRepository,
            AuthenticationManager authenticationManager,
            UserDetailsService userDetailsService,
            AuditService auditService,
            TokenProvider tokenProvider
    ) {
        this.userRepository = Objects.requireNonNull(userRepository);
        this.authenticationManager = Objects.requireNonNull(authenticationManager);
        this.userDetailsService = Objects.requireNonNull(userDetailsService);
        this.auditService = Objects.requireNonNull(auditService);
        this.tokenProvider = Objects.requireNonNull(tokenProvider);
    }

    public LoginResponse authenticate(String username, String password, String clientIp, String userAgent) {
        try {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

            if (!user.isActive()) {
                auditLoginFailure(user, "Account is inactive", clientIp, userAgent);
                throw new BadCredentialsException("Account is inactive");
            }
            if (user.isLocked()) {
                auditLoginFailure(user, "Account is locked", clientIp, userAgent);
                throw new BadCredentialsException("Account is locked");
            }

            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));

            user.recordLogin();
            userRepository.save(user);

            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            var authorities = userDetails.getAuthorities().stream()
                    .map(a -> a.getAuthority())
                    .collect(Collectors.toList());

            String accessToken = tokenProvider.generateAccessToken(username, authorities);
            String refreshToken = tokenProvider.generateRefreshToken(username);

            auditLoginSuccess(user, clientIp, userAgent);

            return new LoginResponse(accessToken, refreshToken, tokenProvider.getAccessTokenExpirationMillis());

        } catch (Exception e) {
            userRepository.findByUsername(username).ifPresentOrElse(
                    u -> {
                        u.incrementFailedLoginAttempts();
                        userRepository.save(u);
                        auditLoginFailure(u, "Invalid credentials", clientIp, userAgent);
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
        String username = tokenProvider.extractUsername(refreshToken);
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        if (tokenProvider.isTokenValid(refreshToken, userDetails.getUsername())) {
            var authorities = userDetails.getAuthorities().stream()
                    .map(a -> a.getAuthority())
                    .collect(Collectors.toList());
            return tokenProvider.generateAccessToken(username, authorities);
        }
        throw new BadCredentialsException("Invalid refresh token");
    }

    private void auditLoginSuccess(User user, String clientIp, String userAgent) {
        auditService.auditWithContext(
                "Authentication",
                user.getId().toString(),
                AuditAction.LOGIN,
                user.getId().toString(),
                user.getUsername(),
                "Login successful",
                clientIp,
                userAgent
        );
    }

    private void auditLoginFailure(User user, String reason, String clientIp, String userAgent) {
        var audit = new br.org.cesjo.sgi.domain.audit.Audit(
                "Authentication",
                user.getId().toString(),
                AuditAction.LOGIN,
                user.getId().toString(),
                user.getUsername()
        );
        audit.setDescription("Login failed: " + reason);
        audit.setResult(AuditResult.ERROR);
        audit.setClientIp(clientIp);
        audit.setUserAgent(userAgent);
        audit.setErrorMessage(reason);
        // Persistir
        auditService.save(audit);
    }
}
