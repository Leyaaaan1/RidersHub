package leyans.RidersHub.DTO.Response;

public class LocationDistanceDTO {
    private Integer locationId;
    private String locationName;
    private Double distance;


    public LocationDistanceDTO() {
    }

    public LocationDistanceDTO(Integer locationId, String locationName, Double distance) {
        this.locationId = locationId;
        this.locationName = locationName;
        this.distance = distance;
    }
    public Integer getLocationId() {
        return locationId;
    }

    public void setLocationId(Integer locationId) {
        this.locationId = locationId;
    }

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public Double getDistance() {
        return distance;
    }

    public void setDistance(Double distance) {
        this.distance = distance;
    }

}
