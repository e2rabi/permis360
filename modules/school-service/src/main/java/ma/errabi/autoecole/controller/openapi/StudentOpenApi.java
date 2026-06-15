package ma.errabi.autoecole.controller.openapi;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import ma.errabi.sdk.dto.StudentDto;
import org.springframework.http.ResponseEntity;

@Tag(name = "Students", description = "APIs for managing students")
public interface StudentOpenApi {

  @Operation(summary = "Retrieves a student details by it usedId", description = "Retrieves a student details by it usedId")
  @ApiResponses(value = {
          @ApiResponse(responseCode = "200", description = "Student found",
                  content = @Content(mediaType = "application/json", schema = @Schema(implementation = StudentDto.class))),
          @ApiResponse(responseCode = "404", description = "Student not found")
  })
  ResponseEntity<StudentDto> getStudentDetails(String userId);
}
