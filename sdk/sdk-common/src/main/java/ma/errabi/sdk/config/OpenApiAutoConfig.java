package ma.errabi.sdk.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.OAuthFlow;
import io.swagger.v3.oas.models.security.OAuthFlows;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.security.SecurityScheme.Type;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;

/**
 * Configuration class for OpenAPI documentation.
 */
@AutoConfiguration
@ConditionalOnMissingBean(OpenAPI.class)
public class OpenApiAutoConfig {

    @Value("${spring.security.oauth2.client.provider.keycloak.issuer-uri}")
    private String keycloakAuthServerUrl ;
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .components(new Components()
                        .addSecuritySchemes("oauth2_client_credentials", createOAuthScheme()))
                .addSecurityItem(new SecurityRequirement().addList("oauth2_client_credentials"))
                .info(new Info()
                        .title("OpenAPI Documentation ")
                        .version("v1")
                        .description("OpenAPI documentation"));
    }
    private SecurityScheme createOAuthScheme() {
        return new SecurityScheme()
                .type(Type.OAUTH2)
                .flows(new OAuthFlows()
                        .clientCredentials(new OAuthFlow()
                                .tokenUrl(keycloakAuthServerUrl.concat("/protocol/openid-connect/token"))));
    }
}
