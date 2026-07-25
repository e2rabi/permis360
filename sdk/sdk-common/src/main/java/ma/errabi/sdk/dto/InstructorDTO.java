package ma.errabi.sdk.dto;


import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import ma.errabi.sdk.types.InstructorAvailability;
import ma.errabi.sdk.types.LicenseType;

public record InstructorDTO(
        Long id,

        @NotEmpty(message = "name cannot be empty")
        @Schema(description = "name of the instructor", example = "Errabi Ayoub")
        String name,

        @NotEmpty(message = "email cannot be empty")
        @Schema(description = "Phone number of the instructor")
        String phone,

        @NotEmpty(message = "cin cannot be empty")
        @Schema(description = "cin of the instructor", example = "N564789")
        String cin,

        @NotEmpty(message = "authorizationNumber cannot be empty")
        @Schema(description = "authorization number of the instructor", example = "N564789")
        String authorizationNumber,

        @NotNull(message = "licenseTypes cannot be null")
        @Schema(description = "license types of the instructor", example = "A1")
        LicenseType licenseTypes,

        @NotNull(message = "availability cannot be null")
        @Schema(description = "availability of the instructor", example = "AVAILABLE")
        InstructorAvailability availability,

        @NotNull(message = "schoolId cannot be null")
        @Schema(description = "ID of the school", example = "1")
        Long schoolId
) {
}