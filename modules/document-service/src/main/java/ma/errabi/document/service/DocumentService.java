package ma.errabi.document.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.errabi.sdk.exception.TechnicalException;
import org.jspecify.annotations.NonNull;
import org.jspecify.annotations.NullMarked;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import static ma.errabi.sdk.util.Constant.*;

@Slf4j
@Service
@NullMarked
@RequiredArgsConstructor
public class DocumentService {

    private final StorageService storageService;
    private final MetricsService metricsService;
    private final DocumentValidationService validationService;

    public byte[] getDocument(@NonNull String filename){
        log.info("Start get document by filename: {}", filename);
        return storageService.getDocument(filename);
    }

    public String uploadDocument(MultipartFile file, String objectId) {
        try {
            validationService.validateDocument(objectId);
            log.info("Uploading document: {}", file.getOriginalFilename());

            String filename = storageService.uploadDocument(file);
            metricsService.log(METRIC_UPLOAD_DOCUMENT_SUCCESS, METRIC_TAG_FILE_TYPE, file.getContentType());
            validationService.saveDocumentHistory(objectId, filename);

            return filename;
        } catch (Exception ex) {
            metricsService.log(METRIC_UPLOAD_DOCUMENT_FAILED, null, null);
            throw new TechnicalException("Error uploading document"+ ex.getMessage());
        }
    }
}
