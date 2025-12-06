package ma.errabi.siyaka.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "instructors")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Instructor extends BaseEntity{
    @Id
    @GeneratedValue
    private UUID id;

    private String name;

    @Column(unique = true)
    private String phone;
    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "school_id")
    private School school;
}
