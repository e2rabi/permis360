package ma.errabi.autoecole.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import ma.errabi.sdk.types.StudentStatus;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicUpdate;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@Builder
@DynamicUpdate
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "students")
public class Student extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "student_seq")
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @SequenceGenerator(
            name = "student_seq",
            sequenceName = "student_sequence",
            allocationSize = 1
    )
    private Long id;
    private String firstName;
    private String lastName;

    @Column(unique = true)
    private String phone;

    @Column(unique = true)
    private String cin;

    @CreationTimestamp
    private LocalDate registrationDate;

    private Double totalAmount;
    private Double paidAmount;

    @Enumerated(EnumType.STRING)
    private StudentStatus status;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "school_id")
    private School school;

    @JsonManagedReference
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Payment> payments;
}
