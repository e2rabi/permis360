package ma.errabi.plugin;

import org.gradle.api.Plugin
import org.gradle.api.Project

class BootAndDependencyManagementPlugin implements Plugin<Project> {
    void apply(Project project) {
        project.pluginManager.apply('org.springframework.boot')
        project.pluginManager.apply('io.spring.dependency-management')
    }
}