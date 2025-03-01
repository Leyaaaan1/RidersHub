package leyans.RidersHub.model.Dynamic;


import jakarta.persistence.*;
import leyans.RidersHub.model.PointConverter;
import leyans.RidersHub.model.Rider;
import org.locationtech.jts.geom.Point;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "locations")
public class Locations {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "locationId")
    private Integer locationId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "username", referencedColumnName = "username")
    private Rider rider;

    @Column(name = "locationName", nullable = false)
    private String locationName;

//   // @Column(nullable = false, columnDefinition = "geometry(Point,4326)")
//    //@JdbcTypeCode(SqlTypes.OTHER)
//   @Convert(converter = PointConverter.class)
//   @Column(columnDefinition = "TEXT")
//   private Point coordinates;



    @Column(name = "latitude", nullable = false)
    private double latitude;  // Store latitude separately

    @Column(name = "longitude", nullable = false)
    private double longitude; // Store longitude separately

//    @Column(name = "ride_date", nullable = false)
//    private LocalDateTime date = LocalDateTime.now();

    public Locations() {
    }

    public Locations(Integer locationId, Rider rider, String locationName, double latitude, double longitude) {
        this.locationId = locationId;
        this.rider = rider;
        this.locationName = locationName;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public Locations(Rider rider, String locationName, double latitude, double longitude) {
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

    public Integer getLocationId() { return locationId; }
    public void setLocationId(Integer locationId) { this.locationId = locationId; }

    public Rider getRider() { return rider; }
    public void setRider(Rider rider) { this.rider = rider; }

    public String getLocationName() { return locationName; }
    public void setLocationName(String locationName) { this.locationName = locationName; }

}
