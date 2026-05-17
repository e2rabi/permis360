package ma.errabi.document.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.errabi.document.controller.openapi.DocumentOpenApi;
import ma.errabi.document.service.DocumentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequiredArgsConstructor
public class DocumentController implements DocumentOpenApi {

   private final DocumentService documentService ;

   @Override
    @PostMapping("/school/upload")
    public ResponseEntity<String> uploadSchoolDocument(@RequestParam("file") MultipartFile file)  {
      log.info("Received file upload request: {}", file.getOriginalFilename());
      String filename = documentService.uploadFile(file);
      return ResponseEntity.ok("File uploaded successfully: " + filename);
    }
}