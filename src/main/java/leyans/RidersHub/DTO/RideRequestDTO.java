package leyans.RidersHub.DTO;

import java.sql.Date;

public class RideRequestDTO {

    private String username;
    private String ridesName;
    private String locationName;
    private String riderType;
    private Integer distance;
    private String startingPoint;
    private Date date;
    private double latitude;
    private double longitude;

    public RideRequestDTO(String username, String ridesName, String locationName, String riderType, Integer distance, String startingPoint, Date date, double latitude, double longitude) {
        this.username = username;
        this.ridesName = ridesName;
        this.locationName = locationName;
        this.riderType = riderType;
        this.distance = distance;
        this.startingPoint = startingPoint;
        this.date = date;
        this.latitude = latitude;
        this.longitude = longitude;

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

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
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
