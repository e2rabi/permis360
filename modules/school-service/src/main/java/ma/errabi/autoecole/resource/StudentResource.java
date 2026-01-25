package ma.errabi.autoecole.resource;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.errabi.autoecole.resource.openapi.StudentOpenApi;
import org.springframework.web.bind.annotation.*;


@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/students")
@Tag(name = "Students", description = "APIs for managing students")
public class StudentResource implements StudentOpenApi {
}
