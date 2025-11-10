package br.org.cesjo.sgi.infra.security;

import br.org.cesjo.sgi.domain.rbac.BaseRole;
import br.org.cesjo.sgi.domain.user.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

public class AuthorizationDetails implements UserDetails {
    private final User user;

    public AuthorizationDetails(User user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return user.getRoles().stream()
                .flatMap(role -> {
                    String roleName = role.getName();
                    if (!roleName.startsWith("ROLE_")) {
                        roleName = "ROLE_" + roleName;
                    }
                    var roleAuthority = new SimpleGrantedAuthority(roleName);
                    var permissionAuthorities = role.getPermissions().stream()
                            .map(permission -> new SimpleGrantedAuthority(permission.getFullPermission()));
                    return java.util.stream.Stream.concat(
                            java.util.stream.Stream.of(roleAuthority),
                            permissionAuthorities
                    );
                })
                .collect(Collectors.toList());
    }

    public boolean hasBaseRole(BaseRole baseRole) {
        return user.hasRole(baseRole);
    }

    @Override
    public String getPassword() {
        return this.user.getPassword();
    }

    @Override
    public String getUsername() {
        return this.user.getUsername();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !this.user.isLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return this.user.isActive();
    }

    public User getUser() {
        return user;
    }

    public static AuthorizationDetails fromAuthentication(Authentication authentication) {
        Object principal = authentication.getPrincipal();
        String userId = null;
        String password = null;
        String username = authentication.getName();
        Set<String> roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(java.util.stream.Collectors.toSet());

        if (principal instanceof AuthorizationDetails ad) {
            var u = ad.getUser();
            if (u != null) {
                userId = u.getId() != null ? u.getId().toString() : null;
                username = u.getUsername();
                roles = u.getRoleNames();
                password = u.getPassword();
            }
        }
        return new AuthorizationDetails(new User(userId, username, password));
    }
}
