package ma.errabi.autoecole.repository;

import ma.errabi.autoecole.domain.Instructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InstructorRepository extends JpaRepository<Instructor,Long> {
}
