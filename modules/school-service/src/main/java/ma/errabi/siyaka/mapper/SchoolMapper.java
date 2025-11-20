package ma.errabi.siyaka.mapper;

import ma.errabi.dtos.SchoolDTO;
import ma.errabi.siyaka.domain.School;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface SchoolMapper {
    School toEntity(SchoolDTO dto);
    SchoolDTO toDto(School entity);
}
