package leyans.RidersHub.DTO.Response;

import leyans.RidersHub.model.Rider;
import leyans.RidersHub.model.RiderType;

import java.time.LocalDateTime;
import java.util.List;

public class RideResponseDTO {

    private String username;
    private String ridesName;
    private String locationName;
    private String riderType;
    private Integer distance;
    private String startingPoint;
    private String endingPoint;
    private LocalDateTime date;
    private double latitude;
    private double longitude;
    List<String> participants;


    public RideResponseDTO(String locationName, String ridesName, Rider username, RiderType riderType,
                           Integer distance, String startingPoint, String endingPoint, LocalDateTime
                                   date, double latitude, double longitude, List<String> participants) {
        this.locationName = locationName;
        this.ridesName = ridesName;
        this.username = username.getUsername();
        this.riderType = riderType.getRiderType();
        this.distance = distance;
        this.startingPoint = startingPoint;
        this.endingPoint = endingPoint;
        this.date = date;
        this.latitude = latitude;
        this.longitude = longitude;
        this.participants = participants;

    }

    public List<String> getParticipants() {
        return participants;
    }

    public void setParticipants(List<String> participants) {
        this.participants = participants;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
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

    public String getRiderType() {
        return riderType;
    }

    public void setRiderType(String riderType) {
        this.riderType = riderType;
    }

    public Integer getDistance() {
        return distance;
    }

    public void setDistance(Integer distance) {
        this.distance = distance;
    }

    public String getStartingPoint() {
        return startingPoint;
    }

    public void setStartingPoint(String startingPoint) {
        this.startingPoint = startingPoint;
    }

    public String getEndingPoint() {
        return endingPoint;
    }

    public void setEndingPoint(String endingPoint) {
        this.endingPoint = endingPoint;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
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
}
