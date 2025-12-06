package ma.errabi.siyaka.resource;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.errabi.dtos.SchoolDTO;
import ma.errabi.siyaka.resource.openapi.SchoolOpenApi;
import ma.errabi.siyaka.service.SchoolService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        return ResponseEntity.status(HttpStatus.CREATED).body(schoolDTO);
    }
    @Override
    @GetMapping("/{email}")
    public ResponseEntity<SchoolDTO> getSchoolByEmail(@PathVariable String email) {
        log.info("Received request to fetch School by email: {}", email);
        SchoolDTO schoolDTO = schoolService.getSchoolByEmail(email);
        log.debug("Fetched School: {}", schoolDTO);
        return ResponseEntity.ok(schoolDTO);
    }
}
