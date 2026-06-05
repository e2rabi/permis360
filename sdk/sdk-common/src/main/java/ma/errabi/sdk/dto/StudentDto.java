package ma.errabi.sdk.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import ma.errabi.sdk.types.StudentStatus;

import java.time.LocalDate;

public record StudentDto(
    Long id,
    @NotBlank
    @Schema(description = "Firstname of the student", example = "firstname")
    String firstName,
    @NotBlank
    @Schema(description = "Lastname of the student", example = "lastname")
    String lastName,
    @NotBlank
    @Schema(description = "Phone of the student", example = "+212600000000")
    String phone,
    @Size(max = 8)
    @NotBlank
    @Schema(description = "Cin of the student", example = "N564789")
    String cin,
    @Schema(description = "Registration date of the student", example = "2023-01-01")
    LocalDate registrationDate,
    Double totalAmount,
    Double paidAmount,
    StudentStatus status,
    @NotBlank
    @Schema(description = "User id of the student", example = "134545")
    String userId,
    @Schema(description = "Email of the student", example = "email@errabi.com")
    String email
) {
    public String fullName(){
        return firstName + " " + lastName;
    }
}
