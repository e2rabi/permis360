package ma.errabi.sdk.dto;

public record BookingResponse(
        Long appointmentId,
        Long timeSlotId,
        String studentId,
        String status
) {}