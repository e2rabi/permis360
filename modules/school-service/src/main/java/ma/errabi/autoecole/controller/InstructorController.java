package ma.errabi.autoecole.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.errabi.autoecole.service.InstructorService;
import ma.errabi.sdk.dto.InstructorDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/instructors")
@RequiredArgsConstructor
public class InstructorController {
    private final InstructorService instructorService;

    @GetMapping
    public ResponseEntity<Page<InstructorDTO>> getAllInstructors(Pageable pageable) {
        log.info("Received request to get all instructors with pagination: {}", pageable);
        return ResponseEntity.ok(instructorService.getAllInstructors(pageable));
    }
    @PostMapping
    public ResponseEntity<InstructorDTO> createInstructor(@RequestBody InstructorDTO instructorDTO) {
        log.info("Received request to create instructor: {}", instructorDTO);
        return ResponseEntity.ok(instructorService.createInstructor(instructorDTO));
    }
}
