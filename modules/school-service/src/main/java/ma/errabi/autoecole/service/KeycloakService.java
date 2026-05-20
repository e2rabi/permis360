package ma.errabi.autoecole.service;

import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.errabi.sdk.dto.UserDto;
import ma.errabi.sdk.exception.ResourceNotFoundException;
import ma.errabi.sdk.exception.TechnicalException;
import org.jspecify.annotations.NullMarked;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

import static ma.errabi.sdk.util.Constant.ROLE_API_CORE;

@Slf4j
@Service
@NullMarked
@RequiredArgsConstructor
public class KeycloakService {

    private final Keycloak keycloak;

    @Value("${keycloak.target-realm}")
    private String targetRealm;

    @Value("${keycloak.target-client}")
    private String clientId;

    public String createUser(UserDto userDto) {
        log.info("Creating user: {}", userDto);

        UserRepresentation user = createUserRepresentation(userDto, createCredential(userDto.password()));
        Response response = keycloak.realm(targetRealm).users().create(user);

        if (response.getStatus() != 201) {
            log.error("Failed to create user: {}", response);
            throw new TechnicalException("Failed to create user: " + response.getStatus() + " " + response.getStatusInfo());
        }

        String userId = extractUserIdFromLocation(response);
        assignClientRole(userId, ROLE_API_CORE);

        return userId;
    }

    private CredentialRepresentation createCredential(String password) {
        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(password);
        credential.setTemporary(false);
        return credential;
    }

    private UserRepresentation createUserRepresentation(UserDto userDto, CredentialRepresentation credential) {
        UserRepresentation user = new UserRepresentation();
        user.setUsername(userDto.username());
        user.setEmail(userDto.email());
        user.setFirstName(userDto.firstName());
        user.setLastName(userDto.lastName());
        user.setEmailVerified(true);
        user.setEnabled(true);
        user.setCredentials(List.of(credential));
        return user;
    }

    private String extractUserIdFromLocation(Response response) {
        return response.getHeaderString("Location").substring(response.getHeaderString("Location").lastIndexOf("/") + 1);
    }

    public void assignClientRole(String userId, String roleName) {
        var realmResource = keycloak.realm(targetRealm);

        String clientUuid = realmResource.clients()
                .findByClientId(clientId)
                .stream()
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Client not found: " + clientId))
                .getId();

        RoleRepresentation role = realmResource.clients()
                .get(clientUuid)
                .roles()
                .get(roleName)
                .toRepresentation();

        realmResource.users()
                .get(userId)
                .roles()
                .clientLevel(clientUuid)
                .add(List.of(role));
    }
}