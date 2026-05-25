package ma.errabi.autoecole.resource;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.errabi.autoecole.resource.openapi.UserOpenApi;
import ma.errabi.autoecole.service.KeycloakService;
import ma.errabi.sdk.dto.UserDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController implements UserOpenApi {

    private final KeycloakService keycloakService;

    @Override
    @PostMapping
    public ResponseEntity<String> createUser(@RequestBody @Valid UserDto userDto) {
        log.info("Received request to create user: {}", userDto);
        return ResponseEntity.ok(keycloakService.createUser(userDto));
    }
}
