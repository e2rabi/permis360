package ma.errabi.autoecole.domain;

import jakarta.persistence.*;
import lombok.*;
import ma.errabi.sdk.types.LessonStatus;
import org.hibernate.annotations.DynamicUpdate;

import java.time.LocalDateTime;

@Entity
@Table(name = "lesson_slots")
@Getter
@Setter
@Builder
@DynamicUpdate
@NoArgsConstructor
@AllArgsConstructor
public class LessonSlot extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "lesson_slot_seq")
    @SequenceGenerator(
            name = "lesson_slot_seq",
            sequenceName = "lesson_slot_sequence",
            allocationSize = 1
    )
    private Long id;

    @ManyToOne
    @JoinColumn(name = "instructor_id")
    private Instructor instructor;

    @ManyToOne
    @JoinColumn(name = "car_id")
    private Car car;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    private LessonStatus status;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;
}
