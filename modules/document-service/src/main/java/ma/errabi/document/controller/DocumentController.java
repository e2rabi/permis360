package ma.errabi.document.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.errabi.document.controller.openapi.DocumentOpenApi;
import ma.errabi.document.service.DocumentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@Slf4j
@RestController
@RequestMapping("/documents")
@RequiredArgsConstructor
public class DocumentController implements DocumentOpenApi {

   private final DocumentService documentService ;

    @Override
    @GetMapping(value = "/{objectId}")
    public ResponseEntity<byte[]> getDocument(@PathVariable("objectId") String objectId){
       log.info("Received request to get document by objectId: {}", objectId);
       return ResponseEntity.ok(documentService.getDocument(objectId));
    }

    @Override
    @PostMapping
    public ResponseEntity<String> uploadDocument(@RequestParam("file") MultipartFile file,@RequestParam("objectId") String objectId)  {
      log.info("Start file upload request: {}", file.getOriginalFilename());
      String fileId = documentService.uploadDocument(file,objectId);
      URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(fileId)
                .toUri();
        log.info("End file upload request: {}", file.getOriginalFilename());

        return ResponseEntity
                .created(location)
                .body("File uploaded id : " + fileId);
    }

    @DeleteMapping(value = "/{objectId}")
    public ResponseEntity<Void> deleteDocument(@PathVariable("objectId") String objectId){
        log.info("Request to delete document: {}", objectId);
        boolean deleted = documentService.deleteDocument(objectId);
        if (deleted) {
            log.info("Document {} deleted successfully", objectId);
            return ResponseEntity.noContent().build();
        } else {
            log.warn("Document {} not found for deletion", objectId);
            return ResponseEntity.notFound().build();
        }
    }
}