package br.org.cesjo.sgi.domain.rbac;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Map;
import java.util.Set;

import static org.assertj.core.api.Assertions.*;

@DisplayName("Access Policy and Context Tests")
class AccessPolicyTest {

    @Nested
    @DisplayName("Policy Context")
    class PolicyContextTests {

        @Test
        @DisplayName("Should create policy context with all data")
        void shouldCreatePolicyContextWithAllData() {
            // Given
            String userId = "user123";
            Set<String> userRoles = Set.of("USER", "ADMIN");
            String resource = "system";
            String action = "read";
            String clientIp = "192.168.1.1";
            Map<String, Object> attributes = Map.of("department", "IT");

            // When
            PolicyContext context = new PolicyContext(userId, userRoles, resource, action, clientIp, attributes);

            // Then
            assertThat(context.getUserId()).isEqualTo(userId);
            assertThat(context.getUserRoles()).isEqualTo(userRoles);
            assertThat(context.getResource()).isEqualTo(resource);
            assertThat(context.getAction()).isEqualTo(action);
            assertThat(context.getClientIp()).isEqualTo(clientIp);
            assertThat(context.getAttributes()).isEqualTo(attributes);
            assertThat(context.getTimestamp()).isBeforeOrEqualTo(LocalDateTime.now());
        }

        @Test
        @DisplayName("Should create policy context with null attributes")
        void shouldCreatePolicyContextWithNullAttributes() {
            // Given
            String userId = "user123";
            Set<String> userRoles = Set.of("USER");
            String resource = "system";
            String action = "read";
            String clientIp = "192.168.1.1";

            // When
            PolicyContext context = new PolicyContext(userId, userRoles, resource, action, clientIp, null);

            // Then
            assertThat(context.getUserId()).isEqualTo(userId);
            assertThat(context.getAttributes()).isNull();
        }

        @Test
        @DisplayName("Should get attribute value from context")
        void shouldGetAttributeValueFromContext() {
            // Given
            Map<String, Object> attributes = Map.of(
                "department", "IT",
                "level", 3,
                "isManager", true
            );
            
            PolicyContext context = new PolicyContext(
                "user123", Set.of("USER"), "system", "read", "127.0.0.1", attributes
            );

            // When / Then
            assertThat(context.getAttribute("department")).isEqualTo("IT");
            assertThat(context.getAttribute("level")).isEqualTo(3);
            assertThat(context.getAttribute("isManager")).isEqualTo(true);
            assertThat(context.getAttribute("nonexistent")).isNull();
        }

        @Test
        @DisplayName("Should return null when getting attribute with null attributes")
        void shouldReturnNullWhenGettingAttributeWithNullAttributes() {
            // Given
            PolicyContext context = new PolicyContext(
                "user123", Set.of("USER"), "system", "read", "127.0.0.1", null
            );

            // When / Then
            assertThat(context.getAttribute("anyKey")).isNull();
        }
    }

    @Nested
    @DisplayName("Policy Conditions")
    class PolicyConditionTests {

        @Test
        @DisplayName("Should create custom time-based condition")
        void shouldCreateCustomTimeBasedCondition() {
            // Given
            PolicyCondition businessHoursCondition = context -> {
                LocalTime current = LocalTime.now();
                return !current.isBefore(LocalTime.of(8, 0)) && current.isBefore(LocalTime.of(18, 0));
            };

            PolicyContext context = new PolicyContext(
                "user123", Set.of("USER"), "system", "read", "127.0.0.1", null
            );

            // When
            boolean result = businessHoursCondition.evaluate(context);

            // Then
            LocalTime currentTime = LocalTime.now();
            boolean expectedResult = !currentTime.isBefore(LocalTime.of(8, 0)) && 
                                   currentTime.isBefore(LocalTime.of(18, 0));
            assertThat(result).isEqualTo(expectedResult);
        }

        @Test
        @DisplayName("Should create custom network-based condition")
        void shouldCreateCustomNetworkBasedCondition() {
            // Given
            PolicyCondition internalNetworkCondition = context -> {
                String ip = context.getClientIp();
                return ip != null && (ip.startsWith("192.168.") || ip.startsWith("10.") || ip.equals("127.0.0.1"));
            };

            PolicyContext internalContext = new PolicyContext(
                "user123", Set.of("USER"), "system", "read", "192.168.1.100", null
            );
            
            PolicyContext externalContext = new PolicyContext(
                "user123", Set.of("USER"), "system", "read", "8.8.8.8", null
            );

            // When / Then
            assertThat(internalNetworkCondition.evaluate(internalContext)).isTrue();
            assertThat(internalNetworkCondition.evaluate(externalContext)).isFalse();
        }

        @Test
        @DisplayName("Should create custom role-based condition")
        void shouldCreateCustomRoleBasedCondition() {
            // Given
            PolicyCondition adminOnlyCondition = context -> 
                context.getUserRoles().contains("ADMIN");

            PolicyContext adminContext = new PolicyContext(
                "admin123", Set.of("ADMIN"), "system", "admin", "127.0.0.1", null
            );
            
            PolicyContext userContext = new PolicyContext(
                "user123", Set.of("USER"), "system", "read", "127.0.0.1", null
            );

            // When / Then
            assertThat(adminOnlyCondition.evaluate(adminContext)).isTrue();
            assertThat(adminOnlyCondition.evaluate(userContext)).isFalse();
        }

        @Test
        @DisplayName("Should create custom attribute-based condition")
        void shouldCreateCustomAttributeBasedCondition() {
            // Given
            PolicyCondition departmentCondition = context -> {
                String department = (String) context.getAttribute("department");
                return "IT".equals(department) || "SECURITY".equals(department);
            };

            PolicyContext itContext = new PolicyContext(
                "user123", Set.of("USER"), "system", "read", "127.0.0.1", 
                Map.of("department", "IT")
            );
            
            PolicyContext hrContext = new PolicyContext(
                "user123", Set.of("USER"), "system", "read", "127.0.0.1", 
                Map.of("department", "HR")
            );

            // When / Then
            assertThat(departmentCondition.evaluate(itContext)).isTrue();
            assertThat(departmentCondition.evaluate(hrContext)).isFalse();
        }
    }

    @Nested
    @DisplayName("Access Policy Implementation")
    class AccessPolicyImplementationTests {

        @Test
        @DisplayName("Should create policy with all parameters")
        void shouldCreatePolicyWithAllParameters() {
            // Given
            String name = "BusinessHoursPolicy";
            String resource = "system";
            String description = "Only allow access during business hours";
            PolicyCondition condition = context -> true;
            Set<String> allowedRoles = Set.of("USER", "ADMIN");
            boolean isActive = true;

            // When
            AccessPolicy policy = new AccessPolicy(name, resource, description, condition, allowedRoles, isActive);

            // Then
            assertThat(policy.getName()).isEqualTo(name);
            assertThat(policy.getResource()).isEqualTo(resource);
            assertThat(policy.getDescription()).isEqualTo(description);
            assertThat(policy.getCondition()).isEqualTo(condition);
            assertThat(policy.getAllowedRoles()).isEqualTo(allowedRoles);
            assertThat(policy.isActive()).isTrue();
        }

        @Test
        @DisplayName("Should throw exception when name is null")
        void shouldThrowExceptionWhenNameIsNull() {
            // Given / When / Then
            assertThatThrownBy(() -> new AccessPolicy(
                null, "system", "description", context -> true, Set.of("USER"), true
            )).isInstanceOf(NullPointerException.class)
              .hasMessage("Policy name cannot be null");
        }

        @Test
        @DisplayName("Should throw exception when resource is null")
        void shouldThrowExceptionWhenResourceIsNull() {
            // Given / When / Then
            assertThatThrownBy(() -> new AccessPolicy(
                "TestPolicy", null, "description", context -> true, Set.of("USER"), true
            )).isInstanceOf(NullPointerException.class)
              .hasMessage("Resource cannot be null");
        }

        @Test
        @DisplayName("Should evaluate policy with role check and condition")
        void shouldEvaluatePolicyWithRoleCheckAndCondition() {
            // Given
            PolicyCondition alwaysTrueCondition = context -> true;
            AccessPolicy policy = new AccessPolicy(
                "TestPolicy", "system", "Test policy", alwaysTrueCondition, Set.of("ADMIN"), true
            );

            PolicyContext adminContext = new PolicyContext(
                "admin123", Set.of("ADMIN"), "system", "read", "127.0.0.1", null
            );
            
            PolicyContext userContext = new PolicyContext(
                "user123", Set.of("USER"), "system", "read", "127.0.0.1", null
            );

            // When / Then
            assertThat(policy.evaluate(adminContext)).isTrue();
            assertThat(policy.evaluate(userContext)).isFalse();
        }

        @Test
        @DisplayName("Should return false when policy is inactive")
        void shouldReturnFalseWhenPolicyIsInactive() {
            // Given
            AccessPolicy policy = new AccessPolicy(
                "InactivePolicy", "system", "Inactive policy", context -> true, Set.of("ADMIN"), false
            );

            PolicyContext adminContext = new PolicyContext(
                "admin123", Set.of("ADMIN"), "system", "read", "127.0.0.1", null
            );

            // When / Then
            assertThat(policy.evaluate(adminContext)).isFalse();
        }

        @Test
        @DisplayName("Should allow access when no roles are specified")
        void shouldAllowAccessWhenNoRolesAreSpecified() {
            // Given
            AccessPolicy policy = new AccessPolicy(
                "OpenPolicy", "public", "Open policy", context -> true, null, true
            );

            PolicyContext userContext = new PolicyContext(
                "user123", Set.of("USER"), "public", "read", "127.0.0.1", null
            );

            // When / Then
            assertThat(policy.evaluate(userContext)).isTrue();
        }

        @Test
        @DisplayName("Should allow access when empty roles are specified")
        void shouldAllowAccessWhenEmptyRolesAreSpecified() {
            // Given
            AccessPolicy policy = new AccessPolicy(
                "OpenPolicy", "public", "Open policy", context -> true, Set.of(), true
            );

            PolicyContext userContext = new PolicyContext(
                "user123", Set.of("USER"), "public", "read", "127.0.0.1", null
            );

            // When / Then
            assertThat(policy.evaluate(userContext)).isTrue();
        }

        @Test
        @DisplayName("Should deny access when condition fails")
        void shouldDenyAccessWhenConditionFails() {
            // Given
            PolicyCondition alwaysFalseCondition = context -> false;
            AccessPolicy policy = new AccessPolicy(
                "RestrictivePolicy", "system", "Always deny", alwaysFalseCondition, Set.of("ADMIN"), true
            );

            PolicyContext adminContext = new PolicyContext(
                "admin123", Set.of("ADMIN"), "system", "read", "127.0.0.1", null
            );

            // When / Then
            assertThat(policy.evaluate(adminContext)).isFalse();
        }

        @Test
        @DisplayName("Should allow access when condition is null")
        void shouldAllowAccessWhenConditionIsNull() {
            // Given
            AccessPolicy policy = new AccessPolicy(
                "SimplePolicy", "system", "Simple role-based policy", null, Set.of("ADMIN"), true
            );

            PolicyContext adminContext = new PolicyContext(
                "admin123", Set.of("ADMIN"), "system", "read", "127.0.0.1", null
            );

            // When / Then
            assertThat(policy.evaluate(adminContext)).isTrue();
        }

        @Test
        @DisplayName("Should have proper equality based on name and resource")
        void shouldHaveProperEqualityBasedOnNameAndResource() {
            // Given
            AccessPolicy policy1 = new AccessPolicy(
                "SamePolicy", "system", "Description 1", context -> true, Set.of("USER"), true
            );
            AccessPolicy policy2 = new AccessPolicy(
                "SamePolicy", "system", "Description 2", context -> false, Set.of("ADMIN"), false
            );
            AccessPolicy policy3 = new AccessPolicy(
                "DifferentPolicy", "system", "Description 3", context -> true, Set.of("USER"), true
            );
            AccessPolicy policy4 = new AccessPolicy(
                "SamePolicy", "different", "Description 4", context -> true, Set.of("USER"), true
            );

            // When / Then
            assertThat(policy1).isEqualTo(policy2);
            assertThat(policy1.hashCode()).isEqualTo(policy2.hashCode());
            assertThat(policy1).isNotEqualTo(policy3);
            assertThat(policy1).isNotEqualTo(policy4);
        }
    }

    @Nested
    @DisplayName("Integration Tests")
    class IntegrationTests {

        @Test
        @DisplayName("Should create complex business hours and role policy")
        void shouldCreateComplexBusinessHoursAndRolePolicy() {
            // Given
            PolicyCondition businessHoursCondition = context -> {
                LocalTime current = LocalTime.now();
                return !current.isBefore(LocalTime.of(8, 0)) && current.isBefore(LocalTime.of(17, 0));
            };

            AccessPolicy policy = new AccessPolicy(
                "BusinessHoursUserPolicy", 
                "sensitive_data", 
                "Allow user access to sensitive data only during business hours",
                businessHoursCondition,
                Set.of("USER", "MANAGER"),
                true
            );

            PolicyContext userContext = new PolicyContext(
                "user123", Set.of("USER"), "sensitive_data", "read", "192.168.1.100", null
            );

            PolicyContext adminContext = new PolicyContext(
                "admin123", Set.of("ADMIN"), "sensitive_data", "read", "192.168.1.100", null
            );

            // When
            boolean userAccess = policy.evaluate(userContext);
            boolean adminAccess = policy.evaluate(adminContext);

            // Then
            LocalTime current = LocalTime.now();
            boolean isBusinessHours = !current.isBefore(LocalTime.of(8, 0)) && current.isBefore(LocalTime.of(17, 0));
            
            assertThat(userAccess).isEqualTo(isBusinessHours); // User should follow business hours
            assertThat(adminAccess).isFalse(); // Admin not in allowed roles
        }

        @Test
        @DisplayName("Should create complex attribute and network based policy")
        void shouldCreateComplexAttributeAndNetworkBasedPolicy() {
            // Given
            PolicyCondition complexCondition = context -> {
                String ip = context.getClientIp();
                String department = (String) context.getAttribute("department");
                boolean isInternalNetwork = ip != null && ip.startsWith("192.168.");
                boolean isSecurityDept = "SECURITY".equals(department);
                
                return isInternalNetwork && isSecurityDept;
            };

            AccessPolicy policy = new AccessPolicy(
                "SecurityDeptInternalPolicy",
                "admin_tools",
                "Allow security department access to admin tools from internal network only",
                complexCondition,
                Set.of("SECURITY_ANALYST", "SECURITY_MANAGER"),
                true
            );

            PolicyContext validContext = new PolicyContext(
                "sec123", 
                Set.of("SECURITY_ANALYST"), 
                "admin_tools", 
                "admin", 
                "192.168.1.50",
                Map.of("department", "SECURITY")
            );

            PolicyContext invalidNetworkContext = new PolicyContext(
                "sec123",
                Set.of("SECURITY_ANALYST"),
                "admin_tools",
                "admin",
                "8.8.8.8", // External IP
                Map.of("department", "SECURITY")
            );

            PolicyContext invalidDepartmentContext = new PolicyContext(
                "user123",
                Set.of("SECURITY_ANALYST"),
                "admin_tools",
                "admin",
                "192.168.1.50",
                Map.of("department", "IT") // Wrong department
            );

            // When / Then
            assertThat(policy.evaluate(validContext)).isTrue();
            assertThat(policy.evaluate(invalidNetworkContext)).isFalse();
            assertThat(policy.evaluate(invalidDepartmentContext)).isFalse();
        }
    }
}
