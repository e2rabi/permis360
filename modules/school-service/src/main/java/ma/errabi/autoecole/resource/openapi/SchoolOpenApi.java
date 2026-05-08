package ma.errabi.autoecole.resource.openapi;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import ma.errabi.sdk.dto.SchoolDTO;
import ma.errabi.sdk.dto.StudentDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.UUID;

@Tag(name = "Schools", description = "APIs for managing schools")
public interface SchoolOpenApi {

    @Operation(summary = "Create a School", description = "Creates a new school and returns the created SchoolDTO")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "School created",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = SchoolDTO.class))),
            @ApiResponse(responseCode = "400", description = "Bad request")
    })
    ResponseEntity<SchoolDTO> createSchool(SchoolDTO schoolDTO);

    @Operation(summary = "Retrieves a school by its email address", description = "Retrieves a school by its email address")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "School found",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = SchoolDTO.class))),
            @ApiResponse(responseCode = "400", description = "Bad request")
    })
    ResponseEntity<SchoolDTO> getSchoolByEmail(@PathVariable String email) ;

    @Operation(summary = "Create a student", description = "Creates a new student and returns the created student")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Student created",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = StudentDTO.class))),
            @ApiResponse(responseCode = "400", description = "Bad request")
    })
    ResponseEntity<StudentDTO> createStudent(@RequestBody @Valid StudentDTO request, @PathVariable UUID schoolId);

}
