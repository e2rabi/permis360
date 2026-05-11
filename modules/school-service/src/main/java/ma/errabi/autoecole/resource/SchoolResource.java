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
    public ResponseEntity<SchoolDTO> createSchool(@RequestBody @Valid SchoolDTO request) {
        log.info("Received request to create new School: {}", request);
        SchoolDTO newSchool = schoolService.createNewSchool(request);
        log.debug("Created School with id={}", newSchool.id());
        return ResponseEntity.status(HttpStatus.CREATED).body(newSchool);
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
