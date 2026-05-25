package ma.errabi.autoecole.mapper;

import ma.errabi.sdk.dto.SchoolDto;
import ma.errabi.autoecole.domain.School;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", uses = {StudentMapper.class,InstructorMapper.class},unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface SchoolMapper {
    School toEntity(SchoolDto dto);
    SchoolDto toDto(School entity);
}
