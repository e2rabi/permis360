package ma.errabi.autoecole.stub;

import ma.errabi.sdk.dto.GeoLocationDTO;
import ma.errabi.sdk.dto.SchoolDto;
import ma.errabi.sdk.types.SchoolStatus;

public class SchoolDtoTestData {

    public static SchoolDto getSchoolDto() {
        return new SchoolDto(1L, "test@test.com",
                "Test School", "123456789",
                "Test Address", "logo",
                "Test Description", "facebook/test", "instgram/test", SchoolStatus.OPEN,
            new GeoLocationDTO(1L, 1.0, 1.0), "+212600000000",
                "+212600000001", null, null);
    }
    public static SchoolDto getSchoolWithoutLogo(){
        return getSchoolDto().withLogo(null);
    }
}