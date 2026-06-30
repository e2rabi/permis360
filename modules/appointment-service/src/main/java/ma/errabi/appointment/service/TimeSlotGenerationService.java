package ma.errabi.appointment.service;

import lombok.RequiredArgsConstructor;
import ma.errabi.appointment.domain.AvailabilityTemplate;
import ma.errabi.appointment.domain.TimeSlot;
import ma.errabi.appointment.repository.AvailabilityTemplateRepository;
import ma.errabi.appointment.repository.TimeSlotRepository;
import ma.errabi.sdk.types.SlotStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TimeSlotGenerationService {

    private final AvailabilityTemplateRepository templateRepository;
    private final TimeSlotRepository slotRepository;

    public void generateSlots(LocalDate from, LocalDate to) {

        List<AvailabilityTemplate> templates =
                templateRepository.findByActiveTrue();

        for (LocalDate date = from;
             !date.isAfter(to);
             date = date.plusDays(1)) {

            DayOfWeek day = date.getDayOfWeek();

            for (AvailabilityTemplate template : templates) {

                if (template.getDayOfWeek() != day) {
                    continue;
                }

                generateSlots(template, date);
            }
        }
    }

    private void generateSlots(AvailabilityTemplate template, LocalDate date) {

        LocalTime current = template.getStartTime();

        while (current.isBefore(template.getEndTime())) {

            LocalTime end =
                    current.plusMinutes(template.getSlotDuration());

            if (!slotRepository.existsByProviderIdAndDateAndStartTime(
                    template.getProviderId(),
                    date,
                    current)) {

                TimeSlot slot = new TimeSlot();

                slot.setProviderId(template.getProviderId());
                slot.setDate(date);
                slot.setStartTime(current);
                slot.setEndTime(end);
                slot.setCapacity(template.getCapacity());
                slot.setReserved(0);
                slot.setStatus(SlotStatus.AVAILABLE);

                slotRepository.save(slot);
            }

            current = end;
        }
    }
}