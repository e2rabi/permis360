package ma.errabi.autoecole.service;

import jakarta.ws.rs.core.Response;
import ma.errabi.sdk.dto.UserDto;
import ma.errabi.sdk.exception.ResourceNotFoundException;
import ma.errabi.sdk.exception.TechnicalException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.*;
import org.keycloak.representations.idm.ClientRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class KeycloakServiceTest {

    @Mock
    private Keycloak keycloak;

    @Mock private RealmResource realmResource;
    @Mock private UsersResource usersResource;
    @Mock private UserResource userResource;
    @Mock private ClientsResource clientsResource;
    @Mock private ClientResource clientResource;
    @Mock private RolesResource rolesResource;
    @Mock private RoleResource roleResource;
    @Mock private RoleMappingResource roleMappingResource;
    @Mock private RoleScopeResource roleScopeResource;
    @Mock private Response response;
    @Mock private Response.StatusType statusType;

    @InjectMocks
    private KeycloakService keycloakService;

    private final String targetRealm = "test-realm";
    private final String clientId = "test-client";

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(keycloakService, "targetRealm", targetRealm);
        ReflectionTestUtils.setField(keycloakService, "clientId", clientId);
    }

    @Test
    @DisplayName("Should successfully create a user and assign a client role")
    void createUser_ShouldCreateUserAndAssignRoleSuccessfully() {
        // Arrange
        UserDto userDto = mock(UserDto.class);
        when(userDto.username()).thenReturn("jdoe");
        when(userDto.email()).thenReturn("jdoe@example.com");
        when(userDto.firstName()).thenReturn("John");
        when(userDto.lastName()).thenReturn("Doe");
        when(userDto.password()).thenReturn("securePass123");

        String createdUserId = "user-uuid-123";
        String clientUuid = "client-uuid-456";

        when(keycloak.realm(targetRealm)).thenReturn(realmResource);
        when(realmResource.users()).thenReturn(usersResource);
        when(usersResource.create(any(UserRepresentation.class))).thenReturn(response);
        when(response.getStatus()).thenReturn(201);
        when(response.getHeaderString("Location"))
                .thenReturn("http://localhost:8080/admin/realms/test-realm/users/" + createdUserId);

        ClientRepresentation clientRepresentation = new ClientRepresentation();
        clientRepresentation.setId(clientUuid);
        
        when(realmResource.clients()).thenReturn(clientsResource);
        when(clientsResource.findByClientId(clientId)).thenReturn(List.of(clientRepresentation));
        
        when(clientsResource.get(clientUuid)).thenReturn(clientResource);
        when(clientResource.roles()).thenReturn(rolesResource);
        
        RoleRepresentation roleRepresentation = new RoleRepresentation();
        roleRepresentation.setName("ROLE_API_CORE");
        when(rolesResource.get(anyString())).thenReturn(roleResource);
        when(roleResource.toRepresentation()).thenReturn(roleRepresentation);
        
        when(usersResource.get(createdUserId)).thenReturn(userResource);
        when(userResource.roles()).thenReturn(roleMappingResource);
        when(roleMappingResource.clientLevel(clientUuid)).thenReturn(roleScopeResource);

        // Act
        String result = keycloakService.createUser(userDto);

        // Assert
        assertEquals(createdUserId, result);
        
        // Verify user creation was triggered
        verify(usersResource).create(any(UserRepresentation.class));
        // Verify the client role mapping was added
        verify(roleScopeResource).add(List.of(roleRepresentation));
    }

    @Test
    @DisplayName("Should throw TechnicalException when Keycloak user creation fails")
    void createUser_WhenKeycloakReturnsNon201_ShouldThrowTechnicalException() {
        // Arrange
        UserDto userDto = mock(UserDto.class);
        when(userDto.username()).thenReturn("jdoe");
        when(userDto.password()).thenReturn("securePass123");

        when(keycloak.realm(targetRealm)).thenReturn(realmResource);
        when(realmResource.users()).thenReturn(usersResource);
        when(usersResource.create(any(UserRepresentation.class))).thenReturn(response);
        
        when(response.getStatus()).thenReturn(409); // Conflict (e.g., user exists)
        when(response.getStatusInfo()).thenReturn(statusType);
        when(statusType.toString()).thenReturn("Conflict");

        // Act & Assert
        TechnicalException exception = assertThrows(TechnicalException.class, 
                () -> keycloakService.createUser(userDto));
                
        assertTrue(exception.getMessage().contains("Failed to create user"));
        
        // Verify we never attempted to assign roles
        verify(realmResource, never()).clients();
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException if the configured Keycloak Client is missing")
    void assignClientRole_WhenClientDoesNotExist_ShouldThrowResourceNotFoundException() {
        // Arrange
        String userId = "user-uuid-123";
        String roleName = "SOME_ROLE";
        
        when(keycloak.realm(targetRealm)).thenReturn(realmResource);
        when(realmResource.clients()).thenReturn(clientsResource);
        
        when(clientsResource.findByClientId(clientId)).thenReturn(Collections.emptyList());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, 
                () -> keycloakService.assignClientRole(userId, roleName));
                
        assertEquals("Client not found: " + clientId, exception.getMessage());
        
        verify(clientsResource, never()).get(anyString());
    }
}