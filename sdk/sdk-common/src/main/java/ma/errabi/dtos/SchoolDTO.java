package ma.errabi.dtos;

import ma.errabi.types.SchoolStatus;

public record SchoolDTO(
        Long id,
        String name,
        String address,
        String email,
        String website,
        String logo,
        String description,
        String facebook,
        String instagram,
        SchoolStatus status,
        GeoLocationDTO geoLocation,
        String phoneNumber1,
        String phoneNumber2
) {
}