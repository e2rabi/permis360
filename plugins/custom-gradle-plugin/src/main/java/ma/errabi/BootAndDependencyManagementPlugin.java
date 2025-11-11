package ma.errabi;

import org.gradle.api.Plugin;
import org.gradle.api.Project;


public class BootAndDependencyManagementPlugin implements Plugin<Project> {

    @Override
    public void apply(Project project) {
        project.getPluginManager().apply("java");
        project.getPluginManager().apply("org.springframework.boot");

        System.out.println("✅ Custom Boot plugin applied!");
    }
}