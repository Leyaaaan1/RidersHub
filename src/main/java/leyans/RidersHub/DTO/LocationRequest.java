package leyans.RidersHub.DTO;

import java.awt.*;

public class LocationRequest {

    private String locationName;
    private Point Location;
    private double latitude;
    private double longitude;
    private String Rider;

    public String getUsername() {

        return Rider;
    }

    public void setUsername(String Rider) {
        this.Rider = Rider
        ;
    }
    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
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


    public Point getLocation() {
        return Location;
    }

    public void setLocation(Point location) {
        Location = location;
    }

}
