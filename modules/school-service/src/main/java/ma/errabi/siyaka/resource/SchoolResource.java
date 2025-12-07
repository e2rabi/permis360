package ma.errabi.siyaka.resource;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.errabi.dtos.SchoolDTO;
import ma.errabi.dtos.StudentDTO;
import ma.errabi.siyaka.resource.openapi.SchoolOpenApi;
import ma.errabi.siyaka.service.SchoolService;
import ma.errabi.siyaka.service.StudentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/schools")
@Tag(name = "Schools", description = "APIs for managing schools")
public class SchoolResource implements SchoolOpenApi {

    private final SchoolService schoolService;
    private final StudentService studentService;


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
    @Override
    @PostMapping("/{schoolId}/students")
    public ResponseEntity<StudentDTO> createStudent(@RequestBody @Valid StudentDTO request, @PathVariable UUID schoolId) {
        log.info("Received request to create Student: {}", request);
        StudentDTO savedStudent = studentService.saveStudent(request, schoolId);
        log.debug("Created Student with id={}", savedStudent.id());
        return ResponseEntity.status(HttpStatus.CREATED).body(savedStudent);
    }
}
