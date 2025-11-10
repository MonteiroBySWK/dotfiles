package br.org.cesjo.sgi.infra.security;

import br.org.cesjo.sgi.domain.user.User;
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
                    var roleAuthority = new SimpleGrantedAuthority("ROLE_" + role.getName());
                    var permissionAuthorities = role.getPermissions().stream()
                            .map(permission -> new SimpleGrantedAuthority(permission.getFullPermission()));
                    return java.util.stream.Stream.concat(
                            java.util.stream.Stream.of(roleAuthority),
                            permissionAuthorities
                    );
                })
                .collect(Collectors.toList());
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

    public static AuthorizationDetails fromAuthentication(org.springframework.security.core.Authentication authentication) {
        Object principal = authentication.getPrincipal();
        String userId = null;
        String username = authentication.getName();
        Set<String> roles = authentication.getAuthorities().stream()
                .map(a -> a.getAuthority())
                .collect(java.util.stream.Collectors.toSet());

        if (principal instanceof AuthorizationDetails ad) {
            var u = ad.getUser();
            if (u != null) {
                userId = u.getId() != null ? u.getId().toString() : null;
                username = u.getUsername();
                roles = u.getRoleNames();
            }
        }
        return new AuthorizationDetails(new User(userId, username, roles));
    }
}
