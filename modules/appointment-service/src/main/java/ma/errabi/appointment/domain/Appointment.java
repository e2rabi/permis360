package ma.errabi.appointment.domain;

import jakarta.persistence.*;
import ma.errabi.sdk.types.AppointmentStatus;


@Entity
@Table(name = "appointments")
public class Appointment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "appointment_seq")
    @SequenceGenerator(
            name = "appointment_seq",
            sequenceName = "appointment_sequence",
            allocationSize = 1
    )
    private Long id;

    @Column(name = "student_id", nullable = false, updatable = false)
    private Long studentId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AppointmentStatus status;

    @Column(name = "notes")
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "timeslot_id", nullable = false)
    private TimeSlot timeSlot;

}