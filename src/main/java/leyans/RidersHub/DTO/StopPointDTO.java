package leyans.RidersHub.DTO;

import java.awt.*;

public class StopPointDTO {

    private double stopLatitude;
    private double stopLongitude;

    private Point stopName;

    public StopPointDTO() {
    }

    public StopPointDTO(double stopLatitude, double stopLongitude, Point stopName) {
        this.stopLatitude = stopLatitude;
        this.stopLongitude = stopLongitude;
        this.stopName = stopName;
    }

    public Point getStopName() {
        return stopName;
    }

    public void setStopName(Point stopName) {
        this.stopName = stopName;
    }

    public double getStopLatitude() {
        return stopLatitude;
    }

    public void setStopLatitude(double stopLatitude) {
        this.stopLatitude = stopLatitude;
    }

    public double getStopLongitude() {
        return stopLongitude;
    }

    public void setStopLongitude(double stopLongitude) {
        this.stopLongitude = stopLongitude;
    }


}
