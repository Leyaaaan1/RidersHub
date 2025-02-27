package leyans.RidersHub.Service;

import java.awt.*;
import java.util.Date;

public class CoordinateResponseDTO {

    private Point userCoordinate;
    private Point pairedCoordinates;
    private Date date;
    private String Status;
    private String username1;
    private String username2;

    public CoordinateResponseDTO(Point userCoordinate, Point pairedCoordinates, Date date, String status, String username1, String username2) {
        this.userCoordinate = userCoordinate;
        this.pairedCoordinates = pairedCoordinates;
        this.date = date;
        Status = status;
        this.username1 = username1;
        this.username2 = username2;
    }


    public Point getUserCoordinate() {
        return userCoordinate;
    }

    public void setUserCoordinate(Point userCoordinate) {
        this.userCoordinate = userCoordinate;
    }

    public Point getPairedCoordinates() {
        return pairedCoordinates;
    }

    public void setPairedCoordinates(Point pairedCoordinates) {
        this.pairedCoordinates = pairedCoordinates;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getStatus() {
        return Status;
    }

    public void setStatus(String status) {
        Status = status;
    }

    public String getUsername1() {
        return username1;
    }

    public void setUsername1(String username1) {
        this.username1 = username1;
    }

    public String getUsername2() {
        return username2;
    }

    public void setUsername2(String username2) {
        this.username2 = username2;
    }
}
