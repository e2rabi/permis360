package ma.errabi.document.service;

import io.micrometer.core.instrument.MeterRegistry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NullMarked;
import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Objects;


@Slf4j
@Service
@NullMarked
@RequiredArgsConstructor
public class MetricsService {

    private final MeterRegistry meterRegistry;

    public void log(String metricName, @Nullable String ... tags){
        try {
            if (tags.length == 0) {
                meterRegistry.counter(metricName).increment();
                return;
            }
            int len = tags.length;

            String[] safeTags = new String[len];

            for (int i = 0; i < len; i++) {
                safeTags[i] = Objects.requireNonNullElse(tags[i], "");
            }
            meterRegistry.counter(metricName, safeTags).increment();
        } catch (Exception e) {
            log.error("Failed to increment counter {} with tags {}", metricName, Arrays.toString(tags), e);
        }
    }
}
