package ma.errabi.siyaka.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import ma.errabi.types.StudentStatus;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicUpdate;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "students")
@Getter
@Setter
@Builder
@DynamicUpdate
@NoArgsConstructor
@AllArgsConstructor
public class Student extends BaseEntity{
    @Id
    @GeneratedValue
    private UUID id;

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
