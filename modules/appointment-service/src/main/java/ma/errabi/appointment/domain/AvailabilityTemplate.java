package ma.errabi.appointment.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Setter
@Getter
@Entity
@Table(name = "availability_template")
public class AvailabilityTemplate extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "availability_template_seq")
    @SequenceGenerator(
            name = "availability_template_seq",
            sequenceName = "availability_template_sequence",
            allocationSize = 1
    )
    Long id;

    Long providerId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    DayOfWeek dayOfWeek;

    LocalTime startTime;

    LocalTime endTime;

    Integer slotDuration;

    Integer capacity;

    boolean active;
}
