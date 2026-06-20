package ma.errabi.appointment.repository;

import ma.errabi.appointment.domain.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.timeSlot.id = :timeSlotId AND a.status != 'CANCELED'")
    long countActiveBookingsForTimeSlot(Long timeSlotId);

    boolean existsByTimeSlotIdAndStudentId(Long timeSlotId, Long studentId);
}