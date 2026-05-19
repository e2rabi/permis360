package ma.errabi.document.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.errabi.document.domain.DocumentHistory;
import ma.errabi.sdk.exception.TechnicalException;
import org.jspecify.annotations.NullMarked;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ma.errabi.document.repository.DocumentHistoryRepository;

@Slf4j
@Service
@NullMarked
@RequiredArgsConstructor
public class DocumentValidationService {

    private final DocumentHistoryRepository documentHistoryRepository;

    @Transactional(readOnly = true)
    public void validateDocument(String objectId) {
        documentHistoryRepository.findByObjectId(objectId).ifPresent(history -> {
            log.error("Document already exists for objectId: {}", objectId);
            throw new TechnicalException("Document already exists for objectId: " + objectId);
        });
    }

    @Transactional
    public void saveDocumentHistory(String objectId , String documentName) {
        DocumentHistory history = DocumentHistory.builder()
                .objectId(objectId)
                .documentName(documentName)
                .build();
        documentHistoryRepository.save(history);
    }
}
