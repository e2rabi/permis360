package ma.errabi.appointment.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import ma.errabi.sdk.types.SlotStatus;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Setter
@Getter
@Table(name = "timeslots")
public class TimeSlot extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "timeslot_seq")
    @SequenceGenerator(
            name = "timeslot_seq",
            sequenceName = "timeslot_sequence",
            allocationSize = 1
    )
    private Long id;

    Long providerId;

    LocalDate date;

    LocalTime startTime;

    LocalTime endTime;

    Integer capacity;

    Integer reserved;

    SlotStatus status;

}