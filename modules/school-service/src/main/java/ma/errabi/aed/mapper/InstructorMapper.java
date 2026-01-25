package ma.errabi.aed.mapper;

import ma.errabi.dtos.InstructorDTO;
import ma.errabi.aed.domain.Instructor;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface InstructorMapper {
    InstructorDTO toDTO(Instructor instructor);
    Instructor toEntity(InstructorDTO instructorDTO);
}
