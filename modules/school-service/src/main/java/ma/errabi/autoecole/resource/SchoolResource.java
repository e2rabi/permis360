package ma.errabi.autoecole.resource;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.errabi.sdk.dto.SchoolDTO;
import ma.errabi.sdk.dto.StudentDTO;
import ma.errabi.autoecole.resource.openapi.SchoolOpenApi;
import ma.errabi.autoecole.service.SchoolService;
import ma.errabi.autoecole.service.StudentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/schools")
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
        log.debug("Found School: {}", schoolDTO);
        return ResponseEntity.ok(schoolDTO);
    }
    @Override
    @PostMapping("/{schoolId}/students")
    public ResponseEntity<StudentDTO> createStudent(@RequestBody @Valid StudentDTO request, @PathVariable UUID schoolId) {
        log.info("Received request to create Student: {}", request);
        StudentDTO savedStudent = studentService.saveStudent(request, schoolId);
        log.debug("Created Student with id={}", savedStudent.fullName());
        return ResponseEntity.status(HttpStatus.CREATED).body(savedStudent);
    }
}
