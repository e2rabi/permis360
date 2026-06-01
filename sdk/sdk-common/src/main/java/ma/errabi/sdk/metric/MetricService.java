package ma.errabi.sdk.metric;

import org.jspecify.annotations.Nullable;

@FunctionalInterface
public interface MetricService {
     void log(String metricName, @Nullable String ... tags);
}
