package ma.errabi;

import com.google.cloud.tools.jib.gradle.JibExtension;
import org.gradle.api.Plugin;
import org.gradle.api.Project;
import org.gradle.api.tasks.testing.Test;
import org.gradle.testing.jacoco.tasks.JacocoReport;

import java.io.File;
import java.lang.reflect.Method;
import java.util.Collections;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

public class BootAndDependencyManagementPlugin implements Plugin<Project> {

    private final Logger logger =
            Logger.getLogger(BootAndDependencyManagementPlugin.class.getName());

    @Override
    public void apply(Project project) {

        project.getPluginManager().apply("java");
        project.getPluginManager().apply("org.springframework.boot");
        project.getPluginManager().apply("com.google.cloud.tools.jib");
        project.getPluginManager().apply("jacoco");

        logger.info("✅ Auto ecole custom Boot plugin applied!");

        // =========================
        // JACOCO CONFIGURATION
        // =========================
        project.getTasks().withType(Test.class).configureEach(testTask -> {
            testTask.finalizedBy("jacocoTestReport");
        });

        project.getTasks().withType(JacocoReport.class).configureEach(reportTask -> {
            reportTask.dependsOn("test");
            reportTask.getReports().getXml().getRequired().set(true);
            reportTask.getReports().getHtml().getRequired().set(true);
        });

        Object v = project.getVersion();
        if ("unspecified".equals(v.toString())) {
            project.setVersion("0.1.1-SNAPSHOT");
        }

        project.afterEvaluate(p -> {
            try {

                // =========================
                // JIB BASIC CONFIG
                // =========================
                Object jibExt = p.getExtensions().getByName("jib");

                Method getFrom = jibExt.getClass().getMethod("getFrom");
                Object from = getFrom.invoke(jibExt);

                Method setImage = from.getClass().getMethod("setImage", String.class);
                setImage.invoke(from, "eclipse-temurin:25-jre-alpine");

                JibExtension jib = p.getExtensions().getByType(JibExtension.class);

                jib.getTo().setImage(
                        "index.docker.io/e2rabi11/" +
                                p.getName() +
                                ":" +
                                p.getVersion()
                );

                String username = System.getenv("DOCKERHUB_USERNAME");
                String password = System.getenv("DOCKERHUB_TOKEN");

                if (username != null && password != null) {
                    jib.getTo().getAuth().setUsername(username);
                    jib.getTo().getAuth().setPassword(password);
                }

                // =========================
                // OPENTELEMETRY FROM MODULE PATH
                // =========================

                File otelDir = p.getRootProject().file("infrastructures/otel");
                logger.info("OTEL dir: " + otelDir.getAbsolutePath());

                if (!otelDir.exists()) {
                    logger.warning("⚠️ OTEL folder not found: " + otelDir.getAbsolutePath());
                }

                // Copy the folder into image
                jib.getExtraDirectories().setPaths(
                        Collections.singletonList(otelDir)
                );

                jib.getContainer().setJvmFlags(
                        List.of("-javaagent:/opentelemetry-javaagent.jar")
                );

            } catch (Exception e) {
                logger.log(Level.WARNING, "Warning: could not configure jib + otel setup", e);
            }
        });
    }
}