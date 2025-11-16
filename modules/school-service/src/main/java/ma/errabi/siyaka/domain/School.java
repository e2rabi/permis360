package ma.errabi.siyaka.domain;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import ma.errabi.siyaka.type.SchoolStatus;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;

@Entity
@Getter
@Setter
@DynamicUpdate
public class School {
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

    @CreationTimestamp
    @Column(updatable = false)
    protected Timestamp createdDate;

    @UpdateTimestamp
    protected Timestamp lastModifiedDate;
    @Column(columnDefinition = "integer DEFAULT 0", nullable = false)
    private long version ;
}
