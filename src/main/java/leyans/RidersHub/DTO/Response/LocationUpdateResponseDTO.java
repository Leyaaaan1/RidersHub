package leyans.RidersHub.DTO.Response;

public class LocationUpdateResponseDTO {
    private Integer rideId;
    private double latitude;
    private double longitude;
    private double distanceMeters;

    public LocationUpdateResponseDTO(Integer rideId, double latitude, double longitude, double distanceMeters) {
        this.rideId = rideId;
        this.latitude = latitude;
        this.longitude = longitude;
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