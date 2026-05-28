package ma.errabi.document.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import ma.errabi.sdk.aspect.annotation.TrackUploadMetrics;
import org.jspecify.annotations.NullMarked;
import org.springframework.resilience.annotation.ConcurrencyLimit;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@NullMarked
@RequiredArgsConstructor
public class DocumentService {

    private final StorageService storageService;
    private final DocumentValidationService documentValidationService ;

    @ConcurrencyLimit(10)
    public byte[] getDocument(String objectId){
        log.info("Start get document by objectId: {}", objectId);
        return storageService.getDocument(objectId);
    }

    @TrackUploadMetrics
    @ConcurrencyLimit(10)
    public String uploadDocument(MultipartFile file, String objectId) {
        log.info("Uploading document: {}", file.getOriginalFilename());
        documentValidationService.validate(objectId,file);
        String filename = storageService.uploadDocument(file);
        documentValidationService.audit(objectId, filename);
        log.info("Upload successful: {}", filename);
        return filename;

    }
}
