package ma.errabi.autoecole.domain;


import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.DynamicUpdate;

@Entity
@Getter
@Setter
@DynamicUpdate
public class GeoLocation extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "geo_seq")
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @SequenceGenerator(
            name = "geo_seq",
            sequenceName = "geo_sequence",
            allocationSize = 1
    )
    private Long id;
    private double latitude;
    private double longitude;
}
