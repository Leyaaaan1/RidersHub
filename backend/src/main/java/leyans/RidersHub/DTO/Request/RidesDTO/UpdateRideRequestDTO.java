package leyans.RidersHub.DTO.Request.RidesDTO;


import java.time.LocalDateTime;
import java.util.List;

/**
 * Used for editing an existing ride.
 * Deliberately has NO generatedRidesId field — that comes from the path
 * variable in the controller, never from the request body, so it can't
 * be changed by the client.
 */
public class UpdateRideRequestDTO {

    private String ridesName;
    private String locationName;
    private String riderType;
    private LocalDateTime date;
    private List<String> participants;
    private String description;

    private double latitude;
    private double longitude;

    private double startLat;
    private double startLng;

    private double endLat;
    private double endLng;

    private boolean locationFromSearch;
    private boolean startingPointFromSearch;
    private boolean endingPointFromSearch;

    private String startingPointName;
    private String endingPointName;

    private List<Boolean> stopPointsFromSearch;
    private List<StopPointDTO> stopPoints;

    // getters and setters

    public String getRidesName() { return ridesName; }
    public void setRidesName(String ridesName) { this.ridesName = ridesName; }

    public String getLocationName() { return locationName; }
    public void setLocationName(String locationName) { this.locationName = locationName; }

    public String getRiderType() { return riderType; }
    public void setRiderType(String riderType) { this.riderType = riderType; }

    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }

    public List<String> getParticipants() { return participants; }
    public void setParticipants(List<String> participants) { this.participants = participants; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }

    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }

    public double getStartLat() { return startLat; }
    public void setStartLat(double startLat) { this.startLat = startLat; }

    public double getStartLng() { return startLng; }
    public void setStartLng(double startLng) { this.startLng = startLng; }

    public double getEndLat() { return endLat; }
    public void setEndLat(double endLat) { this.endLat = endLat; }

    public double getEndLng() { return endLng; }
    public void setEndLng(double endLng) { this.endLng = endLng; }

    public boolean isLocationFromSearch() { return locationFromSearch; }
    public void setLocationFromSearch(boolean locationFromSearch) { this.locationFromSearch = locationFromSearch; }

    public boolean isStartingPointFromSearch() { return startingPointFromSearch; }
    public void setStartingPointFromSearch(boolean startingPointFromSearch) { this.startingPointFromSearch = startingPointFromSearch; }

    public boolean isEndingPointFromSearch() { return endingPointFromSearch; }
    public void setEndingPointFromSearch(boolean endingPointFromSearch) { this.endingPointFromSearch = endingPointFromSearch; }

    public String getStartingPointName() { return startingPointName; }
    public void setStartingPointName(String startingPointName) { this.startingPointName = startingPointName; }

    public String getEndingPointName() { return endingPointName; }
    public void setEndingPointName(String endingPointName) { this.endingPointName = endingPointName; }

    public List<Boolean> getStopPointsFromSearch() { return stopPointsFromSearch; }
    public void setStopPointsFromSearch(List<Boolean> stopPointsFromSearch) { this.stopPointsFromSearch = stopPointsFromSearch; }

    public List<StopPointDTO> getStopPoints() { return stopPoints; }
    public void setStopPoints(List<StopPointDTO> stopPoints) { this.stopPoints = stopPoints; }
}