package ma.errabi.autoecole.service.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "document-service",url = "${api-core.document-service.url}")
public interface DocumentFeignClient {

    @GetMapping("/document")
    ResponseEntity<byte[]> getDocument(@RequestParam("filename") String filename);
}
