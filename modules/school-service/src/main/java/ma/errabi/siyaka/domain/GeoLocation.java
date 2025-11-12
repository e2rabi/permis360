package ma.errabi.siyaka.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class GeoLocation {
    @Id
    private Long id;
    private double latitude;
    private double longitude;

}
