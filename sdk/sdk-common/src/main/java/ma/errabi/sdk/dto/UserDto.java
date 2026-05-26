package ma.errabi.sdk.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.jspecify.annotations.NullMarked;


@NullMarked
public record UserDto(
        @NotBlank
        @Schema(description = "userName", example = "UserName")
        String username,
        @Email
        @NotBlank
        @Schema(description = "email", example = "email@email.com")
        String email,
        @NotBlank
        @Schema(description = "firstName", example = "firstName")
        String firstName,
        @NotBlank
        @Schema(description = "lastName", example = "lastName")
        String lastName,
        @NotBlank
        @Schema(description = "password", example = "password")
        String password) {

    @Override
    public String toString() {
         return "UserDto{" +
                "username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                '}';
    }
}
