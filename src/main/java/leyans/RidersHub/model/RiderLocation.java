package leyans.RidersHub.model;

import jakarta.persistence.*;
import org.locationtech.jts.geom.Point;
import java.time.LocalDateTime;

import java.awt.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "rider_locations")
public class RiderLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "started_ride_id", referencedColumnName = "id", nullable = false)
    private StartedRide startedRide;

    @Column(name = "location", columnDefinition = "geometry(Point,4326)", nullable = false)
    private Point location;


    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;

    public RiderLocation(Integer id, StartedRide startedRide, Point location, LocalDateTime timestamp) {
        this.id = id;
        this.startedRide = startedRide;
        this.location = location;
        this.timestamp = timestamp;
    }

    public RiderLocation() {

    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public StartedRide getStartedRide() {
        return startedRide;
    }

    public void setStartedRide(StartedRide startedRide) {
        this.startedRide = startedRide;
    }

    public Point getLocation() {
        return location;
    }

    public void setLocation(Point location) {
        this.location = location;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
