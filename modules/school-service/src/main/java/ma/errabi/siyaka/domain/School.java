package ma.errabi.siyaka.domain;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ma.errabi.types.SchoolStatus;
import org.hibernate.annotations.DynamicUpdate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@DynamicUpdate
public class School extends BaseEntity {
    @Id
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
    private String phoneNumber1;
    private String phoneNumber2;
}
