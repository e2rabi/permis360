package ma.errabi.siyaka.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "cars")
@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Car extends BaseEntity{
    @Id
    @GeneratedValue
    private UUID id;

    private String model;

    @Column(unique = true)
    private String plateNumber;
}
