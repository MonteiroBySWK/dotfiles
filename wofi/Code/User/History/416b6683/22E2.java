package br.org.cesjo.sgi.domain.user;

import br.org.cesjo.sgi.domain.rbac.Permission;
import br.org.cesjo.sgi.domain.rbac.Role;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.*;

@DisplayName("User Domain Tests")
class UserTest {

    @Nested
    @DisplayName("User Creation")
    class UserCreation {

        @Test
        @DisplayName("Should create user with valid data")
        void shouldCreateUserWithValidData() {
            // Given
            String username = "testuser";
            String email = "test@example.com";
            String password = "password123";

            // When
            User user = new User(username, email, password);

            // Then
            assertThat(user.getUsername()).isEqualTo(username);
            assertThat(user.getEmail()).isEqualTo(email);
            assertThat(user.getPassword()).isEqualTo(password);
            assertThat(user.isActive()).isTrue();
            assertThat(user.isLocked()).isFalse();
            assertThat(user.getFailedLoginAttempts()).isZero();
            assertThat(user.getCreatedAt()).isBeforeOrEqualTo(LocalDateTime.now());
            assertThat(user.getRoles()).isEmpty();
        }

        @Test
        @DisplayName("Should throw exception when username is null")
        void shouldThrowExceptionWhenUsernameIsNull() {
            // Given / When / Then
            assertThatThrownBy(() -> new User(null, "test@example.com", "password"))
                    .isInstanceOf(NullPointerException.class)
                    .hasMessage("Username cannot be null");
        }

        @Test
        @DisplayName("Should throw exception when email is null")
        void shouldThrowExceptionWhenEmailIsNull() {
            // Given / When / Then
            assertThatThrownBy(() -> new User("testuser", null, "password"))
                    .isInstanceOf(NullPointerException.class)
                    .hasMessage("Email cannot be null");
        }

        @Test
        @DisplayName("Should throw exception when password is null")
        void shouldThrowExceptionWhenPasswordIsNull() {
            // Given / When / Then
            assertThatThrownBy(() -> new User("testuser", "test@example.com", null))
                    .isInstanceOf(NullPointerException.class)
                    .hasMessage("Password cannot be null");
        }
    }

    @Nested
    @DisplayName("Role Management")
    class RoleManagement {

        @Test
        @DisplayName("Should add role to user")
        void shouldAddRoleToUser() {
            // Given
            User user = new User("testuser", "test@example.com", "password");
            Role role = new Role("USER", "Basic user role");

            // When
            user.addRole(role);

            // Then
            assertThat(user.getRoles()).hasSize(1);
            assertThat(user.hasRole("USER")).isTrue();
            assertThat(user.getRoleNames()).contains("USER");
        }

        @Test
        @DisplayName("Should remove role from user")
        void shouldRemoveRoleFromUser() {
            // Given
            User user = new User("testuser", "test@example.com", "password");
            Role role = new Role("USER", "Basic user role");
            user.addRole(role);

            // When
            user.removeRole(role);

            // Then
            assertThat(user.getRoles()).isEmpty();
            assertThat(user.hasRole("USER")).isFalse();
        }

        @Test
        @DisplayName("Should check user permissions through roles")
        void shouldCheckUserPermissionsThroughRoles() {
            // Given
            User user = new User("testuser", "test@example.com", "password");
            
            Permission permission = new Permission("user_read", "user", "read", "Read user data");
            Role role = new Role("USER", "Basic user role");
            role.addPermission(permission);
            
            user.addRole(role);

            // When / Then
            assertThat(user.hasPermission("user", "read")).isTrue();
            assertThat(user.hasPermission("user", "write")).isFalse();
        }

        @Test
        @DisplayName("Should throw exception when adding null role")
        void shouldThrowExceptionWhenAddingNullRole() {
            // Given
            User user = new User("testuser", "test@example.com", "password");

            // When / Then
            assertThatThrownBy(() -> user.addRole(null))
                    .isInstanceOf(NullPointerException.class)
                    .hasMessage("Role cannot be null");
        }
    }

    @Nested
    @DisplayName("Failed Login Attempts")
    class FailedLoginAttempts {

        @Test
        @DisplayName("Should increment failed login attempts")
        void shouldIncrementFailedLoginAttempts() {
            // Given
            User user = new User("testuser", "test@example.com", "password");

            // When
            user.incrementFailedLoginAttempts();

            // Then
            assertThat(user.getFailedLoginAttempts()).isEqualTo(1);
            assertThat(user.isLocked()).isFalse();
        }

        @Test
        @DisplayName("Should lock user after 5 failed attempts")
        void shouldLockUserAfterFiveFailedAttempts() {
            // Given
            User user = new User("testuser", "test@example.com", "password");

            // When
            for (int i = 0; i < 5; i++) {
                user.incrementFailedLoginAttempts();
            }

            // Then
            assertThat(user.getFailedLoginAttempts()).isEqualTo(5);
            assertThat(user.isLocked()).isTrue();
        }

        @Test
        @DisplayName("Should reset failed login attempts")
        void shouldResetFailedLoginAttempts() {
            // Given
            User user = new User("testuser", "test@example.com", "password");
            user.incrementFailedLoginAttempts();
            user.incrementFailedLoginAttempts();

            // When
            user.resetFailedLoginAttempts();

            // Then
            assertThat(user.getFailedLoginAttempts()).isZero();
        }

        @Test
        @DisplayName("Should record successful login")
        void shouldRecordSuccessfulLogin() {
            // Given
            User user = new User("testuser", "test@example.com", "password");
            user.incrementFailedLoginAttempts();
            LocalDateTime beforeLogin = LocalDateTime.now().minusSeconds(1);

            // When
            user.recordLogin();

            // Then
            assertThat(user.getLastLogin()).isAfter(beforeLogin);
            assertThat(user.getFailedLoginAttempts()).isZero();
        }
    }

    @Nested
    @DisplayName("User Equality")
    class UserEquality {

        @Test
        @DisplayName("Should be equal when id and username are same")
        void shouldBeEqualWhenIdAndUsernameAreSame() {
            // Given
            User user1 = new User("testuser", "test1@example.com", "password1");
            User user2 = new User("testuser", "test2@example.com", "password2");
            
            // When / Then
            assertThat(user1).isEqualTo(user2);
            assertThat(user1.hashCode()).isEqualTo(user2.hashCode());
        }

        @Test
        @DisplayName("Should not be equal when username is different")
        void shouldNotBeEqualWhenUsernameIsDifferent() {
            // Given
            User user1 = new User("testuser1", "test@example.com", "password");
            User user2 = new User("testuser2", "test@example.com", "password");

            // When / Then
            assertThat(user1).isNotEqualTo(user2);
        }
    }
}
