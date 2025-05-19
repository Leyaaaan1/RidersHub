package leyans.RidersHub.DTO;

public class NearbyRiderDTO {
    private Long id;
    private String riderUsername;
    private String locationName;
    private double latitude;
    private double longitude;
    private double distanceInMeters;

    public NearbyRiderDTO() {
    }

    public NearbyRiderDTO(Long id, String riderUsername, String locationName,
                          double latitude, double longitude, double distanceInMeters) {
        this.id = id;
        this.riderUsername = riderUsername;
        this.locationName = locationName;
        this.latitude = latitude;
        this.longitude = longitude;
        this.distanceInMeters = distanceInMeters;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRiderUsername() {
        return riderUsername;
    }

    public void setRiderUsername(String riderUsername) {
        this.riderUsername = riderUsername;
    }

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public double getDistanceInMeters() {
        return distanceInMeters;
    }

    public void setDistanceInMeters(double distanceInMeters) {
        this.distanceInMeters = distanceInMeters;
    }
}