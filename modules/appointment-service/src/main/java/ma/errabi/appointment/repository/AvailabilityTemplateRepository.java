package ma.errabi.appointment.repository;

import ma.errabi.appointment.domain.AvailabilityTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.util.List;

@Repository
public interface AvailabilityTemplateRepository
        extends JpaRepository<AvailabilityTemplate, Long> {

    List<AvailabilityTemplate> findByActiveTrue();

    List<AvailabilityTemplate> findByProviderId(Long providerId);

    List<AvailabilityTemplate> findByProviderIdAndActiveTrue(Long providerId);

    List<AvailabilityTemplate> findByDayOfWeek(DayOfWeek dayOfWeek);

    List<AvailabilityTemplate> findByProviderIdAndDayOfWeek(
            Long providerId,
            DayOfWeek dayOfWeek
    );

    List<AvailabilityTemplate> findByProviderIdAndDayOfWeekAndActiveTrue(
            Long providerId,
            DayOfWeek dayOfWeek
    );
}