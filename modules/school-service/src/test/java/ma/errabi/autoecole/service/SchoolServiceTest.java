package ma.errabi.autoecole.service;

import ma.errabi.autoecole.domain.School;
import ma.errabi.autoecole.mapper.SchoolMapper;
import ma.errabi.autoecole.repository.SchoolRepository;
import ma.errabi.autoecole.service.feign.DocumentFeignClient;
import ma.errabi.sdk.dto.SchoolDto;
import ma.errabi.sdk.exception.BusinessException;
import ma.errabi.sdk.exception.ResourceNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

import static ma.errabi.autoecole.stub.SchoolDtoTestData.getSchoolDto;
import static ma.errabi.autoecole.stub.SchoolDtoTestData.getSchoolWithoutLogo;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SchoolServiceTest {

    @Mock
    private SchoolRepository schoolRepository;

    @Mock
    private SchoolMapper mapper;

    @Mock
    private DocumentFeignClient documentFeignClient;

    @InjectMocks
    private SchoolService schoolService;

    @Test
    void createNewSchool_shouldCreateNewSchool() {
        // Given
        SchoolDto schoolDto = getSchoolDto();
        when(schoolRepository.findByEmail(schoolDto.email())).thenReturn(Optional.empty());
        when(mapper.toEntity(schoolDto)).thenReturn(null);
        when(schoolRepository.save(null)).thenReturn(null);
        when(mapper.toDto(null)).thenReturn(schoolDto);

        // When
        SchoolDto result = schoolService.createNewSchool(schoolDto);

        // Then
        assertNotNull(result);
        assertEquals(schoolDto, result);
    }

    @Test
    void createNewSchool_shouldThrowBusinessException_whenSchoolExists() {
        // Given
        SchoolDto schoolDto = getSchoolDto();
        when(schoolRepository.findByEmail(schoolDto.email())).thenReturn(Optional.of(new School()));

        // When & Then
        assertThrows(BusinessException.class, () -> schoolService.createNewSchool(schoolDto));
    }

    @Test
    void getSchoolByEmail_shouldReturnSchool() {
        // Given
        String email = "test@test.com";
        SchoolDto schoolDto = getSchoolDto();
        when(schoolRepository.findByEmail(email)).thenReturn(Optional.of(new School()));
        when(mapper.toDto(any())).thenReturn(schoolDto);
        when(documentFeignClient.getDocument(schoolDto.id().toString())).thenReturn(ResponseEntity.ok(new byte[0]));

        // When
        SchoolDto result = schoolService.getSchoolByEmail(email);

        // Then
        assertNotNull(result);
    }

    @Test
    void getSchoolByEmail_shouldThrowResourceNotFoundException_whenSchoolNotFound() {
        // Given
        String email = "test@test.com";
        when(schoolRepository.findByEmail(email)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(ResourceNotFoundException.class, () -> schoolService.getSchoolByEmail(email));
    }

    @Test
    void setSchoolLogo_shouldSetLogo() {
        // Given
        SchoolDto schoolDto = getSchoolDto();
        byte[] logo = "logo".getBytes();
        when(documentFeignClient.getDocument(schoolDto.id().toString())).thenReturn(ResponseEntity.ok(logo));

        // When
        SchoolDto result = schoolService.setSchoolLogo(schoolDto);

        // Then
        assertNotNull(result);
        assertNotNull(result.logo());
    }

    @Test
    void setSchoolLogo_shouldReturnDtoWithoutLogo_whenFeignClientFails() {
        // Given
        SchoolDto schoolDto = getSchoolWithoutLogo();
        when(documentFeignClient.getDocument(schoolDto.id().toString())).thenThrow(new RuntimeException());

        // When
        SchoolDto result = schoolService.setSchoolLogo(schoolDto);

        // Then
        assertNotNull(result);
        assertNull(result.logo());
    }
}
