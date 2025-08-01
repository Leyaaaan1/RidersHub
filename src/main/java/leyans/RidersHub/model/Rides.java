package leyans.RidersHub.model;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.locationtech.jts.geom.Point;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "event_rides",
        indexes = {
                @Index(name = "idx_generated_rides_id", columnList = "generatedRidesId")
        })
public class Rides {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ridesId", nullable  = false)
    private Integer ridesId;

    @Column(name = "generatedRidesId", nullable = false, unique = true)
    private Integer generatedRidesId;


    @Column(name = "locationName", nullable = false)
    private String locationName;

    @Column(name = "ridesName", nullable = false)
    private String ridesName;

    @Lob
    @Column(name = "description")
    private String description;

    @ManyToOne
    @JoinColumn(name = "username", referencedColumnName = "username", nullable = false)
    private Rider username;


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "rider_type", referencedColumnName = "rider_type", nullable = false)
    private RiderType riderType;

    @Column(name = "distance")
    private Integer distance;

    @ManyToMany
    @JoinTable(
            name = "ride_participants",
            joinColumns = @JoinColumn(name = "ride_id"),
            inverseJoinColumns = @JoinColumn(name = "rider_username")
    )
    private List<Rider> participants = new ArrayList<>();


    @Column(name = "startingLocation", columnDefinition = "geometry(Point,4326)")
    private Point startingLocation;
    @Column(name = "endingLocation", columnDefinition = "geometry(Point,4326)")
    private Point endingLocation;


    @Column(name = "startingPointName", nullable = false)
    private String startingPointName;

    @Column(name = "endingPointName", nullable = false)
    private String endingPointName;


    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "ride_stop_points", joinColumns = @JoinColumn(name = "ride_id"))
    private List<StopPoint> stopPoints = new ArrayList<>();

    @Column(name = "ride_date", nullable = false)
    private LocalDateTime date;

    @Column(name = "location", columnDefinition = "geometry(Point,4326)")
    private Point location;

    @Column(name = "map_image_url")
    private String mapImageUrl;

    @Column(name = "map_starting_url")
    private String magImageStartingLocation;

    @Column(name = "map_ending_url")
    private String magImageEndingLocation;

    public Rides() {
    }

    public Rides(Integer generatedRidesId, String locationName, String startingPointName,
                 String endingPointName, Point location, Point startingLocation,
                 Point endingLocation, String ridesName, String description,
                 Rider username, RiderType riderType, Integer distance, LocalDateTime date,
                 String mapImageUrl,
                 String magImageStartingLocation, String magImageEndingLocation) {
        this.generatedRidesId = generatedRidesId;
        this.locationName = locationName;
        this.ridesName = ridesName;
        this.location = location;
        this.username = username;
        this.riderType = riderType;
        this.distance = distance;

        this.date = date;
        this.description = description;
        this.startingLocation = startingLocation;
        this.endingLocation = endingLocation;
        this.startingPointName = startingPointName;
        this.endingPointName = endingPointName;
        this.mapImageUrl = mapImageUrl;
        this.magImageStartingLocation = magImageStartingLocation;
        this.magImageEndingLocation = magImageEndingLocation;

    }

    public List<StopPoint> getStopPoints() {
        return stopPoints;
    }

    public void setStopPoints(List<StopPoint> stopPoints) {
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

    public String getEndingPointName() {
        return endingPointName;
    }

    public void setEndingPointName(String endingPointName) {
        this.endingPointName = endingPointName;
    }

    public Point getStartingLocation() {
        return startingLocation;
    }

    public void setStartingLocation(Point startingLocation) {
        this.startingLocation = startingLocation;
    }

    public Point getEndingLocation() {
        return endingLocation;
    }

    public void setEndingLocation(Point endingLocation) {
        this.endingLocation = endingLocation;
    }


    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Point getLocation() {
        return location;
    }

    public void setLocation(Point location) {
        this.location = location;
    }

    public List<Rider> getParticipants() {
        return participants;
    }

    public void setParticipants(List<Rider> participants) {
        this.participants = participants;
    }

    public void addParticipant(Rider participant) {
        this.participants.add(participant);
    }

    public void removeParticipant(Rider participant) {
        this.participants.remove(participant);
    }
    public Integer getRidesId() {
        return ridesId;
    }

    public void setRidesId(Integer ridesId) {
        this.ridesId = ridesId;
    }




    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public String getRidesName() {
        return ridesName;
    }

    public void setRidesName(String ridesName) {
        this.ridesName = ridesName;
    }

    public Rider getUsername() {
        return username;
    }

    public void setUsername(Rider username) {
        this.username = username;
    }

    public RiderType getRiderType() {
        return riderType;
    }

    public void setRiderType(RiderType riderType) {
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
}
