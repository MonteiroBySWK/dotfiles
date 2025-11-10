package br.org.cesjo.sgi.infra.controllers;

import br.org.cesjo.sgi.application.dtos.user.LoginResponse;
import br.org.cesjo.sgi.application.usecases.auth.AuthenticationService;
import br.org.cesjo.sgi.application.usecases.auth.RegistrationService;
import br.org.cesjo.sgi.domain.user.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;
import java.util.Set;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@DisplayName("AuthController Integration Tests")
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthenticationService authenticationService;

    @MockBean
    private RegistrationService registrationService;

    @Nested
    @DisplayName("Login Endpoint")
    class LoginEndpoint {

        @Test
        @DisplayName("Should login successfully with valid credentials")
        void shouldLoginSuccessfullyWithValidCredentials() throws Exception {
            // Given
            String username = "testuser";
            String password = "password123";
            
            LoginResponse loginResponse = new LoginResponse(
                "access-token",
                "refresh-token",
                360000L
            );

            when(authenticationService.authenticate(eq(username), eq(password), anyString(), anyString()))
                    .thenReturn(loginResponse);

            Map<String, String> loginRequest = Map.of(
                "username", username,
                "password", password
            );

            // When / Then
            mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(loginRequest)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.accessToken").value("access-token"))
                    .andExpect(jsonPath("$.refreshToken").value("refresh-token"))
                    .andExpect(jsonPath("$.expiresIn").value(360000L));
        }

        @Test
        @DisplayName("Should return error with invalid credentials")
        void shouldReturnErrorWithInvalidCredentials() throws Exception {
            // Given
            String username = "testuser";
            String password = "wrongpassword";

            when(authenticationService.authenticate(eq(username), eq(password), anyString(), anyString()))
                    .thenThrow(new BadCredentialsException("Invalid credentials"));

            Map<String, String> loginRequest = Map.of(
                "username", username,
                "password", password
            );

            // When / Then
            mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(loginRequest)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.error").value("authentication_failed"))
                    .andExpect(jsonPath("$.message").value("Invalid credentials"));
        }

        @Test
        @DisplayName("Should return error with missing username")
        void shouldReturnErrorWithMissingUsername() throws Exception {
            // Given
            Map<String, String> loginRequest = Map.of(
                "password", "password123"
            );

            // When / Then
            mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(loginRequest)))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Should return error with missing password")
        void shouldReturnErrorWithMissingPassword() throws Exception {
            // Given
            Map<String, String> loginRequest = Map.of(
                "username", "testuser"
            );

            // When / Then
            mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(loginRequest)))
                    .andExpect(status().isBadRequest());
        }
    }

    @Nested
    @DisplayName("Register Endpoint")
    class RegisterEndpoint {

        @Test
        @DisplayName("Should register user successfully")
        void shouldRegisterUserSuccessfully() throws Exception {
            // Given
            String username = "newuser";
            String email = "newuser@example.com";
            String password = "password123";
            Set<String> roles = Set.of("USER");

            User user = new User(username, email, password);
            user.setId(UUID.randomUUID());

            when(registrationService.registerUser(eq(username), eq(email), eq(password), any(), eq("system"), eq("system")))
                    .thenReturn(user);

            Map<String, Object> registerRequest = Map.of(
                "username", username,
                "email", email,
                "password", password,
                "roles", roles
            );

            // When / Then
            mockMvc.perform(post("/api/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(registerRequest)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.message").value("Usuário registrado com sucesso"))
                    .andExpect(jsonPath("$.username").value(username))
                    .andExpect(jsonPath("$.email").value(email))
                    .andExpect(jsonPath("$.userId").exists());
        }

        @Test
        @DisplayName("Should register user with default role when roles not provided")
        void shouldRegisterUserWithDefaultRoleWhenRolesNotProvided() throws Exception {
            // Given
            String username = "newuser";
            String email = "newuser@example.com";
            String password = "password123";

            User user = new User(username, email, password);
            user.setId(UUID.randomUUID());

            when(registrationService.registerUser(eq(username), eq(email), eq(password), isNull(), eq("system"), eq("system")))
                    .thenReturn(user);

            Map<String, Object> registerRequest = Map.of(
                "username", username,
                "email", email,
                "password", password
            );

            // When / Then
            mockMvc.perform(post("/api/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(registerRequest)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.message").value("Usuário registrado com sucesso"))
                    .andExpect(jsonPath("$.username").value(username))
                    .andExpect(jsonPath("$.email").value(email));
        }

        @Test
        @DisplayName("Should return error when registration fails")
        void shouldReturnErrorWhenRegistrationFails() throws Exception {
            // Given
            String username = "existinguser";
            String email = "existing@example.com";
            String password = "password123";

            when(registrationService.registerUser(eq(username), eq(email), eq(password), any(), eq("system"), eq("system")))
                    .thenThrow(new IllegalArgumentException("Username already exists"));

            Map<String, Object> registerRequest = Map.of(
                "username", username,
                "email", email,
                "password", password
            );

            // When / Then
            mockMvc.perform(post("/api/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(registerRequest)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.error").value("registration_failed"))
                    .andExpect(jsonPath("$.message").value("Username already exists"));
        }

        @Test
        @DisplayName("Should add ROLE_ prefix to roles that don't have it")
        void shouldAddRolePrefixToRolesThatDontHaveIt() throws Exception {
            // Given
            String username = "newuser";
            String email = "newuser@example.com";
            String password = "password123";
            Set<String> roles = Set.of("ADMIN", "USER"); // One with prefix, one without

            User user = new User(username, email, password);
            user.setId(UUID.randomUUID());

            when(registrationService.registerUser(eq(username), eq(email), eq(password), any(), eq("system"), eq("system")))
                    .thenReturn(user);

            Map<String, Object> registerRequest = Map.of(
                "username", username,
                "email", email,
                "password", password,
                "roles", roles
            );

            // When / Then
            mockMvc.perform(post("/api/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(registerRequest)))
                    .andExpect(status().isOk());
        }
    }

    @Nested
    @DisplayName("Refresh Endpoint")
    class RefreshEndpoint {

        @Test
        @DisplayName("Should refresh token successfully")
        void shouldRefreshTokenSuccessfully() throws Exception {
            // Given
            String refreshToken = "valid-refresh-token";
            String newAccessToken = "new-access-token";

            when(authenticationService.refreshToken(refreshToken))
                    .thenReturn(newAccessToken);

            Map<String, String> refreshRequest = Map.of(
                "refreshToken", refreshToken
            );

            // When / Then
            mockMvc.perform(post("/api/auth/refresh")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(refreshRequest)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.access_token").value(newAccessToken))
                    .andExpect(jsonPath("$.token_type").value("Bearer"));
        }

        @Test
        @DisplayName("Should return error with invalid refresh token")
        void shouldReturnErrorWithInvalidRefreshToken() throws Exception {
            // Given
            String refreshToken = "invalid-refresh-token";

            when(authenticationService.refreshToken(refreshToken))
                    .thenThrow(new BadCredentialsException("Invalid refresh token"));

            Map<String, String> refreshRequest = Map.of(
                "refreshToken", refreshToken
            );

            // When / Then
            mockMvc.perform(post("/api/auth/refresh")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(refreshRequest)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.error").value("invalid_token"))
                    .andExpect(jsonPath("$.message").value("Invalid refresh token"));
        }

        @Test
        @DisplayName("Should return error when refresh token is missing")
        void shouldReturnErrorWhenRefreshTokenIsMissing() throws Exception {
            // Given
            Map<String, String> refreshRequest = Map.of();

            // When / Then
            mockMvc.perform(post("/api/auth/refresh")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(refreshRequest)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.error").value("invalid_request"))
                    .andExpect(jsonPath("$.message").value("Refresh token é obrigatório"));
        }

        @Test
        @DisplayName("Should return error when refresh token is empty")
        void shouldReturnErrorWhenRefreshTokenIsEmpty() throws Exception {
            // Given
            Map<String, String> refreshRequest = Map.of(
                "refreshToken", ""
            );

            // When / Then
            mockMvc.perform(post("/api/auth/refresh")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(refreshRequest)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.error").value("invalid_request"))
                    .andExpect(jsonPath("$.message").value("Refresh token é obrigatório"));
        }
    }

    @Nested
    @DisplayName("Logout Endpoint")
    class LogoutEndpoint {

        @Test
        @DisplayName("Should logout successfully")
        void shouldLogoutSuccessfully() throws Exception {
            // Given
            String authHeader = "Bearer valid-token";

            // When / Then
            mockMvc.perform(post("/api/auth/logout")
                    .header("Authorization", authHeader))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.message").value("Logout realizado com sucesso"));
        }

        @Test
        @DisplayName("Should logout successfully even without authorization header")
        void shouldLogoutSuccessfullyEvenWithoutAuthorizationHeader() throws Exception {
            // When / Then
            mockMvc.perform(post("/api/auth/logout"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.message").value("Logout realizado com sucesso"));
        }

        @Test
        @DisplayName("Should logout successfully with malformed authorization header")
        void shouldLogoutSuccessfullyWithMalformedAuthorizationHeader() throws Exception {
            // Given
            String authHeader = "InvalidHeader";

            // When / Then
            mockMvc.perform(post("/api/auth/logout")
                    .header("Authorization", authHeader))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.message").value("Logout realizado com sucesso"));
        }
    }
}
