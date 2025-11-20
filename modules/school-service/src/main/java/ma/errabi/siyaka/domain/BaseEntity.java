package ma.errabi.siyaka.domain;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.Version;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;

@Setter
@Getter
@NoArgsConstructor
@MappedSuperclass
public class BaseEntity {

    @Version
    protected Long version;

    @CreationTimestamp
    @Column(updatable = false)
    protected Timestamp createdDate;

    @UpdateTimestamp
    protected Timestamp lastModifiedDate;
}
