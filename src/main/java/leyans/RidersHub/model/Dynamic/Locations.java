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

   // @Column(nullable = false, columnDefinition = "geometry(Point,4326)")
    //@JdbcTypeCode(SqlTypes.OTHER)
   @Convert(converter = PointConverter.class)
   @Column(columnDefinition = "TEXT")
   private Point coordinates;

//    @Column(name = "ride_date", nullable = false)
//    private LocalDateTime date = LocalDateTime.now();

    public Locations() {
    }




    public Locations(Rider rider, String locationName, Point coordinates) {
        this.rider = rider;
        this.locationName = locationName;
        this.coordinates = coordinates;
    }


    public Integer getLocationId() { return locationId; }
    public void setLocationId(Integer locationId) { this.locationId = locationId; }

    public Rider getRider() { return rider; }
    public void setRider(Rider rider) { this.rider = rider; }

    public String getLocationName() { return locationName; }
    public void setLocationName(String locationName) { this.locationName = locationName; }

    public Point getCoordinates() { return coordinates; }
    public void setCoordinates(Point coordinates) { this.coordinates = coordinates; }
}
