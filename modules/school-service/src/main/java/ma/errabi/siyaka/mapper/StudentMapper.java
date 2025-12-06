package ma.errabi.siyaka.mapper;

import ma.errabi.dtos.StudentDTO;
import ma.errabi.siyaka.domain.Student;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface StudentMapper {
    Student toEntity(StudentDTO student);
    StudentDTO toDto(Student student);
}
