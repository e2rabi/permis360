package ma.errabi.document.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration
@Import( {OpenApiConfig.class,S3ClientConfig.class})
public class ApplicationConfig {
}
