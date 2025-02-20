package leyans.RidersHub.model;
import org.locationtech.jts.geom.Point;
import jakarta.persistence.*;

@Entity
public class GeomesaLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "geoLocationId", unique = true, nullable = false)
    private Integer geoLocationId;

    @Column(name = "location", nullable = false)
    private Point location;

    @Column(name = "latitude", nullable = false)
    private double latitude;

    @Column(name = "longtitude", nullable = false)
    private double longitude;


    public GeomesaLocation() {}

    public GeomesaLocation(Integer geoLocationId, Point location, double latitude, double longitude) {
        this.geoLocationId = geoLocationId;
        this.location = location;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public Integer getGeoLocationId() {
        return geoLocationId;
    }

    public void setGeoLocationId(Integer geoLocationId) {
        this.geoLocationId = geoLocationId;
    }

    public Point getLocation() {
        return location;
    }

    public void setLocation(Point location) {
        this.location = location;
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
