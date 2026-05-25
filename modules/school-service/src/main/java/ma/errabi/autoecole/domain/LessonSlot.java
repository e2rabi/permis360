package ma.errabi.autoecole.domain;

import jakarta.persistence.*;
import lombok.*;
import ma.errabi.sdk.types.LessonStatus;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "lesson_slots")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonSlot extends BaseEntity{
    @Id
    @GeneratedValue
    private UUID id;

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
