package ma.errabi.document.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;
import org.hibernate.annotations.DynamicUpdate;

import java.util.UUID;

@Entity
@Setter
@Getter
@Builder
@DynamicUpdate
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "document_history")
public class DocumentHistory extends BaseEntity {
    @Id
    @GeneratedValue
    private UUID id;
    private String documentName;
    private String objectId;
}
