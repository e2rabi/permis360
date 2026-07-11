package ma.errabi.autoecole.util;

import org.keycloak.representations.idm.UserRepresentation;
import org.keycloak.representations.idm.CredentialRepresentation;
import java.util.List;


public class UserRepresentationBuilder {
    private final UserRepresentation user = new UserRepresentation();

    public static UserRepresentationBuilder create() {
        return new UserRepresentationBuilder();
    }

    public UserRepresentationBuilder username(String username) {
        user.setUsername(username);
        return this;
    }

    public UserRepresentationBuilder email(String email) {
        user.setEmail(email);
        return this;
    }

    public UserRepresentationBuilder emailVerified(boolean emailVerified) {
        user.setEmailVerified(emailVerified);
        return this;
    }

    public UserRepresentationBuilder credentials(List<CredentialRepresentation> credentials) {
        user.setCredentials(credentials);
        return this;
    }
    public UserRepresentationBuilder firstName(String firstName) {
        user.setFirstName(firstName);
        return this;
    }

    public UserRepresentationBuilder lastName(String lastName) {
        user.setLastName(lastName);
        return this;
    }

    public UserRepresentationBuilder enabled(boolean enabled) {
        user.setEnabled(enabled);
        return this;
    }

    public UserRepresentation build() {
        return this.user;
    }
}