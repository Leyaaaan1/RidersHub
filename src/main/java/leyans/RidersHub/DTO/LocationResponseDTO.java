package leyans.RidersHub.DTO;

import java.sql.Time;
import java.sql.Timestamp;

//LocationResponseDTO  more detailed version of LocationDTO ,
//DTOs for the REST response (LocationResponseDTO).
// two DTO For maintainability and clear separation of concerns
public class LocationResponseDTO {
    private Integer locationId;
    private String username;
    private String locationName;
    private String point;

    public LocationResponseDTO() {}

    public LocationResponseDTO(Integer locationId, String username, String locationName, String point) {
        this.locationId = locationId;
        this.username = username;
        this.locationName = locationName;
        this.point = point;
    }

    public Integer getLocationId() {
        return locationId;
    }
    public void setLocationId(Integer locationId) {
        this.locationId = locationId;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getLocationName() {
        return locationName;
    }
    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }
    public String getPoint() {
        return point;
    }
    public void setPoint(String point) {
        this.point = point;
    }
}
