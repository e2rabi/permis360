package ma.errabi.autoecole.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.errabi.autoecole.controller.openapi.StudentOpenApi;
import ma.errabi.autoecole.service.StudentService;
import ma.errabi.sdk.dto.StudentDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/students")
public class StudentResource implements StudentOpenApi {

    private final StudentService studentService ;


    @Override
    @GetMapping("/{userId}")
    public ResponseEntity<StudentDto> getStudentDetails(@PathVariable String userId){
        log.info("Received request to get Student details by userId: {}", userId);
        return ResponseEntity.ok(studentService.getStudentByUserId(userId));
    }
}
