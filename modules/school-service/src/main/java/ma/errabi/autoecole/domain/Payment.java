package ma.errabi.autoecole.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import ma.errabi.sdk.types.PaymentMethod;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicUpdate;

import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
@Builder
@DynamicUpdate
@NoArgsConstructor
@AllArgsConstructor
public class Payment extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "payment_seq")
    @SequenceGenerator(
            name = "payment_seq",
            sequenceName = "payment_sequence",
            allocationSize = 1
    )
    private Long id;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "student_id")
    private Student student;

    private Integer amount;

    @CreationTimestamp
    private LocalDateTime paymentDate;

    @Enumerated(EnumType.STRING)
    private PaymentMethod method;
}
