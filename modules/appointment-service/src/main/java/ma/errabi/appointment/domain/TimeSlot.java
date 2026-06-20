package ma.errabi.appointment.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

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

    @Column(name = "school_id", nullable = false, updatable = false)
    private Long schoolId;

    @Column(name = "instructor_id", nullable = false, updatable = false)
    private Long instructorId;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Column(name = "max_capacity", nullable = false)
    private Integer maxCapacity;

}