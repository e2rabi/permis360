package ma.errabi.appointment.config;

import ma.errabi.document.config.OpenApiConfig;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration
@Import( {OpenApiConfig.class})
public class ApplicationConfig {
}
