package ma.errabi.document.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.OAuthFlow;
import io.swagger.v3.oas.models.security.OAuthFlows;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

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
                        .title("Document Service API")
                        .version("v1")
                        .description("OpenAPI documentation for the Document Service"));
    }
    private SecurityScheme createOAuthScheme() {
        return new SecurityScheme()
                .type(SecurityScheme.Type.OAUTH2)
                .flows(new OAuthFlows()
                        .clientCredentials(new OAuthFlow()
                                .tokenUrl(keycloakAuthServerUrl.concat("/protocol/openid-connect/token"))));
    }
}

