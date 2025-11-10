package br.org.cesjo.sgi.domain.rbac;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.assertj.core.api.Assertions.*;

@DisplayName("Role Domain Tests")
class RoleTest {

    @Nested
    @DisplayName("Role Creation")
    class RoleCreation {

        @Test
        @DisplayName("Should create role with name and description")
        void shouldCreateRoleWithNameAndDescription() {
            // Given
            String name = "ADMIN";
            String description = "Administrator role";

            // When
            Role role = new Role(name, description);

            // Then
            assertThat(role.getName()).isEqualTo(name);
            assertThat(role.getDescription()).isEqualTo(description);
            assertThat(role.getPermissions()).isEmpty();
        }

        @Test
        @DisplayName("Should create role with permissions")
        void shouldCreateRoleWithPermissions() {
            // Given
            String name = "USER";
            String description = "User role";
            Permission permission1 = new Permission("user_read", "user", "read", "Read users");
            Permission permission2 = new Permission("user_write", "user", "write", "Write users");
            Set<Permission> permissions = Set.of(permission1, permission2);

            // When
            Role role = new Role(name, description, permissions);

            // Then
            assertThat(role.getName()).isEqualTo(name);
            assertThat(role.getDescription()).isEqualTo(description);
            assertThat(role.getPermissions()).hasSize(2);
            assertThat(role.getPermissions()).contains(permission1, permission2);
        }

        @Test
        @DisplayName("Should throw exception when name is null")
        void shouldThrowExceptionWhenNameIsNull() {
            // Given / When / Then
            assertThatThrownBy(() -> new Role(null, "description"))
                    .isInstanceOf(NullPointerException.class)
                    .hasMessage("Role name cannot be null");
        }

        @Test
        @DisplayName("Should create role with null permissions set")
        void shouldCreateRoleWithNullPermissionsSet() {
            // Given
            String name = "TEST";
            String description = "Test role";

            // When
            Role role = new Role(name, description, null);

            // Then
            assertThat(role.getPermissions()).isEmpty();
        }
    }

    @Nested
    @DisplayName("Permission Management")
    class PermissionManagement {

        @Test
        @DisplayName("Should add permission to role")
        void shouldAddPermissionToRole() {
            // Given
            Role role = new Role("USER", "User role");
            Permission permission = new Permission("user_read", "user", "read", "Read users");

            // When
            role.addPermission(permission);

            // Then
            assertThat(role.getPermissions()).hasSize(1);
            assertThat(role.hasPermission(permission)).isTrue();
            assertThat(role.hasPermission("user", "read")).isTrue();
        }

        @Test
        @DisplayName("Should remove permission from role")
        void shouldRemovePermissionFromRole() {
            // Given
            Role role = new Role("USER", "User role");
            Permission permission = new Permission("user_read", "user", "read", "Read users");
            role.addPermission(permission);

            // When
            role.removePermission(permission);

            // Then
            assertThat(role.getPermissions()).isEmpty();
            assertThat(role.hasPermission(permission)).isFalse();
            assertThat(role.hasPermission("user", "read")).isFalse();
        }

        @Test
        @DisplayName("Should check if role has specific permission")
        void shouldCheckIfRoleHasSpecificPermission() {
            // Given
            Role role = new Role("USER", "User role");
            Permission readPermission = new Permission("user_read", "user", "read", "Read users");
            role.addPermission(readPermission);

            // When / Then
            assertThat(role.hasPermission("user", "read")).isTrue();
            assertThat(role.hasPermission("user", "write")).isFalse();
            assertThat(role.hasPermission("system", "read")).isFalse();
        }

        @Test
        @DisplayName("Should throw exception when adding null permission")
        void shouldThrowExceptionWhenAddingNullPermission() {
            // Given
            Role role = new Role("USER", "User role");

            // When / Then
            assertThatThrownBy(() -> role.addPermission(null))
                    .isInstanceOf(NullPointerException.class)
                    .hasMessage("Permission cannot be null");
        }

        @Test
        @DisplayName("Should not modify original permissions set")
        void shouldNotModifyOriginalPermissionsSet() {
            // Given
            Permission permission = new Permission("user_read", "user", "read", "Read users");
            Set<Permission> originalPermissions = Set.of(permission);
            Role role = new Role("USER", "User role", originalPermissions);

            // When
            Set<Permission> retrievedPermissions = role.getPermissions();

            // Then
            assertThatThrownBy(() -> retrievedPermissions.clear())
                    .isInstanceOf(UnsupportedOperationException.class);
        }
    }

    @Nested
    @DisplayName("Role Equality")
    class RoleEquality {

        @Test
        @DisplayName("Should be equal when names are same")
        void shouldBeEqualWhenNamesAreSame() {
            // Given
            Role role1 = new Role("ADMIN", "Administrator");
            Role role2 = new Role("ADMIN", "Different description");

            // When / Then
            assertThat(role1).isEqualTo(role2);
            assertThat(role1.hashCode()).isEqualTo(role2.hashCode());
        }

        @Test
        @DisplayName("Should not be equal when names are different")
        void shouldNotBeEqualWhenNamesAreDifferent() {
            // Given
            Role role1 = new Role("ADMIN", "Administrator");
            Role role2 = new Role("USER", "User");

            // When / Then
            assertThat(role1).isNotEqualTo(role2);
        }

        @Test
        @DisplayName("Should have proper toString")
        void shouldHaveProperToString() {
            // Given
            Role role = new Role("ADMIN", "Administrator");
            Permission permission = new Permission("system_read", "system", "read", "Read system");
            role.addPermission(permission);

            // When
            String toString = role.toString();

            // Then
            assertThat(toString).contains("ADMIN");
            assertThat(toString).contains("Administrator");
            assertThat(toString).contains("permissions=1");
        }
    }
}
