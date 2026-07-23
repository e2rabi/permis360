package ma.errabi.autoecole.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.errabi.autoecole.domain.Instructor;
import ma.errabi.autoecole.mapper.InstructorMapper;
import ma.errabi.autoecole.repository.InstructorRepository;
import ma.errabi.sdk.dto.InstructorDTO;
import ma.errabi.sdk.exception.ResourceNotFoundException;
import org.jspecify.annotations.NullMarked;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@NullMarked
@RequiredArgsConstructor
public class InstructorService {

    private final InstructorRepository repository;
    private final InstructorMapper mapper;
    private final SchoolService schoolService;


    /**
     * Returns a paginated list of instructors.
     *
     * @param pageable pagination information
     * @return a page of instructor DTOs
     */
    @Transactional(readOnly = true)
    public Page<InstructorDTO> getAllInstructors(Pageable pageable) {
        log.info("Fetching all instructors");
        return repository.findAll(pageable)
                .map(mapper::toDTO);
    }

    /**
     * Creates a new instructor and assigns it to the specified school.
     *
     * @param dto the instructor data
     * @return the created instructor
     * @throws ResourceNotFoundException if the specified school does not exist
     */
    @Transactional
    public InstructorDTO createInstructor(InstructorDTO dto) {
        log.info("Creating instructor");

        Instructor instructor = mapper.toEntity(dto);
        instructor.setSchool(schoolService.getSchoolById(dto.schoolId()));

        return mapper.toDTO(repository.save(instructor));
    }

}
