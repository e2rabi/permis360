package ma.errabi.autoecole.service;

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
     * @param studentDto student data to save
     * @param schoolId   the ID of the School to associate with the Student
     * @return the saved Student data
     * @throws ResourceNotFoundException if no School is found with the given ID
     */
    @Transactional
    public StudentDto saveStudent(StudentDto studentDto, Long schoolId) {
        log.info("Saving Student: {} schoolId={}", studentDto, schoolId);
        var school = schoolRepository.findById(schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("School not found with ID: " + schoolId));
        var newStudent = studentMapper.toEntity(studentDto);
        newStudent.setSchool(school);

        var savedStudent = studentRepository.save(newStudent);
        log.debug("Saved Student with id={}", savedStudent.getId());
        return studentMapper.toDto(savedStudent);
    }


    @Transactional(readOnly = true)
    public StudentDto getStudentByUserId(String userId){
       log.info("Get Student details by userId: {}", userId);
       return studentRepository.getStudentsByUserId(userId)
                .map(studentMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with userId: " + userId));
    }

}
