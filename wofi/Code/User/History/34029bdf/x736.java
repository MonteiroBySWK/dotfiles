package br.org.cesjo.sgi.infra.security;

import br.org.cesjo.sgi.application.usecases.rbac.AccessControlService;
import br.org.cesjo.sgi.domain.rbac.PolicyContext;
import br.org.cesjo.sgi.domain.user.User;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Aspect
@Component
public class AccessControlAspect {

    private final AccessControlService accessControlService;

    public AccessControlAspect(AccessControlService accessControlService) {
        this.accessControlService = accessControlService;
    }

    @Around("@annotation(requirePermission)")
    public Object checkPermission(ProceedingJoinPoint joinPoint, RequirePermission requirePermission) throws Throwable {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Authentication required");
        }

        // Get current user details
        Object principal = authentication.getPrincipal();
        String userId = null;
        String username = null;
        Set<String> roles = Set.of();

        if (principal instanceof User user) {
            userId = user.getId();
            username = user.getUsername();
            roles = user.getRoleNames();
        } else if (principal instanceof org.springframework.security.core.userdetails.User userDetails) {
            username = userDetails.getUsername();
            roles = userDetails.getAuthorities().stream()
                    .map(auth -> auth.getAuthority())
                    .collect(java.util.stream.Collectors.toSet());
        }

        // Get request context
        String clientIp = getClientIp();
        
        // Create policy context
        PolicyContext context = new PolicyContext(
            userId,
            roles,
            requirePermission.resource(),
            requirePermission.action(),
            clientIp,
            Map.of()
        );

        // Check access
        boolean hasAccess = accessControlService.hasAccess(
            userId,
            username,
            requirePermission.resource(),
            requirePermission.action(),
            context
        );

        if (!hasAccess) {
            throw new AccessDeniedException(
                "Access denied for resource: " + requirePermission.resource() + 
                " action: " + requirePermission.action()
            );
        }

        return joinPoint.proceed();
    }

    private String getClientIp() {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();
            String xForwardedFor = request.getHeader("X-Forwarded-For");
            if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
                return xForwardedFor.split(",")[0].trim();
            }
            return request.getRemoteAddr();
        }
        return "unknown";
    }
}
