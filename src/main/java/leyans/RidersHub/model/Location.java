package leyans.RidersHub.model;

import jakarta.persistence.*;

import java.awt.*;

@Entity
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "locationId", unique = true, nullable = false)
    private Integer locationId;

   // @Column(columnDefinition = "geometry(Point, 4325)")

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "username", referencedColumnName = "username", nullable = false)
    private Rider usernamae;


    @Column(name = "location", nullable = true)
    private String locationName;

    @Column(name = "latitude", nullable = false)
    private String latitud;

    @Column(name = "longtitude", nullable = false)
    private String longtitude;

    public Location(Integer locationId, Rider usernamae, String locationName, String latitud, String longtitude) {
        this.locationId = locationId;
        this.usernamae = usernamae;
        this.locationName = locationName;
        this.latitud = latitud;
        this.longtitude = longtitude;
    }

    public Location() {

    }
    //private static final GeometryFactory geo = new GeometryFactory();


    public Integer getLocationId() {
        return locationId;
    }

    public void setLocationId(Integer locationId) {
        this.locationId = locationId;
    }



    public Rider getUsernamae() {
        return usernamae;
    }

    public void setUsernamae(Rider usernamae) {
        this.usernamae = usernamae;
    }

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public String getLatitud() {
        return latitud;
    }

    public void setLatitud(String latitud) {
        this.latitud = latitud;
    }

    public String getLongtitude() {
        return longtitude;
    }

    public void setLongtitude(String longtitude) {
        this.longtitude = longtitude;
    }
}

