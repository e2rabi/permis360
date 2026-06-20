package ma.errabi.appointment.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StudentServiceClient {

    public boolean verifyCandidateExists(Long studentId){
        return true;
    }
}
