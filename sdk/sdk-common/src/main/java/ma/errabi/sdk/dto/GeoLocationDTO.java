package ma.errabi.sdk.dto;


import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.UUID;

public record GeoLocationDTO(
     @JsonIgnore
     UUID id,
     @Schema(description = "latitude of the school", example = "Demo school")
     double latitude,
        @Schema(description = "longitude of the school", example = "Demo school")
     double longitude){
}

