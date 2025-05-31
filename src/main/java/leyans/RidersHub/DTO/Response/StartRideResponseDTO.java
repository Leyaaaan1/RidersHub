package leyans.RidersHub.DTO.Response;

import leyans.RidersHub.model.Rider;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

public class StartRideResponseDTO implements Serializable {
    private Integer id;
    private String ridesName;
    private String locationName;

    private double latitude;
    private double longitude;
    private LocalDateTime startTime;

    private String initiator;

    private List<String> participantUsernames;


    public StartRideResponseDTO(Integer id, String initiator, String ridesName, String locationName, List<String> participantUsernames, double longitude, double latitude, LocalDateTime startTime) {
        this.id = id;
        this.initiator = initiator;
        this.ridesName = ridesName;
        this.locationName = locationName;
        this.startTime = startTime;
        this.participantUsernames = participantUsernames;
        this.latitude = latitude;
        this.longitude = longitude;

    }


    public String getInitiator() {
        return initiator;
    }

    public void setInitiator(String initiator) {
        this.initiator = initiator;
    }

    public List<String> getParticipantUsernames() {
        return participantUsernames;
    }

    public void setParticipantUsernames(List<String> participantUsernames) {
        this.participantUsernames = participantUsernames;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }
}