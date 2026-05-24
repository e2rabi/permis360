package ma.errabi.document.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.errabi.document.repository.DocumentHistoryRepository;
import ma.errabi.sdk.exception.ResourceNotFoundException;
import ma.errabi.sdk.exception.TechnicalException;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.resilience.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class S3StorageService implements StorageService {

    private final S3Client s3Client;
    private final DocumentHistoryRepository documentHistoryRepository;

    @Value("${minio.bucket}")
    private String bucket;

    @Override
    public byte[] getDocument(@NonNull String objectId){
        log.info("Getting document for objectId: {}", objectId);
        String filename = documentHistoryRepository.findByObjectId(objectId)
                .orElseThrow(()-> new ResourceNotFoundException("Document not found for objectId"))
                .getDocumentName();

        GetObjectRequest request = GetObjectRequest.builder()
                .bucket(bucket)
                .key(filename)
                .build();
        return s3Client.getObjectAsBytes(request).asByteArray();
    }
    @Override
    @Retryable(value = Exception.class, maxRetries=3, delay = 1000)
    public String uploadDocument(@NonNull MultipartFile file){
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();

        try{
            PutObjectRequest request = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(filename)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(request, RequestBody.fromBytes(file.getBytes()));

            return filename ;
        }catch (Exception e){
            log.error("Failed to upload file", e);
            throw new TechnicalException("Failed to upload file to S3: " + e.getMessage());
        }
    }
}
