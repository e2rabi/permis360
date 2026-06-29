package ma.errabi.appointment.service.feign;


import ma.errabi.sdk.dto.StudentDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "school-service",url = "${api-core.school-service.url}")
public interface StudentServiceClient {

     @GetMapping("/students/{userId}")
     ResponseEntity<StudentDto> getStudentDetails(@PathVariable String userId);
}
