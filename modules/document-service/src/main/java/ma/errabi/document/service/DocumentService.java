package ma.errabi.document.service;

import io.micrometer.core.instrument.MeterRegistry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.errabi.sdk.exception.TechnicalException;
import org.jspecify.annotations.NullMarked;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.util.UUID;

@Slf4j
@Service
@NullMarked
@RequiredArgsConstructor
public class DocumentService {
    private final S3Client s3Client;
    private final MeterRegistry meterRegistry;
    @Value("${minio.bucket}")
    private String bucket;


    public String uploadFile(MultipartFile file){
        log.info("Uploading file: {}", file.getOriginalFilename());
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();

        try{
            PutObjectRequest request = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(filename)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(request, RequestBody.fromBytes(file.getBytes()));

            meterRegistry.counter("file.uploads.success",
                    "file_type", file.getContentType()).increment();

            return filename ;
        }catch (Exception e){
            log.error("Failed to upload file", e);
            meterRegistry.counter("file.uploads.failed").increment();
            throw new TechnicalException("Failed to upload file");
        }
    }
}
