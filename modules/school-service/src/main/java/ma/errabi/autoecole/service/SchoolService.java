package ma.errabi.autoecole.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.errabi.dtos.SchoolDTO;
import ma.errabi.autoecole.mapper.SchoolMapper;
import ma.errabi.autoecole.repository.SchoolRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static java.util.Objects.requireNonNull;

@Slf4j
@Service
@RequiredArgsConstructor
public class SchoolService {

    private final SchoolRepository schoolRepository;
    private final SchoolMapper schoolMapper;

    /**
     * Saves a School.
     *
     * @param schoolDTO the School data to save
     * @return the saved School data
     */
    @Transactional
    public SchoolDTO saveSchool(SchoolDTO schoolDTO) {
        log.info("Saving School: {}", schoolDTO);
        var savedEntity = schoolRepository.save(schoolMapper.toEntity(schoolDTO));
        var savedDto = schoolMapper.toDto(savedEntity);
        log.debug("Saved School with id={}", savedDto.id());
        return savedDto;
    }

    /**
     * Fetches a School by its email.
     *
     * @param email the email of the School to fetch
     * @return the School data corresponding to the given email
     * @throws RuntimeException if no School is found with the given email
     */
    @Transactional(readOnly = true)
    public SchoolDTO getSchoolByEmail(String email) {
        requireNonNull(email, "email must not be null");
        log.info("Fetching School by email: {}", email);
        var schoolEntity = schoolRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("School not found with email: " + email));
        var schoolDTO = schoolMapper.toDto(schoolEntity);
        log.debug("Fetched School: {}", schoolDTO);
        return schoolDTO;
    }

}
