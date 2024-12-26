package leyans.RidersHub.model;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "event_rides")
public class EventRides {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "eventsId", nullable  = false)
    private Integer eventsId;

    @Column(name = "routes", nullable = false, unique = true)
    private String routes;

    @ManyToOne
    @JoinColumn(name = "username", referencedColumnName = "username", nullable = false)
    private Rider username;

    @Column(name = "riders", nullable = false)
    private String riders;

    @Column(name = "distance", nullable = false)
    private Integer distance;

    @Column(name = "meetingPoint", nullable = false)
    private String meeting;

    @Column(name = "date", nullable = false)
    private Date date;

    public EventRides() {
    }

    public EventRides(Integer eventsId, String routes, Rider username, String riders, Integer distance, String meeting, Date date) {
        this.eventsId = eventsId;
        this.routes = routes;
        this.username = username;
        this.riders = riders;
        this.distance = distance;
        this.meeting = meeting;
        this.date = date;
    }

    public Integer getEventsId() {
        return eventsId;
    }

    public void setEventsId(Integer eventsId) {
        this.eventsId = eventsId;
    }

    public String getRoutes() {
        return routes;
    }

    public void setRoutes(String routes) {
        this.routes = routes;
    }

    public Rider getUsername() {
        return username;
    }

    public void setUsername(Rider username) {
        this.username = username;
    }

    public String getRiders() {
        return riders;
    }

    public void setRiders(String riders) {
        this.riders = riders;
    }

    public Integer getDistance() {
        return distance;
    }

    public void setDistance(Integer distance) {
        this.distance = distance;
    }

    public String getMeeting() {
        return meeting;
    }

    public void setMeeting(String meeting) {
        this.meeting = meeting;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }
}
