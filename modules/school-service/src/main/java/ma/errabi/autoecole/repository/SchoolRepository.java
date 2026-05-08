package ma.errabi.autoecole.repository;

import ma.errabi.autoecole.domain.School;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SchoolRepository  extends JpaRepository<School, UUID> {

    @EntityGraph(attributePaths = {"students", "instructors"})
    Optional<School> findByEmail(String email);
}
