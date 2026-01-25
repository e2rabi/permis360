package ma.errabi.autoecole.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.OAuthFlows;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import io.swagger.v3.oas.models.security.OAuthFlow;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.security.SecurityScheme.Type;

/**
 * Configuration class for OpenAPI documentation.
 */
@Configuration
public class OpenApiConfig {

    @Value("${spring.security.oauth2.client.provider.keycloak.issuer-uri}")
    private String keycloakAuthServerUrl ;
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .components(new Components()
                        .addSecuritySchemes("oauth2_client_credentials", createOAuthScheme()))
                .addSecurityItem(new SecurityRequirement().addList("oauth2_client_credentials"))
                .info(new Info()
                        .title("School Service API")
                        .version("v1")
                        .description("OpenAPI documentation for the School Service"));
    }
    private SecurityScheme createOAuthScheme() {
        return new SecurityScheme()
                .type(Type.OAUTH2)
                .flows(new OAuthFlows()
                        .clientCredentials(new OAuthFlow()
                                .tokenUrl(keycloakAuthServerUrl.concat("/protocol/openid-connect/token"))));
    }
}
