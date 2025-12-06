package ma.errabi.dtos;

import ma.errabi.types.StudentStatus;

import java.time.LocalDate;
import java.util.UUID;

public record StudentDTO(
    UUID id,
    String firstName,
    String lastName,
    String phone,
    String cin,
    LocalDate registrationDate,
    Double totalAmount,
    Double paidAmount,
    StudentStatus status
) {}
