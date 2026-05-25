package ma.errabi.autoecole;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@EnableFeignClients
@SpringBootApplication(scanBasePackages = "ma.errabi")
public class SchoolApplication  {
	public static void main(String[] args) {
		SpringApplication.run(SchoolApplication.class, args);
	}
}
