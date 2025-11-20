package ma.errabi.siyaka.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.DynamicUpdate;

@Entity
@Getter
@Setter
@DynamicUpdate
public class GeoLocation extends BaseEntity{
    @Id
    private Long id;
    private double latitude;
    private double longitude;

}
