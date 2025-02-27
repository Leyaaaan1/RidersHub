package leyans.RidersHub.model;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.locationtech.jts.geom.Point;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "event_rides")
public class Rides {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ridesId", nullable  = false)
    private Integer ridesId;

//    @Column(nullable = false, columnDefinition = "geometry(Point,4326)")
//    @JdbcTypeCode(SqlTypes.OTHER)
    @Convert(converter = PointConverter.class)
   @Column(columnDefinition = "TEXT")
    private Point coordinates;

    @Column(name = "locationName", nullable = false)
    private String locationName;


    @Column(name = "ridesName", nullable = false, unique = true)
    private String ridesName;


    @ManyToOne
    @JoinColumn(name = "username", referencedColumnName = "username", nullable = false)
    private Rider username;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "rider_type", referencedColumnName = "rider_type", nullable = false)
    private RiderType riderType;

    @Column(name = "distance", nullable = false)
    private Integer distance;

    @Column(name = "startingPoint", nullable = false)
    private String startingPoint;

    @Column(name = "date", nullable = false)
    private Date date;

    public Rides() {
    }


    public Rides(Integer ridesId, Point coordinates, String locationName, String ridesName, Rider username, RiderType riderType, Integer distance, String startingPoint, Date date) {
        this.ridesId = ridesId;
        this.coordinates = coordinates;
        this.locationName = locationName;
        this.ridesName = ridesName;
        this.username = username;
        this.riderType = riderType;
        this.distance = distance;
        this.startingPoint = startingPoint;
        this.date = date;
    }

    public Integer getRidesId() {
        return ridesId;
    }



    public void setRidesId(Integer ridesId) {
        this.ridesId = ridesId;
    }

    public Point getCoordinates() {
        return coordinates;
    }

    public void setCoordinates(Point coordinates) {
        this.coordinates = coordinates;
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

    public Rider getUsername() {
        return username;
    }

    public void setUsername(Rider username) {
        this.username = username;
    }

    public RiderType getRiderType() {
        return riderType;
    }

    public void setRiderType(RiderType riderType) {
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
}
