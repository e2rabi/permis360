package ma.errabi.document.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.errabi.document.domain.DocumentHistory;
import ma.errabi.sdk.exception.TechnicalException;
import org.jspecify.annotations.NullMarked;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ma.errabi.document.repository.DocumentHistoryRepository;
import org.springframework.util.unit.DataSize;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@NullMarked
@RequiredArgsConstructor
public class DocumentValidationService {

    private final DocumentHistoryRepository documentHistoryRepository;

    @Value("${app.upload.max-file-size}")
    private DataSize maxFileSize;

    @Transactional(readOnly = true)
    public void validate(String objectId,MultipartFile file) {
        validateFileSize(file);
        documentHistoryRepository.findByObjectId(objectId).ifPresent(history -> {
            log.error("Document already exists for objectId: {}", objectId);
            throw new TechnicalException("Document already exists for objectId: " + objectId);
        });
    }

    @Transactional
    public void audit(String objectId , String documentName) {
        log.info("Auditing document upload for objectId: {}", objectId);
        DocumentHistory history = DocumentHistory.builder()
                .objectId(objectId)
                .documentName(documentName)
                .build();
        documentHistoryRepository.save(history);
    }
    private void validateFileSize(MultipartFile file) {
        if (file.getSize() > maxFileSize.toBytes()) {
            log.error("File size exceeds the maximum allowed size of {} MB", maxFileSize.toMegabytes());
            throw new TechnicalException(
                    "File size exceeds the maximum allowed size of "
                            + maxFileSize.toMegabytes()
                            + " MB"
            );
        }
    }
}
