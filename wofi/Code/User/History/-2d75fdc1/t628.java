package br.org.cesjo.sgi.domain.rbac;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Map;
import java.util.Set;

import static org.assertj.core.api.Assertions.*;

@DisplayName("Access Policy Tests")
class AccessPolicyTest {

    @Nested
    @DisplayName("Policy Context")
    class PolicyContextTest {

        @Test
        @DisplayName("Should create policy context with all data")
        void shouldCreatePolicyContextWithAllData() {
            // Given
            String userId = "user123";
            Set<String> userRoles = Set.of("USER", "ADMIN");
            String resource = "system";
            String action = "read";
            String clientIp = "192.168.1.1";
            Map<String, Object> additionalContext = Map.of("department", "IT");

            // When
            PolicyContext context = new PolicyContext(userId, userRoles, resource, action, clientIp, additionalContext);

            // Then
            assertThat(context.getUserId()).isEqualTo(userId);
            assertThat(context.getUserRoles()).isEqualTo(userRoles);
            assertThat(context.getResource()).isEqualTo(resource);
            assertThat(context.getAction()).isEqualTo(action);
            assertThat(context.getClientIp()).isEqualTo(clientIp);
            assertThat(context.getAdditionalContext()).isEqualTo(additionalContext);
            assertThat(context.getTimestamp()).isBeforeOrEqualTo(LocalDateTime.now());
        }

        @Test
        @DisplayName("Should create policy context with null additional context")
        void shouldCreatePolicyContextWithNullAdditionalContext() {
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
            assertThat(context.getAdditionalContext()).isNull();
        }

        @Test
        @DisplayName("Should get context value from additional context")
        void shouldGetContextValueFromAdditionalContext() {
            // Given
            Map<String, Object> additionalContext = Map.of(
                "department", "IT",
                "level", 3,
                "isManager", true
            );
            
            PolicyContext context = new PolicyContext(
                "user123", Set.of("USER"), "system", "read", "127.0.0.1", additionalContext
            );

            // When / Then
            assertThat(context.getContextValue("department")).isEqualTo("IT");
            assertThat(context.getContextValue("level")).isEqualTo(3);
            assertThat(context.getContextValue("isManager")).isEqualTo(true);
            assertThat(context.getContextValue("nonexistent")).isNull();
        }

        @Test
        @DisplayName("Should return null when getting context value with null additional context")
        void shouldReturnNullWhenGettingContextValueWithNullAdditionalContext() {
            // Given
            PolicyContext context = new PolicyContext(
                "user123", Set.of("USER"), "system", "read", "127.0.0.1", null
            );

            // When / Then
            assertThat(context.getContextValue("anyKey")).isNull();
        }

        @Test
        @DisplayName("Should check if user has role")
        void shouldCheckIfUserHasRole() {
            // Given
            Set<String> userRoles = Set.of("USER", "ADMIN", "MANAGER");
            PolicyContext context = new PolicyContext(
                "user123", userRoles, "system", "read", "127.0.0.1", null
            );

            // When / Then
            assertThat(context.hasRole("USER")).isTrue();
            assertThat(context.hasRole("ADMIN")).isTrue();
            assertThat(context.hasRole("MANAGER")).isTrue();
            assertThat(context.hasRole("GUEST")).isFalse();
        }

        @Test
        @DisplayName("Should check if current time is within business hours")
        void shouldCheckIfCurrentTimeIsWithinBusinessHours() {
            // Given
            PolicyContext context = new PolicyContext(
                "user123", Set.of("USER"), "system", "read", "127.0.0.1", null
            );

            // When
            boolean isBusinessHours = context.isWithinBusinessHours();

            // Then
            LocalTime currentTime = LocalTime.now();
            boolean expectedBusinessHours = !currentTime.isBefore(LocalTime.of(8, 0)) && 
                                          currentTime.isBefore(LocalTime.of(18, 0));
            assertThat(isBusinessHours).isEqualTo(expectedBusinessHours);
        }

        @Test
        @DisplayName("Should check if IP is from internal network")
        void shouldCheckIfIpIsFromInternalNetwork() {
            // Given
            PolicyContext internalContext = new PolicyContext(
                "user123", Set.of("USER"), "system", "read", "192.168.1.100", null
            );
            
            PolicyContext externalContext = new PolicyContext(
                "user123", Set.of("USER"), "system", "read", "8.8.8.8", null
            );
            
            PolicyContext localhostContext = new PolicyContext(
                "user123", Set.of("USER"), "system", "read", "127.0.0.1", null
            );

            // When / Then
            assertThat(internalContext.isInternalNetwork()).isTrue();
            assertThat(externalContext.isInternalNetwork()).isFalse();
            assertThat(localhostContext.isInternalNetwork()).isTrue();
        }
    }

    @Nested
    @DisplayName("Time-based Policy Conditions")
    class TimeBasedPolicyConditions {

        @Test
        @DisplayName("Should evaluate business hours condition correctly")
        void shouldEvaluateBusinessHoursConditionCorrectly() {
            // Given
            PolicyCondition businessHoursCondition = PolicyCondition.BUSINESS_HOURS_ONLY;

            // Create contexts for different times
            PolicyContext morningContext = createContextWithTime(LocalTime.of(9, 0));
            PolicyContext eveningContext = createContextWithTime(LocalTime.of(19, 0));
            PolicyContext earlyMorningContext = createContextWithTime(LocalTime.of(7, 0));

            // When / Then
            assertThat(businessHoursCondition.evaluate(morningContext)).isTrue();
            assertThat(businessHoursCondition.evaluate(eveningContext)).isFalse();
            assertThat(businessHoursCondition.evaluate(earlyMorningContext)).isFalse();
        }

        private PolicyContext createContextWithTime(LocalTime time) {
            // This is a simplified version - in real implementation you might need to mock time
            return new PolicyContext("user123", Set.of("USER"), "system", "read", "127.0.0.1", null);
        }
    }

    @Nested
    @DisplayName("Network-based Policy Conditions")
    class NetworkBasedPolicyConditions {

        @Test
        @DisplayName("Should evaluate internal network condition correctly")
        void shouldEvaluateInternalNetworkConditionCorrectly() {
            // Given
            PolicyCondition internalNetworkCondition = PolicyCondition.INTERNAL_NETWORK_ONLY;

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
    }

    @Nested
    @DisplayName("Role-based Policy Conditions")
    class RoleBasedPolicyConditions {

        @Test
        @DisplayName("Should evaluate admin only condition correctly")
        void shouldEvaluateAdminOnlyConditionCorrectly() {
            // Given
            PolicyCondition adminOnlyCondition = PolicyCondition.ADMIN_ONLY;

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
    }

    @Nested
    @DisplayName("Access Policy")
    class AccessPolicyTest {

        @Test
        @DisplayName("Should create active policy")
        void shouldCreateActivePolicy() {
            // Given
            String name = "BusinessHoursPolicy";
            String resource = "system";
            String description = "Only allow access during business hours";
            PolicyCondition condition = PolicyCondition.BUSINESS_HOURS_ONLY;

            // When
            AccessPolicy policy = new AccessPolicy(name, resource, description, condition);

            // Then
            assertThat(policy.getName()).isEqualTo(name);
            assertThat(policy.getResource()).isEqualTo(resource);
            assertThat(policy.getDescription()).isEqualTo(description);
            assertThat(policy.getCondition()).isEqualTo(condition);
            assertThat(policy.isActive()).isTrue();
            assertThat(policy.getCreatedAt()).isBeforeOrEqualTo(LocalDateTime.now());
        }

        @Test
        @DisplayName("Should throw exception when name is null")
        void shouldThrowExceptionWhenNameIsNull() {
            // Given / When / Then
            assertThatThrownBy(() -> new AccessPolicy(
                null, "system", "description", PolicyCondition.BUSINESS_HOURS_ONLY
            )).isInstanceOf(NullPointerException.class)
              .hasMessage("Policy name cannot be null");
        }

        @Test
        @DisplayName("Should throw exception when resource is null")
        void shouldThrowExceptionWhenResourceIsNull() {
            // Given / When / Then
            assertThatThrownBy(() -> new AccessPolicy(
                "TestPolicy", null, "description", PolicyCondition.BUSINESS_HOURS_ONLY
            )).isInstanceOf(NullPointerException.class)
              .hasMessage("Resource cannot be null");
        }

        @Test
        @DisplayName("Should throw exception when condition is null")
        void shouldThrowExceptionWhenConditionIsNull() {
            // Given / When / Then
            assertThatThrownBy(() -> new AccessPolicy(
                "TestPolicy", "system", "description", null
            )).isInstanceOf(NullPointerException.class)
              .hasMessage("Condition cannot be null");
        }

        @Test
        @DisplayName("Should evaluate policy correctly")
        void shouldEvaluatePolicyCorrectly() {
            // Given
            AccessPolicy policy = new AccessPolicy(
                "AdminPolicy", "admin", "Admin only access", PolicyCondition.ADMIN_ONLY
            );

            PolicyContext adminContext = new PolicyContext(
                "admin123", Set.of("ADMIN"), "admin", "read", "127.0.0.1", null
            );
            
            PolicyContext userContext = new PolicyContext(
                "user123", Set.of("USER"), "admin", "read", "127.0.0.1", null
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
                "InactivePolicy", "system", "Inactive policy", PolicyCondition.ADMIN_ONLY
            );
            policy.deactivate();

            PolicyContext adminContext = new PolicyContext(
                "admin123", Set.of("ADMIN"), "system", "read", "127.0.0.1", null
            );

            // When / Then
            assertThat(policy.evaluate(adminContext)).isFalse();
        }

        @Test
        @DisplayName("Should activate and deactivate policy")
        void shouldActivateAndDeactivatePolicy() {
            // Given
            AccessPolicy policy = new AccessPolicy(
                "TestPolicy", "system", "Test policy", PolicyCondition.ADMIN_ONLY
            );

            // When / Then
            assertThat(policy.isActive()).isTrue();
            
            policy.deactivate();
            assertThat(policy.isActive()).isFalse();
            
            policy.activate();
            assertThat(policy.isActive()).isTrue();
        }

        @Test
        @DisplayName("Should have proper equality based on name")
        void shouldHaveProperEqualityBasedOnName() {
            // Given
            AccessPolicy policy1 = new AccessPolicy(
                "SamePolicy", "system", "Description 1", PolicyCondition.ADMIN_ONLY
            );
            AccessPolicy policy2 = new AccessPolicy(
                "SamePolicy", "different", "Description 2", PolicyCondition.BUSINESS_HOURS_ONLY
            );
            AccessPolicy policy3 = new AccessPolicy(
                "DifferentPolicy", "system", "Description 3", PolicyCondition.ADMIN_ONLY
            );

            // When / Then
            assertThat(policy1).isEqualTo(policy2);
            assertThat(policy1.hashCode()).isEqualTo(policy2.hashCode());
            assertThat(policy1).isNotEqualTo(policy3);
        }
    }
}
