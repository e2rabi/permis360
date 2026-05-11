package ma.errabi;

import org.gradle.api.Plugin;
import org.gradle.api.Project;

import java.lang.reflect.Method;

public class BootAndDependencyManagementPlugin implements Plugin<Project> {

    @Override
    public void apply(Project project) {
        project.getPluginManager().apply("java");
        project.getPluginManager().apply("org.springframework.boot");
        project.getPluginManager().apply("com.google.cloud.tools.jib");

        System.out.println("✅Auto ecole custom Boot plugin applied!");

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
                setFromImage.invoke(from, "eclipse-temurin:21-jre-alpine");

                // set to.image (use project name + version by default)
                Method getTo = jibExt.getClass().getMethod("getTo");
                Object to = getTo.invoke(jibExt);
                Method setToImage = to.getClass().getMethod("setImage", String.class);
                String image = "index.docker.io/e2rabi11/" + p.getName() + ":" + p.getVersion();
                setToImage.invoke(to, image);

            } catch (Exception e) {
                // non-fatal: log and continue so consumer builds aren't broken if Jib internals differ
                System.err.println("Warning: could not configure jib defaults in ma.errabi.build-plugin: " + e.getMessage());
            }
        });
    }
}