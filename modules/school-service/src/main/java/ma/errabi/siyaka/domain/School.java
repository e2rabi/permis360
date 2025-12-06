package ma.errabi.siyaka.domain;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ma.errabi.types.SchoolStatus;
import org.hibernate.annotations.DynamicUpdate;

import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@DynamicUpdate
public class School extends BaseEntity {
    @Id
    @GeneratedValue
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private UUID id;
    private String name;
    private String address;
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
    private List<Student> students;

    @JsonManagedReference
    @OneToMany(mappedBy = "school", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Instructor> instructors;
}
