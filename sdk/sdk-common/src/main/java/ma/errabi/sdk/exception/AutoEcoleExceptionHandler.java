package ma.errabi.sdk.exception;

import ma.errabi.sdk.dto.ResponseInfo;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class AutoEcoleExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ResponseInfo> HandleResourceNotFoundException (ResourceNotFoundException ex) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND.value())
                .body(new ResponseInfo(ex.getMessage(), "00004"));
    }
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ResponseInfo> HandleBusinessException (BusinessException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST.value())
                .body(new ResponseInfo(ex.getMessage(), "00001"));
    }
}
