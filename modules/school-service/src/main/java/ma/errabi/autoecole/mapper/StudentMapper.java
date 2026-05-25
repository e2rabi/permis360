package ma.errabi.autoecole.mapper;

import ma.errabi.sdk.dto.StudentDto;
import ma.errabi.autoecole.domain.Student;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface StudentMapper {
    Student toEntity(StudentDto student);
    StudentDto toDto(Student student);
}
