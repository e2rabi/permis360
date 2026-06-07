package ma.errabi;

import com.google.cloud.tools.jib.gradle.JibExtension;
import org.gradle.api.Plugin;
import org.gradle.api.Project;

import java.lang.reflect.Method;
import java.util.logging.Level;
import java.util.logging.Logger;

public class BootAndDependencyManagementPlugin implements Plugin<Project> {

    private final Logger logger =  Logger.getLogger(BootAndDependencyManagementPlugin.class.getName());
    @Override
    public void apply(Project project) {
        project.getPluginManager().apply("java");
        project.getPluginManager().apply("org.springframework.boot");
        project.getPluginManager().apply("com.google.cloud.tools.jib");

        logger.info("✅Auto ecole custom Boot plugin applied!");

        // ensure a sensible default version
        Object v = project.getVersion();
        if ("unspecified".equals(v.toString())) {
            project.setVersion("0.1.1-SNAPSHOT");
        }

        // configure jib defaults after the plugin has registered its extension
        project.afterEvaluate(p -> {
            try {
                Object jibExt = p.getExtensions().getByName("jib");

                // set from.image
                Method getFrom = jibExt.getClass().getMethod("getFrom");
                Object from = getFrom.invoke(jibExt);
                Method setFromImage = from.getClass().getMethod("setImage", String.class);
                setFromImage.invoke(from, "eclipse-temurin:25-jre-alpine");

                // set to.image (use project name + version by default)
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

            } catch (Exception e) {
                // non-fatal: log and continue so consumer builds aren't broken if Jib internals differ
                logger.log(Level.WARNING,"Warning: could not configure jib defaults in ma.errabi.build-plugin: {}" , e.getMessage());
            }
        });
    }
}