package br.org.cesjo.sgi.domain.rbac;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.*;

@DisplayName("Permission Domain Tests")
class PermissionTest {

    @Nested
    @DisplayName("Permission Creation")
    class PermissionCreation {

        @Test
        @DisplayName("Should create permission with all fields")
        void shouldCreatePermissionWithAllFields() {
            // Given
            String name = "user_read";
            String resource = "user";
            String action = "read";
            String description = "Read user data";

            // When
            Permission permission = new Permission(name, resource, action, description);

            // Then
            assertThat(permission.getName()).isEqualTo(name);
            assertThat(permission.getResource()).isEqualTo(resource);
            assertThat(permission.getAction()).isEqualTo(action);
            assertThat(permission.getDescription()).isEqualTo(description);
            assertThat(permission.getFullPermission()).isEqualTo("user:read");
        }

        @Test
        @DisplayName("Should throw exception when name is null")
        void shouldThrowExceptionWhenNameIsNull() {
            // Given / When / Then
            assertThatThrownBy(() -> new Permission(null, "resource", "action", "description"))
                    .isInstanceOf(NullPointerException.class)
                    .hasMessage("Permission name cannot be null");
        }

        @Test
        @DisplayName("Should throw exception when resource is null")
        void shouldThrowExceptionWhenResourceIsNull() {
            // Given / When / Then
            assertThatThrownBy(() -> new Permission("name", null, "action", "description"))
                    .isInstanceOf(NullPointerException.class)
                    .hasMessage("Resource cannot be null");
        }

        @Test
        @DisplayName("Should throw exception when action is null")
        void shouldThrowExceptionWhenActionIsNull() {
            // Given / When / Then
            assertThatThrownBy(() -> new Permission("name", "resource", null, "description"))
                    .isInstanceOf(NullPointerException.class)
                    .hasMessage("Action cannot be null");
        }

        @Test
        @DisplayName("Should create permission with null description")
        void shouldCreatePermissionWithNullDescription() {
            // Given
            String name = "user_read";
            String resource = "user";
            String action = "read";

            // When
            Permission permission = new Permission(name, resource, action, null);

            // Then
            assertThat(permission.getName()).isEqualTo(name);
            assertThat(permission.getResource()).isEqualTo(resource);
            assertThat(permission.getAction()).isEqualTo(action);
            assertThat(permission.getDescription()).isNull();
        }
    }

    @Nested
    @DisplayName("Permission Behavior")
    class PermissionBehavior {

        @Test
        @DisplayName("Should generate correct full permission string")
        void shouldGenerateCorrectFullPermissionString() {
            // Given
            Permission permission = new Permission("system_admin", "system", "admin", "System admin");

            // When
            String fullPermission = permission.getFullPermission();

            // Then
            assertThat(fullPermission).isEqualTo("system:admin");
        }

        @Test
        @DisplayName("Should have proper toString representation")
        void shouldHaveProperToStringRepresentation() {
            // Given
            Permission permission = new Permission("user_read", "user", "read", "Read users");

            // When
            String toString = permission.toString();

            // Then
            assertThat(toString).contains("user_read");
            assertThat(toString).contains("user");
            assertThat(toString).contains("read");
        }
    }

    @Nested
    @DisplayName("Permission Equality")
    class PermissionEquality {

        @Test
        @DisplayName("Should be equal when name, resource and action are same")
        void shouldBeEqualWhenNameResourceAndActionAreSame() {
            // Given
            Permission permission1 = new Permission("user_read", "user", "read", "Description 1");
            Permission permission2 = new Permission("user_read", "user", "read", "Description 2");

            // When / Then
            assertThat(permission1).isEqualTo(permission2);
            assertThat(permission1.hashCode()).isEqualTo(permission2.hashCode());
        }

        @Test
        @DisplayName("Should not be equal when names are different")
        void shouldNotBeEqualWhenNamesAreDifferent() {
            // Given
            Permission permission1 = new Permission("user_read", "user", "read", "Description");
            Permission permission2 = new Permission("user_write", "user", "read", "Description");

            // When / Then
            assertThat(permission1).isNotEqualTo(permission2);
        }

        @Test
        @DisplayName("Should not be equal when resources are different")
        void shouldNotBeEqualWhenResourcesAreDifferent() {
            // Given
            Permission permission1 = new Permission("read", "user", "read", "Description");
            Permission permission2 = new Permission("read", "system", "read", "Description");

            // When / Then
            assertThat(permission1).isNotEqualTo(permission2);
        }

        @Test
        @DisplayName("Should not be equal when actions are different")
        void shouldNotBeEqualWhenActionsAreDifferent() {
            // Given
            Permission permission1 = new Permission("user_access", "user", "read", "Description");
            Permission permission2 = new Permission("user_access", "user", "write", "Description");

            // When / Then
            assertThat(permission1).isNotEqualTo(permission2);
        }

        @Test
        @DisplayName("Should not be equal to null")
        void shouldNotBeEqualToNull() {
            // Given
            Permission permission = new Permission("user_read", "user", "read", "Description");

            // When / Then
            assertThat(permission).isNotEqualTo(null);
        }

        @Test
        @DisplayName("Should not be equal to different type")
        void shouldNotBeEqualToDifferentType() {
            // Given
            Permission permission = new Permission("user_read", "user", "read", "Description");
            String notAPermission = "not a permission";

            // When / Then
            assertThat(permission).isNotEqualTo(notAPermission);
        }

        @Test
        @DisplayName("Should be equal to itself")
        void shouldBeEqualToItself() {
            // Given
            Permission permission = new Permission("user_read", "user", "read", "Description");

            // When / Then
            assertThat(permission).isEqualTo(permission);
        }
    }
}
