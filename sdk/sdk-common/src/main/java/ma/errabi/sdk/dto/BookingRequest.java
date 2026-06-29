package ma.errabi.sdk.dto;

public record BookingRequest(
        Long timeSlotId,
        String studentId,
        String notes
) {}