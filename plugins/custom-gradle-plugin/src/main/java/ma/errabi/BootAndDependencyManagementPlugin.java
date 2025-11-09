package ma.errabi;

import org.gradle.api.Plugin;
import org.gradle.api.Project;
import org.gradle.api.tasks.TaskProvider;
import org.gradle.api.tasks.bundling.Jar;

public class BootAndDependencyManagementPlugin implements Plugin<Project> {

    @Override
    public void apply(Project project) {
        // Apply Spring Boot plugin first
        project.getPluginManager().apply("java");
        project.getPluginManager().apply("org.springframework.boot");

        // Configure bootJar after the project is evaluated
/*        project.afterEvaluate(p -> {
            TaskProvider<Jar> bootJarTask = project.getTasks().named("bootJar", Jar.class);
            bootJarTask.configure(task -> task.doLast(t -> {
                System.out.println("✅ Custom plugin: bootJar task completed!");
            }));
        });*/

        System.out.println("✅ Custom Boot plugin applied!");
    }
}