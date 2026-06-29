package ma.errabi.sdk.exception;

import feign.FeignException;
import ma.errabi.sdk.dto.ResponseInfo;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import software.amazon.awssdk.services.s3.model.NoSuchKeyException;

@RestControllerAdvice
public class AutoEcoleExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ResponseInfo> handleResourceNotFoundException (ResourceNotFoundException ex) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND.value())
                .body(new ResponseInfo(ex.getMessage(), "00004"));
    }
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ResponseInfo> handleBusinessException (BusinessException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST.value())
                .body(new ResponseInfo(ex.getMessage(), "00001"));
    }
    @ExceptionHandler(NoSuchKeyException.class)
    public ResponseEntity<ResponseInfo> handleNoSuchKeyException (NoSuchKeyException ex) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND.value())
                .body(new ResponseInfo(ex.getMessage(), "00003"));
    }
    @ExceptionHandler(TechnicalException.class)
    public ResponseEntity<ResponseInfo> handleTechnicalException (TechnicalException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST.value())
                .body(new ResponseInfo(ex.getMessage(), "99999"));
    }
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ResponseInfo> handleDataIntegrityViolationException (DataIntegrityViolationException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST.value())
                .body(new ResponseInfo("Invalid Request : "+ex.getMostSpecificCause(), "00001"));
    }
    @ExceptionHandler(DuplicateBookingException.class)
    public ResponseEntity<ResponseInfo> handleDuplicateBookingException (DuplicateBookingException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST.value())
                .body(new ResponseInfo("Invalid Request : "+ex.getMessage(), "00022"));
    }
    @ExceptionHandler(FeignException.class)
    public ResponseEntity<ResponseInfo> handleFeignException (FeignException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST.value())
                .body(new ResponseInfo("Bad request : "+ex.getMessage(), "00024"));
    }
}