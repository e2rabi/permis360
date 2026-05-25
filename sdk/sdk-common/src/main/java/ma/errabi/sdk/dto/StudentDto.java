package ma.errabi.sdk.dto;

import ma.errabi.sdk.types.StudentStatus;

import java.time.LocalDate;

public record StudentDto(
    String firstName,
    String lastName,
    String phone,
    String cin,
    LocalDate registrationDate,
    Double totalAmount,
    Double paidAmount,
    StudentStatus status
) {
    public String fullName(){
        return firstName + " " + lastName;
    }
}
