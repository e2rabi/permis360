package ma.errabi.dtos;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import ma.errabi.types.SchoolStatus;
import io.swagger.v3.oas.annotations.media.Schema;

public record SchoolDTO(
        @JsonIgnore
        Long id,
        @Schema(description = "Name of the school", example = "Demo school")
        @NotBlank String name,
        @Schema(description = "Address of the school", example = "Sidi maarouf , Casablanca Morocco")
        @NotBlank String address,
        @Schema(description = "Email of the school", example = "<EMAIL>")
        @Email @NotBlank String email,
        @Schema(description = "Website of the school", example = "https://www.demo.ma")
        @Size(max = 255) String website,
        @Schema(description = "Logo of the school", example = "https://www.demo.ma/logo.png")
        String logo,
        @Size(max = 1000)
        @Schema(description = "Description of the school", example = "Demo school is a school for demo purpose")
        String description,
        @Schema(description = "Facebook page of the school", example = "https://www.facebook.com/demo.school")
        String facebook,
        @Schema(description = "Instagram page of the school", example = "https://www.instagram.com/demo.school")
        String instagram,
        @Schema(description = "Status of the school", example = "OPEN")
        @NotNull SchoolStatus status,
        @Schema(description = "Geographical location of the school")
        @Valid GeoLocationDTO geoLocation,
        @Schema(description = "Primary phone number of the school", example = "+212600000000")
        String primaryPhoneNumber,
        @Schema(description = "Secondary phone number of the school", example = "+212600000001")
        String secondaryPhoneNumber
) {
}