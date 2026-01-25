package ma.errabi.aed.mapper;

import ma.errabi.dtos.StudentDTO;
import ma.errabi.aed.domain.Student;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface StudentMapper {
    Student toEntity(StudentDTO student);
    StudentDTO toDto(Student student);
}
