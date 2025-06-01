package leyans.RidersHub.DTO;

import leyans.RidersHub.model.Rider;

import java.time.LocalDateTime;

public class LocationUpdateRequestDTO {
    private Integer rideId;
    private double latitude;
    private double longitude;

    private String locationName;
    private double distanceMeters;

    private String initiator;


    public LocationUpdateRequestDTO(Integer rideId, String initiator, double latitude, double longitude, String locationName, double distanceMeters, LocalDateTime timestamp) {
        this.rideId = rideId;
        this.initiator = initiator;
        this.latitude = latitude;
        this.longitude = longitude;
        this.distanceMeters = distanceMeters;
        this.locationName = locationName;
    }

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public String getInitiator() {
        return initiator;
    }

    public void setInitiator(String initiator) {
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