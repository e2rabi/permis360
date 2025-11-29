package ma.errabi.siyaka.repository;

import ma.errabi.siyaka.domain.School;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SchoolRepository  extends JpaRepository<School,Long> {
}
