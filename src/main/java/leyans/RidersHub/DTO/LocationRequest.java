package leyans.RidersHub.DTO;

public class LocationRequest {

    private String locationName;
    private String latitude;
    private String longitude;
    private String username;

    public String getRider() {
        return username;
    }

    public void setRider(String username) {
        this.username = username;
    }

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public String getLatitude() {
        return latitude;
    }

    public void setLatitude(String latitude) {
        this.latitude = latitude;
    }

    public String getLongitude() {
        return longitude;
    }

    public void setLongitude(String longitude) {
        this.longitude = longitude;
    }
}