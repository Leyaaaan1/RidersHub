package leyans.RidersHub.DTO;

public class LocationUpdateRequestDTO {
    private Integer rideId;
    private double latitude;
    private double longitude;
    private double distanceMeters;

    public LocationUpdateRequestDTO(Integer rideId, double latitude, double longitude, double distanceMeters) {
        this.rideId = rideId;
        this.latitude = latitude;
        this.longitude = longitude;
        this.distanceMeters = distanceMeters;
    }

    public LocationUpdateRequestDTO(double distanceMeters) {
        this.distanceMeters = distanceMeters;

    }

    public Integer getRideId() {
        return rideId;
    }

    public void setRideId(Integer rideId) {
        this.rideId = rideId;
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

    public double getDistanceMeters() {
        return distanceMeters;
    }

    public void setDistanceMeters(double distanceMeters) {
        this.distanceMeters = distanceMeters;
    }
}