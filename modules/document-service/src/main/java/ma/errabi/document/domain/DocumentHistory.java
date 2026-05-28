package ma.errabi.document.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicUpdate;


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
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "document_history_seq")
    @SequenceGenerator(
            name = "document_history_seq",
            sequenceName = "document_history_sequence",
            allocationSize = 1
    )
    private Long id;
    private String documentName;
    private String objectId;
}
