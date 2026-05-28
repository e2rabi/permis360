package ma.errabi.sdk.aspect;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.errabi.sdk.aspect.annotation.TrackUploadMetrics;
import ma.errabi.sdk.metric.MetricsService;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import static ma.errabi.sdk.util.Constant.*;

@Slf4j
@Aspect
@Component
@RequiredArgsConstructor
public class UploadMetricsAspect {

    private final MetricsService metricsService;

    @Around("@annotation(trackUploadMetrics)")
    public Object trackUploadMetrics(ProceedingJoinPoint joinPoint, TrackUploadMetrics trackUploadMetrics) throws Throwable {
        MultipartFile file = extractMultipartFile(joinPoint.getArgs());
        try {
            Object result = joinPoint.proceed();

            if (file != null) {
                metricsService.log(
                        METRIC_UPLOAD_DOCUMENT_SUCCESS,
                        METRIC_TAG_FILE_TYPE,
                        file.getContentType()
                );
            }

            return result;

        } catch (Exception ex) {

            if (file != null) {
                metricsService.log(
                        METRIC_UPLOAD_DOCUMENT_FAILED,
                        METRIC_TAG_FILE_TYPE,
                        file.getContentType()
                );
            }

            throw ex;
        }
    }

    private MultipartFile extractMultipartFile(Object[] args) {
        for (Object arg : args) {
            if (arg instanceof MultipartFile multipartFile) {
                return multipartFile;
            }
        }
        return null;
    }
}