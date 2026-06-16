package ma.errabi.autoecole.architecture;


import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.*;
import static com.tngtech.archunit.library.Architectures.layeredArchitecture;

@AnalyzeClasses(packages = "ma.errabi.autoecole")
public class ArchitectureTest {

    @ArchTest
    static final ArchRule enforce_jakarta_namespace = noClasses()
            .should().dependOnClassesThat().resideInAnyPackage(
                    "javax.persistence..",
                    "javax.validation..",
                    "javax.servlet..",
                    "javax.transaction.."
            )
            .because("Spring Boot 4 uses Jakarta EE 11. You must use the jakarta.* namespace instead of javax.*");


    @ArchTest
    static final ArchRule layer_dependencies_are_respected = layeredArchitecture()
            .consideringAllDependencies()
            .layer("Controllers").definedBy("..controller..")
            .layer("Services").definedBy("..service..")
            .layer("Persistence").definedBy("..repository..")

            .whereLayer("Controllers").mayNotBeAccessedByAnyLayer()
            .whereLayer("Services").mayOnlyBeAccessedByLayers("Controllers")
            .whereLayer("Persistence").mayOnlyBeAccessedByLayers("Services");

    @ArchTest
    static final ArchRule controllers_must_be_annotated = classes()
            .that().resideInAPackage("..controller..")
            .and().resideOutsideOfPackage("..controller.openapi..")
            .should().beAnnotatedWith(RestController.class)
            .because("All classes in the controller package (excluding the openapi subpackage) must be valid Spring REST Controllers.");

    @ArchTest
    static final ArchRule no_field_injection = noFields()
            .should().beAnnotatedWith(Autowired.class)
            .because("Field injection is an anti-pattern. Use constructor injection via standard Java constructors or Lombok's @RequiredArgsConstructor.");
}
