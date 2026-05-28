package ma.errabi.autoecole.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicUpdate;

@Entity
@Table(name = "cars")
@Setter
@Getter
@Builder
@DynamicUpdate
@NoArgsConstructor
@AllArgsConstructor
public class Car extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "car_seq")
    @SequenceGenerator(
            name = "car_seq",
            sequenceName = "car_sequence",
            allocationSize = 1
    )
    private Long id;

    private String model;

    @Column(unique = true)
    private String plateNumber;
}
