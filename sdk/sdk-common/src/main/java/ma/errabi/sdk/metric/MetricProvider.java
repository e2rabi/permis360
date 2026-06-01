package ma.errabi.sdk.metric;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.errabi.sdk.types.MetricType;
import org.jspecify.annotations.NonNull;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class MetricProvider {

     private final ApplicationContext applicationContext;

     public MetricService getMetricService(@NonNull MetricType type){
         if(type == MetricType.COUNTER){
             return applicationContext.getBean(MetricCounterService.class);
         }
         throw new IllegalArgumentException("Unsupported metric type: " + type);
     }
}
