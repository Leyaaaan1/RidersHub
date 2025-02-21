package leyans.RidersHub.Config.KafkaConfig.KafkaREST.DTO;

public class LocationDTO {
    private String username;
    private String locationName;
    private String point;

    public LocationDTO() {}

    public LocationDTO(String username, String locationName, String point) {
        this.username = username;
        this.locationName = locationName;
        this.point = point;
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
