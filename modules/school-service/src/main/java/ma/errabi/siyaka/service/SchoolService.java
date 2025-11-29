package ma.errabi.siyaka.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.errabi.dtos.SchoolDTO;
import ma.errabi.siyaka.mapper.SchoolMapper;
import ma.errabi.siyaka.repository.SchoolRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class SchoolService {

    private final SchoolRepository schoolRepository;
    private final SchoolMapper schoolMapper;

    @Transactional
    public SchoolDTO saveSchool(SchoolDTO schoolDTO) {
        log.info("Saving School: {}", schoolDTO);
        var savedEntity = schoolRepository.save(schoolMapper.toEntity(schoolDTO));
        var savedDto = schoolMapper.toDto(savedEntity);
        log.debug("Saved School with id={}", savedDto.id());
        return savedDto;
    }


}
