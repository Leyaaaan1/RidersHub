package leyans.RidersHub.DTO;

import leyans.RidersHub.model.Rides;

import java.time.LocalDateTime;

public class RideResponseDTO {

    private Long rideId;
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

    public LocalDateTime getDate() {
        return date;
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

    public  RideResponseDTO(){}

    public RideResponseDTO(Rides ride) {
        this.ridesName = ride.getRidesName();
        this.locationName = ride.getLocationName();
        this.riderType = ride.getRiderType().getRiderType();
        this.distance = ride.getDistance();
        this.startingPoint = ride.getStartingPoint();
        this.date = date;
        this.endingPoint = ride.getEndingPoint();
    }

    public RideResponseDTO(String locationName, String endingPoint, String username, String locationName1, String pointStr, String ridesName, String riderType, Integer distance, String startingPoint, LocalDateTime date) {
    }

    public RideResponseDTO(RidesDTO ridesDTO, String pointStr) {
    }

    public RideResponseDTO(String ridesName, String locationName, Integer distance, String startingPoint, String endingPoint, LocalDateTime date, double latitude, double longitude) {
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public String getEndingPoint() {
        return endingPoint;
    }

    public void setEndingPoint(String endingPoint) {
        this.endingPoint = endingPoint;
    }

    public Long getRideId() {
        return rideId;
    }

    public void setRideId(Long rideId) {
        this.rideId = rideId;
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


}
