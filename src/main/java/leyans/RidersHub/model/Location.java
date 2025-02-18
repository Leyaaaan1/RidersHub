package leyans.RidersHub.model;

import jakarta.persistence.*;

@Entity
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "locationId", unique = true, nullable = false)
    private Integer locationId;

    // @Column(columnDefinition = "geometry(Point, 4325)")

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "username", referencedColumnName = "username")
    private Rider username;


    @Column(name = "location")
    private String locationName;

    @Column(name = "latitude")
    private String latitude;

    @Column(name = "longitude")
    private String longitude;


    public Location() {

    }

    public Location(Integer locationId, Rider username, String locationName, String latitude, String longitude) {
        this.locationId = locationId;
        this.username = username;
        this.locationName = locationName;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public Integer getLocationId() {
        return locationId;
    }

    public void setLocationId(Integer locationId) {
        this.locationId = locationId;
    }

    public Rider getRider() {
        return username;
    }

    public void setRider(Rider username) {
        this.username = username;
    }

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public String getLatitude() {
        return latitude;
    }

    public void setLatitude(String latitude) {
        this.latitude = latitude;
    }

    public String getLongitude() {
        return longitude;
    }

    public void setLongitude(String longitude) {
        this.longitude = longitude;
    }
}