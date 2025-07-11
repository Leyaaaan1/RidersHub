package leyans.RidersHub.DTO;

import java.time.LocalDateTime;
import java.util.List;

public class RideRequestDTO {

    private Integer generatedRidesId;
    private String username;
    private String ridesName;
    private String locationName;
    private String riderType;
    private Integer distance;

    private LocalDateTime date;
    private double latitude;
    private double longitude;
    private List<String> participants;
    private String description;
    String startingPointName;
    double startLat;
    double startLng;
    String endingPointName;
    double endLat;
    double endLng;
    private String mapImageUrl;
    private String magImageStartingLocation;
    private String magImageEndingLocation;

    private List<StopPointDTO> stopPoints;

    private String routeCoordinates;


    public RideRequestDTO(Integer generatedRidesId, String username, List<String> participants, String description,
                          String ridesName, String locationName,
                          String riderType, Integer distance,
                          LocalDateTime date, double latitude, double longitude,
                          String startingPointName, double startLat,double startLng,
            String endingPointName, double endLat, double endLng,
                          String mapImageUrl,
                          String magImageStartingLocation, String magImageEndingLocation,
                          List<StopPointDTO> stopPoints,
                          String routeCoordinates) {
        this.generatedRidesId = generatedRidesId;
        this.username = username;
        this.ridesName = ridesName;
        this.description = description;
        this.locationName = locationName;
        this.riderType = riderType;
        this.distance = distance;
        this.date = date;
        this.latitude = latitude;
        this.longitude = longitude;
        this.participants = participants;
        this.startingPointName = startingPointName;
        this.startLat = startLat;
        this.startLng = startLng;
        this.endingPointName = endingPointName;
        this.endLat = endLat;
        this.endLng = endLng;
        this.mapImageUrl = mapImageUrl;
        this.magImageStartingLocation = magImageStartingLocation;
        this.magImageEndingLocation = magImageEndingLocation;
        this.stopPoints = stopPoints;
        this.routeCoordinates = routeCoordinates;


    }

    public String getRouteCoordinates() {
        return routeCoordinates;
    }

    public void setRouteCoordinates(String routeCoordinates) {
        this.routeCoordinates = routeCoordinates;
    }

    public List<StopPointDTO> getStopPoints() {
        return stopPoints;
    }

    public void setStopPoints(List<StopPointDTO> stopPoints) {
        this.stopPoints = stopPoints;
    }

    public String getMagImageStartingLocation() {
        return magImageStartingLocation;
    }

    public void setMagImageStartingLocation(String magImageStartingLocation) {
        this.magImageStartingLocation = magImageStartingLocation;
    }

    public String getMagImageEndingLocation() {
        return magImageEndingLocation;
    }

    public void setMagImageEndingLocation(String magImageEndingLocation) {
        this.magImageEndingLocation = magImageEndingLocation;
    }

    public Integer getGeneratedRidesId() {
        return generatedRidesId;
    }

    public void setGeneratedRidesId(Integer generatedRidesId) {
        this.generatedRidesId = generatedRidesId;
    }

    public String getMapImageUrl() {
        return mapImageUrl;
    }

    public void setMapImageUrl(String mapImageUrl) {
        this.mapImageUrl = mapImageUrl;
    }

    public String getStartingPointName() {
        return startingPointName;
    }

    public void setStartingPointName(String startingPointName) {
        this.startingPointName = startingPointName;
    }

    public double getStartLat() {
        return startLat;
    }

    public void setStartLat(double startLat) {
        this.startLat = startLat;
    }

    public double getStartLng() {
        return startLng;
    }

    public void setStartLng(double startLng) {
        this.startLng = startLng;
    }

    public String getEndingPointName() {
        return endingPointName;
    }

    public void setEndingPointName(String endingPointName) {
        this.endingPointName = endingPointName;
    }

    public double getEndLat() {
        return endLat;
    }

    public void setEndLat(double endLat) {
        this.endLat = endLat;
    }

    public double getEndLng() {
        return endLng;
    }

    public void setEndLng(double endLng) {
        this.endLng = endLng;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getParticipants() {
        return participants;
    }

    public void setParticipants(List<String> participants) {
        this.participants = participants;
    }



    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRidesName() {
        return ridesName;
    }

    public void setRidesName(String ridesName) {
        this.ridesName = ridesName;
    }

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public String getRiderType() {
        return riderType;
    }

    public void setRiderType(String riderType) {
        this.riderType = riderType;
    }

    public Integer getDistance() {
        return distance;
    }

    public void setDistance(Integer distance) {
        this.distance = distance;
    }


    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
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
