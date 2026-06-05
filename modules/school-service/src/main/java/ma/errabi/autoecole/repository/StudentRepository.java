package ma.errabi.autoecole.repository;

import ma.errabi.autoecole.domain.Student;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository  extends JpaRepository<Student,Long> {

    @EntityGraph(attributePaths = {"school","payments"})
    Optional<Student> getStudentsByUserId(String userId);
}
