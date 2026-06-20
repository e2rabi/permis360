package ma.errabi.sdk.dto;

public record BookingRequest(
        Long timeSlotId,
        Long candidateId,
        String notes
) {}