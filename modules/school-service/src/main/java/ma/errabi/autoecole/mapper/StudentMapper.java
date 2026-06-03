package ma.errabi.autoecole.mapper;

import ma.errabi.sdk.dto.StudentDto;
import ma.errabi.autoecole.domain.Student;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;


@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface StudentMapper {

    @Mapping(target = "status", expression = "java(ma.errabi.sdk.types.StudentStatus.CREATED)")
    @Mapping(target = "registrationDate", expression = "java(java.time.LocalDate.now())")
    Student toEntity(StudentDto student);

    StudentDto toDto(Student student);
}
