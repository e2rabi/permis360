package ma.errabi.autoecole.util;

import org.keycloak.representations.idm.CredentialRepresentation;

public class CredentialRepresentationBuilder {
    private final CredentialRepresentation user = new CredentialRepresentation();


    public static CredentialRepresentationBuilder create() {
        return new CredentialRepresentationBuilder();
    }
    public CredentialRepresentationBuilder type(String type) {
        user.setType(type);
        return this;
    }

    public CredentialRepresentationBuilder value(String value) {
        user.setValue(value);
        return this;
    }
    public CredentialRepresentationBuilder temporary(Boolean temporary) {
        user.setTemporary(temporary);
        return this;
    }
    public CredentialRepresentation build() {
        return this.user;
    }
}
