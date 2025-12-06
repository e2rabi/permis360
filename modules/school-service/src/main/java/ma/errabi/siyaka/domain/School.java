package ma.errabi.siyaka.domain;


import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ma.errabi.types.SchoolStatus;
import org.hibernate.annotations.DynamicUpdate;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@DynamicUpdate
public class School extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
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
    @OneToOne
    private GeoLocation geoLocation ;
    @Column(unique = true)
    private String phoneNumber1;
    @Column(unique = true)
    private String phoneNumber2;

    @JsonManagedReference
    @OneToMany(mappedBy = "school", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Student> students;

    @JsonManagedReference
    @OneToMany(mappedBy = "school", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Instructor> instructors;
}
