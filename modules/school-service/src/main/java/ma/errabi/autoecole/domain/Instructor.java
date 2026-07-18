package ma.errabi.autoecole.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import ma.errabi.sdk.types.InstructorAvailability;
import org.hibernate.annotations.DynamicUpdate;

@Entity
@Table(name = "instructors")
@Getter
@Setter
@Builder
@DynamicUpdate
@NoArgsConstructor
@AllArgsConstructor
public class Instructor extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "instructor_seq")
    @SequenceGenerator(
            name = "instructor_seq",
            sequenceName = "instructor_sequence",
            allocationSize = 1
    )
    private Long id;

    private String name;
    private String specialty;
    @Enumerated(EnumType.STRING)
    private InstructorAvailability availability;

    @Column(unique = true)
    private String phone;
    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "school_id")
    private School school;
}
