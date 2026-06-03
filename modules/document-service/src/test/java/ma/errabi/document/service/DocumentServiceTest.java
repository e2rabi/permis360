package ma.errabi.document.service;

import ma.errabi.document.service.impl.DocumentLifecycleService;
import ma.errabi.document.service.impl.DocumentService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DocumentServiceTest {

    @Mock
    private StorageService storageService;

    @Mock
    private DocumentLifecycleService documentLifecycleService;

    @InjectMocks
    private DocumentService documentService;

    @Test
    void getDocument() {
        String objectId = "test-object-id";
        byte[] expectedDocument = "test document".getBytes();
        when(storageService.getDocument(objectId)).thenReturn(expectedDocument);

        byte[] actualDocument = documentService.getDocument(objectId);

        assertEquals(expectedDocument, actualDocument);
        verify(storageService).getDocument(objectId);
    }

    @Test
    void uploadDocument() {
        String objectId = "test-object-id";
        String expectedFilename = "test-file.txt";
        MultipartFile multipartFile = mock(MultipartFile.class);
        when(storageService.uploadDocument(multipartFile)).thenReturn(expectedFilename);

        String actualFilename = documentService.uploadDocument(multipartFile, objectId);

        assertEquals(expectedFilename, actualFilename);
        verify(documentLifecycleService).validate(objectId, multipartFile);
        verify(storageService).uploadDocument(multipartFile);
        verify(documentLifecycleService).save(objectId, expectedFilename);
    }

    @Test
    void deleteDocument() {
        String objectId = "test-object-id";
        when(storageService.deleteDocument(objectId)).thenReturn(true);

        boolean result = documentService.deleteDocument(objectId);

        assertTrue(result);
        verify(storageService).deleteDocument(objectId);
        verify(documentLifecycleService).delete(objectId);
    }

    @Test
    void deleteDocument_whenStorageServiceFails() {
        String objectId = "test-object-id";
        when(storageService.deleteDocument(objectId)).thenReturn(false);

        boolean result = documentService.deleteDocument(objectId);

        assertFalse(result);
        verify(storageService).deleteDocument(objectId);
        verify(documentLifecycleService, never()).delete(objectId);
    }
}
