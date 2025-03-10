package leyans.RidersHub.model;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.locationtech.jts.geom.Point;

import java.time.LocalDateTime;
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

////    @Column(nullable = false, columnDefinition = "geometry(Point,4326)")
////    @JdbcTypeCode(SqlTypes.OTHER)
//    @Convert(converter = PointConverter.class)
//   @Column(columnDefinition = "TEXT")
//    private Point coordinates;

    @Column(name = "locationName", nullable = false)
    private String locationName;


    @Column(name = "ridesName", nullable = false)
    private String ridesName;


    @Column(name = "latitude", nullable = false)
    private double latitude;  // Store latitude separately

    @Column(name = "longitude", nullable = false)
    private double longitude; // Store longitude separately

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

    @ManyToOne
    @JoinColumn(name = "username", referencedColumnName = "username", nullable = false)
    private Rider username;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "rider_type", referencedColumnName = "rider_type", nullable = false)
    private RiderType riderType;

    @Column(name = "distance", nullable = false)
    private Integer distance;

    @Column(name = "endingPoint", nullable = false)
    private String endingPoint;

    @Column(name = "startingPoint", nullable = false)
    private String startingPoint;

    @Column(name = "ride_date", nullable = false)
    private LocalDateTime date;


    public Rides() {
    }

    public Rides(Integer ridesId, String locationName, String ridesName, double latitude, double longitude, Rider username, RiderType riderType, Integer distance, String endingPoint, String startingPoint, LocalDateTime date) {
        this.ridesId = ridesId;
        this.locationName = locationName;
        this.ridesName = ridesName;
        this.latitude = latitude;
        this.longitude = longitude;
        this.username = username;
        this.riderType = riderType;
        this.distance = distance;
        this.endingPoint = endingPoint;
        this.startingPoint = startingPoint;
        this.date = date;
    }


    public Integer getRidesId() {
        return ridesId;
    }

    public void setRidesId(Integer ridesId) {
        this.ridesId = ridesId;
    }

    public String getEndingPoint() {
        return endingPoint;
    }

    public void setEndingPoint(String endingPoint) {
        this.endingPoint = endingPoint;
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

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }
}
