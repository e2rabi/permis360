package ma.errabi.dtos;

import java.util.UUID;

public record InstructorDTO(
        UUID id,
        String name,
        String phone
) { }