package leyans.RidersHub.DTO;

import java.sql.Date;
import java.time.LocalDateTime;

public class RidesDTO {
    private String username;
    private String ridesName;
    private String locationName;
    private String riderType;
    private Integer distance;
    private String startingPoint;
    private String endingPoint;
    private Date date;
    private String coordinates;

    public RidesDTO(String username, String ridesName, String locationName, String riderType, Integer distance, String startingPoint, String endingPoint, LocalDateTime date, String pointStr) {}


    public RidesDTO(String username, String ridesName, String locationName, String riderType, Integer distance, String startingPoint, String endingPoint, Date date, String pointStr) {
        this.username = username;
        this.ridesName = ridesName;
        this.locationName = locationName;
        this.riderType = riderType;
        this.distance = distance;
        this.startingPoint = startingPoint;
        this.date = date;
        this.coordinates = coordinates;
        this.endingPoint = endingPoint;

    }

    public RidesDTO() {

    }

    public String getEndingPoint() {
        return endingPoint;
    }

    public void setEndingPoint(String endingPoint) {
        this.endingPoint = endingPoint;
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

    public String getStartingPoint() {
        return startingPoint;
    }

    public void setStartingPoint(String startingPoint) {
        this.startingPoint = startingPoint;
    }

    public Integer getDistance() {
        return distance;
    }

    public void setDistance(Integer distance) {
        this.distance = distance;
    }

    public String getRiderType() {
        return riderType;
    }

    public void setRiderType(String riderType) {
        this.riderType = riderType;
    }

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public String getRidesName() {
        return ridesName;
    }

    public void setRidesName(String ridesName) {
        this.ridesName = ridesName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }


}
