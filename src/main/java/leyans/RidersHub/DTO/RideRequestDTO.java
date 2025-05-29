package leyans.RidersHub.DTO;

import leyans.RidersHub.model.Rider;

import java.time.LocalDateTime;
import java.util.List;

public class RideRequestDTO {

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
    private List<String> participants;
    private String description;


    public RideRequestDTO(String username, List<String> participants, String description, String ridesName, String endingPoint, String locationName, String riderType, Integer distance, String startingPoint, LocalDateTime date, double latitude, double longitude) {
        this.username = username;
        this.ridesName = ridesName;
        this.description = description;
        this.locationName = locationName;
        this.riderType = riderType;
        this.distance = distance;
        this.startingPoint = startingPoint;
        this.date = date;
        this.latitude = latitude;
        this.longitude = longitude;
        this.endingPoint = endingPoint;
        this.participants = participants;


    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getParticipants() {
        return participants;
    }

    public void setParticipants(List<String> participants) {
        this.participants = participants;
    }


    public String getEndingPoint() {
        return endingPoint;
    }

    public void setEndingPoint(String endingPoint) {
        this.endingPoint = endingPoint;
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
