package leyans.RidersHub.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "ride_locations")
public class RideLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String locationName;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "rider_id")
    private Rider rider;

    // Using PostGIS point type for coordinates
    private double latitude;
    private double longitude;

    private boolean started = true;

    private LocalDateTime lastUpdated;

    private String currentRideId;

    // Constructors
    public RideLocation() {
    }

    public RideLocation(String locationName, Rider rider, double latitude, double longitude) {
        this.locationName = locationName;
        this.rider = rider;
        this.latitude = latitude;
        this.longitude = longitude;
        this.started = true;
        this.lastUpdated = LocalDateTime.now();
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public Rider getRider() {
        return rider;
    }

    public void setRider(Rider rider) {
        this.rider = rider;
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

    public boolean isStarted() {
        return started;
    }

    public void setStarted(boolean started) {
        this.started = started;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public String getCurrentRideId() {
        return currentRideId;
    }

    public void setCurrentRideId(String currentRideId) {
        this.currentRideId = currentRideId;
    }
}