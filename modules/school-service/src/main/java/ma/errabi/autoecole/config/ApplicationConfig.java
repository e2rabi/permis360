package ma.errabi.autoecole.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

/**
 * Main application configuration class that imports other configurations.
 */
@Configuration
@Import( {OpenApiConfig.class,KeycloakConfig.class,CacheConfig.class})
public class ApplicationConfig {
}
