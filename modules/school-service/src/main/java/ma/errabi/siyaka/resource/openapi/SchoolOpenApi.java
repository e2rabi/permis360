package ma.errabi.siyaka.resource.openapi;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import ma.errabi.dtos.SchoolDTO;
import org.springframework.http.ResponseEntity;

public interface SchoolOpenApi {

    @Operation(summary = "Create a School", description = "Creates a new school and returns the created SchoolDTO")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "School created",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = SchoolDTO.class))),
            @ApiResponse(responseCode = "400", description = "Bad request")
    })
    ResponseEntity<SchoolDTO> createSchool(SchoolDTO schoolDTO);
}
