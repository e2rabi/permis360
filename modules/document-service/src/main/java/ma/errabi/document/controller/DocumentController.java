package ma.errabi.document.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.errabi.document.controller.openapi.DocumentOpenApi;
import ma.errabi.document.service.DocumentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequestMapping("/document")
@RequiredArgsConstructor
public class DocumentController implements DocumentOpenApi {

   private final DocumentService documentService ;

   @Override
   @GetMapping
   public ResponseEntity<byte[]> getDocument(@RequestParam("filename") String filename){
       log.info("Received request to get document by filename: {}", filename);
       return ResponseEntity.ok(documentService.getDocument(filename));
   }
    @Override
    @PostMapping
    public ResponseEntity<String> uploadDocument(@RequestParam("file") MultipartFile file,@RequestParam String objectId)  {
      log.info("Received file upload request: {}", file.getOriginalFilename());
      String filename = documentService.uploadDocument(file,objectId);
      return ResponseEntity.ok("File uploaded successfully: " + filename);
    }
}