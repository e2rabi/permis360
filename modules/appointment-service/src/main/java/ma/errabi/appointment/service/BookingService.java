package ma.errabi.appointment.service;

import lombok.RequiredArgsConstructor;
import ma.errabi.appointment.domain.Appointment;
import ma.errabi.appointment.domain.TimeSlot;
import ma.errabi.appointment.repository.AppointmentRepository;
import ma.errabi.appointment.repository.TimeSlotRepository;
import ma.errabi.sdk.dto.BookingRequest;
import ma.errabi.sdk.dto.BookingResponse;
import ma.errabi.sdk.exception.CapacityExceededException;
import ma.errabi.sdk.exception.DuplicateBookingException;
import ma.errabi.sdk.exception.ResourceNotFoundException;
import ma.errabi.sdk.types.AppointmentStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final TimeSlotRepository timeSlotRepository;
    private final AppointmentRepository appointmentRepository;
    private final StudentServiceClient studentServiceClient;

    @Transactional
    public BookingResponse bookTimeSlot(Long schoolId, BookingRequest request) {

        //  Verify remote Candidate exists
        if (!studentServiceClient.verifyCandidateExists(request.candidateId())) {
            throw new ResourceNotFoundException("Invalid candidate ID.");
        }

        //  Fetch the TimeSlot
        TimeSlot timeSlot = timeSlotRepository.findByIdAndSchoolId(request.timeSlotId(), schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("TimeSlot not found."));

        // 3. Prevent duplicate bookings by the same candidate
        if (appointmentRepository.existsByTimeSlotIdAndStudentId(timeSlot.getId(), request.candidateId())) {
            throw new DuplicateBookingException("Candidate is already booked for this timeslot.");
        }

        //  Enforce Capacity Limit
        long currentBookings = appointmentRepository.countActiveBookingsForTimeSlot(timeSlot.getId());
        if (currentBookings >= timeSlot.getMaxCapacity()) {
            throw new CapacityExceededException("This timeslot is fully booked.");
        }

        //  Create and Save the Appointment
        Appointment appointment = new Appointment();
        appointment.setTimeSlot(timeSlot);
        appointment.setStudentId(request.candidateId());
        appointment.setStatus(AppointmentStatus.SCHEDULED);
        appointment.setNotes(request.notes());

        Appointment saved = appointmentRepository.save(appointment);

        return new BookingResponse(
                saved.getId(),
                saved.getTimeSlot().getId(),
                saved.getStudentId(),
                saved.getStatus().name()
        );
    }
}