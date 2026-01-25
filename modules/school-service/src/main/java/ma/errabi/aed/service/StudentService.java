package ma.errabi.aed.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.errabi.dtos.StudentDTO;
import ma.errabi.aed.mapper.StudentMapper;
import ma.errabi.aed.repository.SchoolRepository;
import ma.errabi.aed.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class StudentService {
    private final StudentRepository studentRepository;
    private final SchoolRepository schoolRepository;
    private final StudentMapper studentMapper;

    @Transactional
    public StudentDTO saveStudent(StudentDTO studentDTO, UUID schoolId) {
        log.info("Saving Student: {} schoolId={}", studentDTO, schoolId);
        var school = schoolRepository.findById(schoolId)
                .orElseThrow(() -> new EntityNotFoundException("School not found with ID: " + schoolId));

        var entity = studentMapper.toEntity(studentDTO);
        entity.setSchool(school);
        var createdStudent = studentRepository.save(entity);
        log.debug("Saved Student with id={}", createdStudent.getId());
        return studentMapper.toDto(createdStudent);
    }


}
