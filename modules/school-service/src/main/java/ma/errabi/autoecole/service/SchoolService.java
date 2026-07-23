package ma.errabi.autoecole.service;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.errabi.autoecole.domain.School;
import ma.errabi.autoecole.service.feign.DocumentFeignClient;
import ma.errabi.sdk.dto.SchoolDto;
import ma.errabi.autoecole.mapper.SchoolMapper;
import ma.errabi.autoecole.repository.SchoolRepository;
import ma.errabi.sdk.exception.BusinessException;
import ma.errabi.sdk.exception.ResourceNotFoundException;
import org.jspecify.annotations.NullMarked;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Base64;

@Slf4j
@Service
@NullMarked
@RequiredArgsConstructor
public class SchoolService {

    private final SchoolRepository schoolRepository;
    private final SchoolMapper mapper;
    private final DocumentFeignClient documentFeignClient;


    @Transactional
    public SchoolDto createNewSchool(SchoolDto request) {
        log.info("Creating new School: {}", request);

        schoolRepository.findByEmail(request.email())
                .ifPresent(s -> {
                    throw new BusinessException("School already exists with email: " + request.email());
                });

        var savedSchool = schoolRepository.save(mapper.toEntity(request));
        return mapper.toDto(savedSchool);
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "school", key = "#email")
    public SchoolDto getSchoolByEmail(String email) {
        log.info("Get School details by email: {}", email);

        var schoolEntity = schoolRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("School not found with email: " + email));

        var schoolDto = mapper.toDto(schoolEntity);
        return setSchoolLogo(schoolDto);
    }

    @CircuitBreaker(name = "documentService", fallbackMethod = "fallbackResponse")
    public SchoolDto setSchoolLogo(SchoolDto schoolDto) {
        try {
            log.info("Get School logo for school id: {}", schoolDto.id());

            var schoolLogo = documentFeignClient.getDocument(schoolDto.id().toString());
            var encodedLogo = Base64.getEncoder().encodeToString(schoolLogo.getBody());

            log.info("School logo loaded successfully");
            return schoolDto.withLogo(encodedLogo);

        }catch (Exception ex){
             log.error("Failed to fetch school logo", ex);
             return schoolDto;
        }

    }

    public School getSchoolById(Long schoolId) {
        return schoolRepository.findById(schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("School not found with id: " + schoolId));
    }

}
