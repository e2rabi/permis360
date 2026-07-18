package ma.errabi.sdk.dto;


import ma.errabi.sdk.types.InstructorAvailability;

public record InstructorDTO(
        Long id,
        String name,
        String phone,
        String specialty,
        InstructorAvailability availability,
        Long schoolId
) { }