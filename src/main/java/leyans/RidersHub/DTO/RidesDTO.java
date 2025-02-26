package leyans.RidersHub.DTO;

import java.awt.*;
import java.sql.Date;

public class RidesDTO {
    private String username;
    private String ridesName;
    private String locationName;
    private String riderType;
    private Integer distance;
    private String startingPoint;
    private Date date;
    private Point coordinates;

    public RidesDTO() {}

    public RidesDTO(String username, String ridesName, String locationName, String riderType, Integer distance, String startingPoint, Date date, Point coordinates) {
        this.username = username;
        this.ridesName = ridesName;
        this.locationName = locationName;
        this.riderType = riderType;
        this.distance = distance;
        this.startingPoint = startingPoint;
        this.date = date;
        this.coordinates = coordinates;
    }

    public RidesDTO(String username, String locationName, String pointStr, String ridesName, String riderType, Integer distance, String startingPoint, java.util.Date date) {
    }

    public RidesDTO(String username, String locationName, String ridesName, String riderType, Integer distance, String startingPoint, java.util.Date date) {
    }

    public Point getCoordinates() {
        return coordinates;
    }

    public void setCoordinates(Point coordinates) {
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
