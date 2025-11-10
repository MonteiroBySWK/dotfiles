package br.org.cesjo.sgi.application.usecases.auth;

import br.org.cesjo.sgi.application.dtos.user.LoginResponse;
import br.org.cesjo.sgi.application.usecases.audit.AuditService;
import br.org.cesjo.sgi.domain.audit.AuditAction;
import br.org.cesjo.sgi.domain.user.User;
import br.org.cesjo.sgi.domain.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthenticationService Tests")
class AuthenticationServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserDetailsService userDetailsService;

    @Mock
    private AuditService auditService;

    @Mock
    private TokenProvider tokenProvider;

    @Mock
    private UserDetails userDetails;

    private AuthenticationService authenticationService;

    @BeforeEach
    void setUp() {
        authenticationService = new AuthenticationService(
                userRepository,
                authenticationManager,
                userDetailsService,
                auditService,
                tokenProvider
        );
    }

    @Nested
    @DisplayName("Successful Authentication")
    class SuccessfulAuthentication {

        @Test
        @DisplayName("Should authenticate user successfully")
        void shouldAuthenticateUserSuccessfully() {
            // Given
            String username = "testuser";
            String password = "password123";
            String clientIp = "192.168.1.1";
            String userAgent = "Mozilla/5.0";
            
            User user = new User(username, "test@example.com", password);
            user.setActive(true);
            user.setLocked(false);

            String accessToken = "access-token";
            String refreshToken = "refresh-token";
            long expirationMillis = 360000L;

            when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
            when(userDetailsService.loadUserByUsername(username)).thenReturn(userDetails);
            when(userDetails.getAuthorities()).thenReturn(Collections.emptyList());
            when(tokenProvider.generateAccessToken(eq(username), any())).thenReturn(accessToken);
            when(tokenProvider.generateRefreshToken(username)).thenReturn(refreshToken);
            when(tokenProvider.getAccessTokenExpirationMillis()).thenReturn(expirationMillis);

            // When
            LoginResponse response = authenticationService.authenticate(username, password, clientIp, userAgent);

            // Then
            assertThat(response.accessToken()).isEqualTo(accessToken);
            assertThat(response.refreshToken()).isEqualTo(refreshToken);
            assertThat(response.expiresIn()).isEqualTo(expirationMillis);

            verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
            verify(auditService).auditWithContext(
                    eq("Authentication"),
                    any(),
                    eq(AuditAction.LOGIN),
                    any(),
                    eq(username),
                    eq("Login successful"),
                    eq(clientIp),
                    eq(userAgent)
            );
        }

        @Test
        @DisplayName("Should record login in user")
        void shouldRecordLoginInUser() {
            // Given
            String username = "testuser";
            String password = "password123";
            
            User user = spy(new User(username, "test@example.com", password));
            user.setActive(true);
            user.setLocked(false);

            when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
            when(userDetailsService.loadUserByUsername(username)).thenReturn(userDetails);
            when(userDetails.getAuthorities()).thenReturn(Collections.emptyList());
            when(tokenProvider.generateAccessToken(any(), any())).thenReturn("token");
            when(tokenProvider.generateRefreshToken(any())).thenReturn("refresh");
            when(tokenProvider.getAccessTokenExpirationMillis()).thenReturn(360000L);

            // When
            authenticationService.authenticate(username, password, "127.0.0.1", "test-agent");

            // Then
            verify(user).recordLogin();
        }
    }

    @Nested
    @DisplayName("Failed Authentication")
    class FailedAuthentication {

        @Test
        @DisplayName("Should throw exception when user not found")
        void shouldThrowExceptionWhenUserNotFound() {
            // Given
            String username = "nonexistent";
            String password = "password123";

            when(userRepository.findByUsername(username)).thenReturn(Optional.empty());

            // When / Then
            assertThatThrownBy(() -> 
                authenticationService.authenticate(username, password, "127.0.0.1", "test-agent")
            ).isInstanceOf(BadCredentialsException.class)
             .hasMessage("Invalid credentials");

            verify(auditService).auditWithContext(
                    eq("Authentication"),
                    eq(username),
                    eq(AuditAction.LOGIN),
                    isNull(),
                    eq(username),
                    eq("Login failed - user not found"),
                    eq("127.0.0.1"),
                    eq("test-agent")
            );
        }

        @Test
        @DisplayName("Should throw exception when user is inactive")
        void shouldThrowExceptionWhenUserIsInactive() {
            // Given
            String username = "testuser";
            String password = "password123";
            String clientIp = "192.168.1.1";
            String userAgent = "Mozilla/5.0";
            
            User user = new User(username, "test@example.com", password);
            user.setActive(false);

            when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));

            // When / Then
            assertThatThrownBy(() -> 
                authenticationService.authenticate(username, password, clientIp, userAgent)
            ).isInstanceOf(BadCredentialsException.class)
             .hasMessage("Account is inactive");

            verify(auditService).auditWithContext(
                    eq("Authentication"),
                    any(),
                    eq(AuditAction.LOGIN),
                    any(),
                    eq(username),
                    eq("Login failed: Account is inactive"),
                    eq(clientIp),
                    eq(userAgent)
            );
        }

        @Test
        @DisplayName("Should throw exception when user is locked")
        void shouldThrowExceptionWhenUserIsLocked() {
            // Given
            String username = "testuser";
            String password = "password123";
            String clientIp = "192.168.1.1";
            String userAgent = "Mozilla/5.0";
            
            User user = new User(username, "test@example.com", password);
            user.setActive(true);
            user.setLocked(true);

            when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));

            // When / Then
            assertThatThrownBy(() -> 
                authenticationService.authenticate(username, password, clientIp, userAgent)
            ).isInstanceOf(BadCredentialsException.class)
             .hasMessage("Account is locked");

            verify(auditService).auditWithContext(
                    eq("Authentication"),
                    any(),
                    eq(AuditAction.LOGIN),
                    any(),
                    eq(username),
                    eq("Login failed: Account is locked"),
                    eq(clientIp),
                    eq(userAgent)
            );
        }

        @Test
        @DisplayName("Should increment failed login attempts on authentication failure")
        void shouldIncrementFailedLoginAttemptsOnAuthenticationFailure() {
            // Given
            String username = "testuser";
            String password = "wrongpassword";
            
            User user = spy(new User(username, "test@example.com", "correctpassword"));
            user.setActive(true);
            user.setLocked(false);

            when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
            when(authenticationManager.authenticate(any())).thenThrow(new BadCredentialsException("Bad credentials"));

            // When / Then
            assertThatThrownBy(() -> 
                authenticationService.authenticate(username, password, "127.0.0.1", "test-agent")
            ).isInstanceOf(BadCredentialsException.class);

            verify(user).incrementFailedLoginAttempts();
            verify(userRepository).save(user);
            verify(auditService).auditWithContext(
                    eq("Authentication"),
                    any(),
                    eq(AuditAction.LOGIN),
                    any(),
                    eq(username),
                    eq("Login failed: Invalid credentials"),
                    eq("127.0.0.1"),
                    eq("test-agent")
            );
        }
    }

    @Nested
    @DisplayName("Token Refresh")
    class TokenRefresh {

        @Test
        @DisplayName("Should refresh token successfully")
        void shouldRefreshTokenSuccessfully() {
            // Given
            String refreshToken = "valid-refresh-token";
            String username = "testuser";
            String newAccessToken = "new-access-token";

            when(tokenProvider.extractUsername(refreshToken)).thenReturn(username);
            when(userDetailsService.loadUserByUsername(username)).thenReturn(userDetails);
            when(userDetails.getUsername()).thenReturn(username);
            when(userDetails.getAuthorities()).thenReturn(Collections.emptyList());
            when(tokenProvider.isTokenValid(refreshToken, username)).thenReturn(true);
            when(tokenProvider.generateAccessToken(eq(username), any())).thenReturn(newAccessToken);

            // When
            String result = authenticationService.refreshToken(refreshToken);

            // Then
            assertThat(result).isEqualTo(newAccessToken);
            verify(tokenProvider).generateAccessToken(eq(username), anyList());
        }

        @Test
        @DisplayName("Should throw exception when refresh token is invalid")
        void shouldThrowExceptionWhenRefreshTokenIsInvalid() {
            // Given
            String refreshToken = "invalid-refresh-token";
            String username = "testuser";

            when(tokenProvider.extractUsername(refreshToken)).thenReturn(username);
            when(userDetailsService.loadUserByUsername(username)).thenReturn(userDetails);
            when(userDetails.getUsername()).thenReturn(username);
            when(tokenProvider.isTokenValid(refreshToken, username)).thenReturn(false);

            // When / Then
            assertThatThrownBy(() -> authenticationService.refreshToken(refreshToken))
                    .isInstanceOf(BadCredentialsException.class)
                    .hasMessage("Invalid refresh token");
        }
    }

    @Nested
    @DisplayName("Constructor Validation")
    class ConstructorValidation {

        @Test
        @DisplayName("Should throw exception when userRepository is null")
        void shouldThrowExceptionWhenUserRepositoryIsNull() {
            assertThatThrownBy(() -> new AuthenticationService(
                    null,
                    authenticationManager,
                    userDetailsService,
                    auditService,
                    tokenProvider
            )).isInstanceOf(NullPointerException.class);
        }

        @Test
        @DisplayName("Should throw exception when authenticationManager is null")
        void shouldThrowExceptionWhenAuthenticationManagerIsNull() {
            assertThatThrownBy(() -> new AuthenticationService(
                    userRepository,
                    null,
                    userDetailsService,
                    auditService,
                    tokenProvider
            )).isInstanceOf(NullPointerException.class);
        }

        @Test
        @DisplayName("Should throw exception when userDetailsService is null")
        void shouldThrowExceptionWhenUserDetailsServiceIsNull() {
            assertThatThrownBy(() -> new AuthenticationService(
                    userRepository,
                    authenticationManager,
                    null,
                    auditService,
                    tokenProvider
            )).isInstanceOf(NullPointerException.class);
        }

        @Test
        @DisplayName("Should throw exception when auditService is null")
        void shouldThrowExceptionWhenAuditServiceIsNull() {
            assertThatThrownBy(() -> new AuthenticationService(
                    userRepository,
                    authenticationManager,
                    userDetailsService,
                    null,
                    tokenProvider
            )).isInstanceOf(NullPointerException.class);
        }

        @Test
        @DisplayName("Should throw exception when tokenProvider is null")
        void shouldThrowExceptionWhenTokenProviderIsNull() {
            assertThatThrownBy(() -> new AuthenticationService(
                    userRepository,
                    authenticationManager,
                    userDetailsService,
                    auditService,
                    null
            )).isInstanceOf(NullPointerException.class);
        }
    }
}
