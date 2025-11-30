package ma.errabi;

import org.gradle.api.Plugin;
import org.gradle.api.Project;

public class BootAndDependencyManagementPlugin implements Plugin<Project> {

    @Override
    public void apply(Project project) {
        project.getPluginManager().apply("java");
        project.getPluginManager().apply("org.springframework.boot");

        System.out.println("✅ Custom Boot plugin applied!");
        // Ensure Jib plugin is applied
        project.getPluginManager().apply("com.google.cloud.tools.jib");

        // Provide a default project version if none is set or if it's 'unspecified'
        Object currentVersion = project.getVersion();
        if ("unspecified".equals(currentVersion.toString())) {
            project.setVersion("0.1.1-SNAPSHOT");
        }
    }
}