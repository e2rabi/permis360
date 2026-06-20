package ma.errabi.sdk.exception;

public class DuplicateBookingException extends RuntimeException{
    public DuplicateBookingException(String message) {
        super(message);
    }
}
