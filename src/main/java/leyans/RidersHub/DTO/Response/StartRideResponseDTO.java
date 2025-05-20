package leyans.RidersHub.DTO.Response;

import java.time.LocalDateTime;

public class StartRideResponseDTO {
    private Integer rideId;
    private String ridesName;
    private String locationName;
    private LocalDateTime startTime;

    public StartRideResponseDTO(Integer rideId, String ridesName, String locationName, LocalDateTime startTime) {
        this.rideId = rideId;
        this.ridesName = ridesName;
        this.locationName = locationName;
        this.startTime = startTime;
    }

    // Getters and setters
    public Integer getRideId() {
        return rideId;
    }

    public void setRideId(Integer rideId) {
        this.rideId = rideId;
    }

    public String getRidesName() {
        return ridesName;
    }

    public void setRidesName(String ridesName) {
        this.ridesName = ridesName;
    }

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }
}