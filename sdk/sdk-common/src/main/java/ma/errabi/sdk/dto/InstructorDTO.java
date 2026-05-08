package ma.errabi.sdk.dto;

import java.util.UUID;

public record InstructorDTO(
        UUID id,
        String name,
        String phone
) { }