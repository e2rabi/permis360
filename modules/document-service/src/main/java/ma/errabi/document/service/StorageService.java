package ma.errabi.document.service;

import org.jspecify.annotations.NonNull;
import org.springframework.web.multipart.MultipartFile;

public interface StorageService {
    byte[] getDocument(@NonNull String objectId);
    String uploadDocument(@NonNull MultipartFile file);
}
