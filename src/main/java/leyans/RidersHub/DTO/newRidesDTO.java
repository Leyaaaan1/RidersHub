package leyans.RidersHub.DTO;

public class newRidesDTO {
    private String username;
    private String locationName;
    private double latitude;
    private double longitude;

    public newRidesDTO() {}

    public newRidesDTO(String username, String locationName, double latitude, double longitude) {
        this.username = username;
        this.locationName = locationName;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getLocationName() { return locationName; }
    public void setLocationName(String locationName) { this.locationName = locationName; }

    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }

    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }
}
