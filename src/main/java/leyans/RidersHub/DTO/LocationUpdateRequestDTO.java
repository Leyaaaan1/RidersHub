package leyans.RidersHub.DTO;

import leyans.RidersHub.model.Rider;

import java.time.LocalDateTime;

public class LocationUpdateRequestDTO {
    private Integer rideId;
    private double latitude;
    private double longitude;
    private double distanceMeters;

    private Rider initiator;


    public LocationUpdateRequestDTO(Integer rideId, Rider initiator, double latitude, double longitude, double distanceMeters, LocalDateTime timestamp) {
        this.rideId = rideId;
        this.initiator = initiator;
        this.latitude = latitude;
        this.longitude = longitude;
        this.distanceMeters = distanceMeters;
    }

    public Rider getInitiator() {
        return initiator;
    }

    public void setInitiator(Rider initiator) {
        this.initiator = initiator;
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