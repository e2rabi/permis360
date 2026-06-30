package ma.errabi.appointment.service;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class TimeSlotScheduler {

    private final TimeSlotGenerationService generationService;

    @Scheduled(cron = "0 31 13 * * *")
    public void generateFutureSlots() {

        LocalDate start = LocalDate.now().plusDays(1);
        LocalDate end = start.plusDays(30);

        generationService.generateSlots(start, end);
    }
}