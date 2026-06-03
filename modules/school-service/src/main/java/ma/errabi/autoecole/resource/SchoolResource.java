package ma.errabi.autoecole.resource;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.errabi.sdk.dto.SchoolDto;
import ma.errabi.sdk.dto.StudentDto;
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
    @PostMapping(version = "v1.0")
    public ResponseEntity<SchoolDto> createSchool(@RequestBody @Valid SchoolDto request) {
        log.info("Received request to create new School: {}", request);
        SchoolDto newSchool = schoolService.createNewSchool(request);
        log.debug("Created School with id={}", newSchool.id());
        return ResponseEntity.status(HttpStatus.CREATED).body(newSchool);
    }
    @Override
    @GetMapping(value = "/{email}",version = "v1.0+")
    public ResponseEntity<SchoolDto> getSchoolByEmail(@PathVariable String email) {
        log.info("Received request to get School details by email: {}", email);
        SchoolDto schoolDTO = schoolService.getSchoolByEmail(email);
        log.debug("Found School: {}", schoolDTO);
        return ResponseEntity.ok(schoolDTO);
    }
    @Override
    @PostMapping(value = "/{schoolId}/students",version = "v1.0")
    public ResponseEntity<StudentDto> createStudent(@RequestBody @Valid StudentDto request, @PathVariable Long schoolId) {
        log.info("Received request to create Student: {}", request);
        StudentDto savedStudent = studentService.saveStudent(request, schoolId);
        log.debug("Created Student with id={}", savedStudent.fullName());
        return ResponseEntity.status(HttpStatus.CREATED).body(savedStudent);
    }
}
