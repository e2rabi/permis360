package ma.errabi.sdk.dto;

public record BookingResponse(
        Long appointmentId,
        Long timeSlotId,
        Long candidateId,
        String status
) {}