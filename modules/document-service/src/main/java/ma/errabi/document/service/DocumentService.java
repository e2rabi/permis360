package ma.errabi.document.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import ma.errabi.sdk.aspect.annotation.TrackUploadMetrics;
import org.jspecify.annotations.NonNull;
import org.jspecify.annotations.NullMarked;
import org.springframework.resilience.annotation.ConcurrencyLimit;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@NullMarked
@RequiredArgsConstructor
public class DocumentService {

    private final StorageService storageService;
    private final DocumentLifecycleService documentLifecycleService;

    @ConcurrencyLimit(10)
    public byte[] getDocument(String objectId){
        log.info("Start get document by objectId: {}", objectId);
        return storageService.getDocument(objectId);
    }

    @TrackUploadMetrics
    @ConcurrencyLimit(10)
    public String uploadDocument(MultipartFile file, String objectId) {
        log.info("Uploading document: {}", file.getOriginalFilename());
        documentLifecycleService.validate(objectId,file);
        String filename = storageService.uploadDocument(file);
        documentLifecycleService.save(objectId, filename);
        log.info("Upload successful: {}", filename);
        return filename;

    }

    @Transactional
    public boolean deleteDocument(@NonNull String objectId){
        log.info("Deleting document for objectId: {}", objectId);
        boolean deleted =  storageService.deleteDocument(objectId);
        if (deleted) {
            documentLifecycleService.delete(objectId);
            log.info("Document deleted for objectId: {}", objectId);
        }
        return deleted;
    }
}
