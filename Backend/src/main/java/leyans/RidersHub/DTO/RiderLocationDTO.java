package leyans.RidersHub.DTO;

import java.time.LocalDateTime;

public class RiderLocationDTO {

    private Integer rideId;
    private double latitude;
    private double longitude;
    private double distanceMeters;
    private LocalDateTime timestamp;
    public RiderLocationDTO(Integer id, Integer rideId, double latitude, double longitude, double distanceMeters, LocalDateTime timestamp) {

        this.rideId = rideId;
        this.latitude = latitude;
        this.longitude = longitude;
        this.distanceMeters = distanceMeters;
        this.timestamp = timestamp;
    }
    public RiderLocationDTO() {
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

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
