package ma.errabi.appointment.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.errabi.appointment.service.BookingService;
import ma.errabi.sdk.dto.BookingRequest;
import ma.errabi.sdk.dto.BookingResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/booking")
public class BookingController {

    private final BookingService bookingService ;

    @PostMapping("/{providerId}")
    public ResponseEntity<BookingResponse> bookTimeSlot(@PathVariable Long providerId, @RequestBody BookingRequest request){
        log.info("Received request to book time slot: {}", request);
        BookingResponse response = bookingService.bookTimeSlot(providerId, request);
        log.info("Response to book time slot: {}", response);
         return ResponseEntity.ok(response);
    }
}
