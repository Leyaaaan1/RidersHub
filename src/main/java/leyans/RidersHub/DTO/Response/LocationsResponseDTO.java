package leyans.RidersHub.DTO.Response;

import leyans.RidersHub.model.RideLocation;

import java.time.LocalDateTime;

public class LocationsResponseDTO {
    private Long id;
    private String locationName;
    private String riderUsername;
    private double latitude;
    private double longitude;
    private boolean started;
    private LocalDateTime lastUpdated;
    private String currentRideId;

    public LocationsResponseDTO() {
    }

    public LocationsResponseDTO(Long id, String locationName, String riderUsername,
                               double latitude, double longitude,
                               boolean started, LocalDateTime lastUpdated,
                               String currentRideId) {
        this.id = id;
        this.locationName = locationName;
        this.riderUsername = riderUsername;
        this.latitude = latitude;
        this.longitude = longitude;
        this.started = started;
        this.lastUpdated = lastUpdated;
        this.currentRideId = currentRideId;
    }

    // Factory method to create from entity
    public static LocationsResponseDTO fromEntity(RideLocation rideLocation) {
        return new LocationsResponseDTO(
                rideLocation.getId(),
                rideLocation.getLocationName(),
                rideLocation.getRider().getUsername(),
                rideLocation.getLatitude(),
                rideLocation.getLongitude(),
                rideLocation.isStarted(),
                rideLocation.getLastUpdated(),
                rideLocation.getCurrentRideId()
        );
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public String getRiderUsername() {
        return riderUsername;
    }

    public void setRiderUsername(String riderUsername) {
        this.riderUsername = riderUsername;
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

    public boolean isStarted() {
        return started;
    }

    public void setStarted(boolean started) {
        this.started = started;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public String getCurrentRideId() {
        return currentRideId;
    }

    public void setCurrentRideId(String currentRideId) {
        this.currentRideId = currentRideId;
    }
}