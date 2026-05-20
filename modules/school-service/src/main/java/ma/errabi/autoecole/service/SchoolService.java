package ma.errabi.autoecole.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.errabi.autoecole.service.feign.DocumentFeignClient;
import ma.errabi.sdk.dto.SchoolDto;
import ma.errabi.autoecole.mapper.SchoolMapper;
import ma.errabi.autoecole.repository.SchoolRepository;
import ma.errabi.sdk.exception.BusinessException;
import ma.errabi.sdk.exception.ResourceNotFoundException;
import org.jspecify.annotations.NullMarked;
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

    /**
     * Creates a new School entity
     * @param request request the {@link SchoolDto} containing the School data to create
     * @return the created {@link SchoolDto} object
     * @throws BusinessException if a School with the same email already exists
     */
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
    public SchoolDto getSchoolByEmail(String email) {
        log.info("Fetching School by email: {}", email);

        var schoolEntity = schoolRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("School not found with email: " + email));

        var schoolDto = mapper.toDto(schoolEntity);
        return setSchoolLogo(schoolDto);
    }

    private SchoolDto setSchoolLogo(SchoolDto schoolDto) {
        log.info("Fetching School logo for id: {}", schoolDto.id());

        var schoolLogo = documentFeignClient.getDocument(schoolDto.id().toString());
        var encodedLogo = Base64.getEncoder().encodeToString(schoolLogo.getBody());
        return schoolDto.withLogo(encodedLogo);
    }
}
