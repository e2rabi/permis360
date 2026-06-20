package ma.errabi.autoecole.service;

import ma.errabi.autoecole.domain.School;
import ma.errabi.autoecole.domain.Student;
import ma.errabi.autoecole.mapper.StudentMapper;
import ma.errabi.autoecole.repository.SchoolRepository;
import ma.errabi.autoecole.repository.StudentRepository;
import ma.errabi.sdk.dto.StudentDto;
import ma.errabi.sdk.exception.ResourceNotFoundException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private SchoolRepository schoolRepository;

    @Mock
    private StudentMapper studentMapper;

    @InjectMocks
    private StudentService studentService;

    @Test
    @DisplayName("Should successfully save a student when the school exists")
    void saveStudent_WhenSchoolExists_ShouldSaveAndReturnStudentDto() {
        // Arrange
        Long schoolId = 1L;
        StudentDto inputDto =  new StudentDto();
        StudentDto outputDto = new StudentDto();
        
        School school = new School();
        Student studentEntity = new Student();
        Student savedStudentEntity = new Student();
        
        when(schoolRepository.findById(schoolId)).thenReturn(Optional.of(school));
        when(studentMapper.toEntity(inputDto)).thenReturn(studentEntity);
        when(studentRepository.save(studentEntity)).thenReturn(savedStudentEntity);
        when(studentMapper.toDto(savedStudentEntity)).thenReturn(outputDto);

        // Act
        StudentDto result = studentService.saveStudent(inputDto, schoolId);

        // Assert
        assertNotNull(result);
        assertEquals(outputDto, result);
        
        verify(schoolRepository).findById(schoolId);
        verify(studentMapper).toEntity(inputDto);
        verify(studentRepository).save(studentEntity);
        verify(studentMapper).toDto(savedStudentEntity);
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when school does not exist")
    void saveStudent_WhenSchoolDoesNotExist_ShouldThrowException() {
        // Arrange
        Long schoolId = 99L;
        StudentDto inputDto = new StudentDto();
        
        when(schoolRepository.findById(schoolId)).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, 
                () -> studentService.saveStudent(inputDto, schoolId));
                
        assertEquals("School not found with ID: " + schoolId, exception.getMessage());
        
        verify(schoolRepository).findById(schoolId);
        verify(studentRepository, never()).save(any(Student.class));
    }

    @Test
    @DisplayName("Should return student DTO when student is found by user ID")
    void getStudentByUserId_WhenStudentExists_ShouldReturnStudentDto() {
        // Arrange
        String userId = "user-123";
        Student studentEntity = new Student();
        StudentDto expectedDto = new StudentDto();
        
        when(studentRepository.getStudentsByUserId(userId)).thenReturn(Optional.of(studentEntity));
        when(studentMapper.toDto(studentEntity)).thenReturn(expectedDto);

        // Act
        StudentDto result = studentService.getStudentByUserId(userId);

        // Assert
        assertNotNull(result);
        assertEquals(expectedDto, result);
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when student is not found by user ID")
    void getStudentByUserId_WhenStudentDoesNotExist_ShouldThrowException() {
        // Arrange
        String userId = "unknown-user";
        
        when(studentRepository.getStudentsByUserId(userId)).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, 
                () -> studentService.getStudentByUserId(userId));
                
        assertEquals("Student not found with userId: " + userId, exception.getMessage());
        verify(studentMapper, never()).toDto(any(Student.class));
    }
}