package ma.errabi.autoecole.mapper;

import ma.errabi.sdk.dto.InstructorDTO;
import ma.errabi.autoecole.domain.Instructor;
import org.mapstruct.MapMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface InstructorMapper {

    @Mapping(target = "schoolId", source = "school.id")
    InstructorDTO toDTO(Instructor instructor);
    Instructor toEntity(InstructorDTO instructorDTO);
}
