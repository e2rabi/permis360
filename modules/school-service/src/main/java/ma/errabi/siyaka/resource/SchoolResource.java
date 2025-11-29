package ma.errabi.siyaka.resource;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.errabi.dtos.SchoolDTO;
import ma.errabi.siyaka.resource.openapi.SchoolOpenApi;
import ma.errabi.siyaka.service.SchoolService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/schools")
@Tag(name = "Schools", description = "APIs for managing schools")
public class SchoolResource implements SchoolOpenApi {
    private final SchoolService schoolService;


    @Override
    @PostMapping
    public ResponseEntity<SchoolDTO> createSchool(@RequestBody @Valid SchoolDTO schoolDTO) {
        log.info("Received request to create School: {}", schoolDTO);
        SchoolDTO savedSchool = schoolService.saveSchool(schoolDTO);
        log.debug("Created School with id={}", savedSchool.id());
        return ResponseEntity.ok(savedSchool);
    }
}
