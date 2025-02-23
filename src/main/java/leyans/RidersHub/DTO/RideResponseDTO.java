package leyans.RidersHub.DTO;

import leyans.RidersHub.model.Rides;

import java.sql.Date;

public class RideResponseDTO {

    private Long rideId;
    private String username;
    private String ridesName;
    private String locationName;
    private String riderType;
    private Integer distance;
    private String startingPoint;
    private String coordinates;
    private Date date;

    public RideResponseDTO(Rides ride) {
        this.ridesName = ride.getRidesName();
        this.locationName = ride.getLocationName();
        this.riderType = ride.getRiderType().getRiderType();
        this.distance = ride.getDistance();
        this.startingPoint = ride.getStartingPoint();
        this.coordinates = ride.getCoordinates().toString();
        this.date = (Date) ride.getDate();
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

    public String getCoordinates() {
        return coordinates;
    }

    public void setCoordinates(String coordinates) {
        this.coordinates = coordinates;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }
}
