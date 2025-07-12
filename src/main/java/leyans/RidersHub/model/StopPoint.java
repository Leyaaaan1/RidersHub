package leyans.RidersHub.model;


import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import org.locationtech.jts.geom.Point;
import java.awt.*;

@Embeddable
public class StopPoint {


    private String stopName;
    @Column(name = "stop_location", columnDefinition = "geometry(Point,4326)")
    private Point stopLocation;

    public StopPoint() {

    }

    public StopPoint(String stopName, Point stopLocation) {
        this.stopName = stopName;
        this.stopLocation = stopLocation;


    }

    public String getStopName() {
        return stopName;
    }

    public void setStopName(String stopName) {
        this.stopName = stopName;
    }

    public Point getStopLocation() {
        return stopLocation;
    }

    public void setStopLocation(Point stopLocation) {
        this.stopLocation = stopLocation;
    }
}



