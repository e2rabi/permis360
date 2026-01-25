package ma.errabi.autoecole.domain;


import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.DynamicUpdate;

import java.util.UUID;

@Entity
@Getter
@Setter
@DynamicUpdate
public class GeoLocation extends BaseEntity{
    @Id
    @GeneratedValue
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private UUID id;
    private double latitude;
    private double longitude;
}
