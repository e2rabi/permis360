package ma.errabi.autoecole.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.errabi.sdk.dto.StudentDto;
import ma.errabi.autoecole.mapper.StudentMapper;
import ma.errabi.autoecole.repository.SchoolRepository;
import ma.errabi.autoecole.repository.StudentRepository;
import ma.errabi.sdk.exception.ResourceNotFoundException;
import org.jspecify.annotations.NullMarked;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@NullMarked
@RequiredArgsConstructor
public class StudentService {
    private final StudentRepository studentRepository;
    private final SchoolRepository schoolRepository;
    private final StudentMapper studentMapper;

    /**
     * Saves a Student associated with a School.
     *
     * @param studentDto the Student data to save
     * @param schoolId   the ID of the School to associate with the Student
     * @return the saved Student data
     * @throws EntityNotFoundException if no School is found with the given ID
     */
    @Transactional
    public StudentDto saveStudent(StudentDto studentDto, UUID schoolId) {
        log.info("Saving Student: {} schoolId={}", studentDto, schoolId);
        var school = schoolRepository.findById(schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("School not found with ID: " + schoolId));

        var entity = studentMapper.toEntity(studentDto);
        entity.setSchool(school);
        var createdStudent = studentRepository.save(entity);
        log.debug("Saved Student with id={}", createdStudent.getId());
        return studentMapper.toDto(createdStudent);
    }


}
