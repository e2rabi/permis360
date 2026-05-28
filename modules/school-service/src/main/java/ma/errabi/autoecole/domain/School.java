package ma.errabi.autoecole.domain;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ma.errabi.sdk.types.SchoolStatus;
import org.hibernate.annotations.DynamicUpdate;

import java.util.Set;

@Entity
@Getter
@Setter
@DynamicUpdate
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "schools")
public class School extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "school_seq")
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @SequenceGenerator(
            name = "school_seq",
            sequenceName = "school_sequence",
            allocationSize = 1
    )
    private Long id;
    private String name;
    private String address;
    @Column(unique = true)
    private String email;
    private String website;
    private String logo;
    private String description;
    private String facebook;
    private String instagram;
    @Enumerated(EnumType.STRING)
    private SchoolStatus status;
    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    private GeoLocation geoLocation ;
    @Column(unique = true)
    private String primaryPhoneNumber;
    @Column(unique = true)
    private String secondaryPhoneNumber;

    @JsonManagedReference
    @OneToMany(mappedBy = "school", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Student> students;

    @JsonManagedReference
    @OneToMany(mappedBy = "school", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Instructor> instructors;
}
