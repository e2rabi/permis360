package ma.errabi.autoecole.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.errabi.sdk.dto.SchoolDTO;
import ma.errabi.autoecole.mapper.SchoolMapper;
import ma.errabi.autoecole.repository.SchoolRepository;
import ma.errabi.sdk.exception.BusinessException;
import ma.errabi.sdk.exception.ResourceNotFoundException;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class SchoolService {

    private final SchoolRepository schoolRepository;
    private final SchoolMapper mapper;

    /**
     * Saves a School.
     *
     * @param request the School request to create
     * @return the created School object
     */
    @Transactional
    public SchoolDTO saveSchool(SchoolDTO request) {
        log.info("Start creating new School: {}", request);
        if (schoolRepository.findByEmail(request.email()).isPresent()) {
            log.error("School already exists with email: {}", request.email());
            throw new BusinessException("School already exists with email: " + request.email());
        }
        var response = mapper.toDto(schoolRepository.save(mapper.toEntity(request)));
        log.debug("Created School with id={}", response.id());
        return response;
    }

    /**
     * Fetches a School by its email.
     *
     * @param email the email of the School to fetch
     * @return the School data corresponding to the given email
     * @throws RuntimeException if no School is found with the given email
     */
    @Transactional(readOnly = true)
    public SchoolDTO getSchoolByEmail(@NonNull String email) {
        log.info("Getting School by email: {}", email);
        var schoolEntity = schoolRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("School not found with email: " + email));
        var schoolDTO = mapper.toDto(schoolEntity);
        log.debug("Found School: {}", schoolDTO);
        return schoolDTO;
    }
}
