package leyans.RidersHub.Config.KafkaConfig.KafkaREST.DTO;

public class LocationResponseDTO {
    private Integer locationId;
    private String username;
    private String locationName;
    // A simple representation of coordinates (e.g., "longitude,latitude")
    private String point;

    public LocationResponseDTO() {}

    public LocationResponseDTO(Integer locationId, String username, String locationName, String point) {
        this.locationId = locationId;
        this.username = username;
        this.locationName = locationName;
        this.point = point;
    }

    // Getters and setters
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
