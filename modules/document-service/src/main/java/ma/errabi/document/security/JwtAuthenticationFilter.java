package ma.errabi.document.security;

import ma.errabi.sdk.exception.TechnicalException;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;

@Component
public class JwtAuthenticationFilter {

    public Converter<Jwt, AbstractAuthenticationToken> jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();

        converter.setJwtGrantedAuthoritiesConverter(jwt -> {
            Collection<GrantedAuthority> authorities = new ArrayList<>();
            Map<?, ?> resourceAccess = jwt.getClaim("resource_access");

            if (resourceAccess != null) {
                resourceAccess.values().forEach(entry -> {
                    if (entry instanceof Map) {
                        Collection<?> roles = (Collection<?>) ((Map<?, ?>) entry).get("roles");
                        if (roles != null) {
                            roles.forEach(role -> authorities.add(new SimpleGrantedAuthority("ROLE_" + role)));
                        }
                    }
                });
            }

            if (authorities.isEmpty() || !authorities.contains(new SimpleGrantedAuthority("ROLE_API-CORE"))) {
                throw new TechnicalException("Invalid role");
            }
            return authorities;
        });

        return converter;
    }
}