package leyans.RidersHub.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "ride_join_requests")
public class RideJoinRequest {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "rides_id", nullable = false)
    private Rides ride;

    @ManyToOne
    @JoinColumn(name = "rider_id", nullable = false)
    private Rider rider;


    public RideJoinRequest() {

    }
    public RideJoinRequest(Integer id, Rides ride, Rider rider) {
        this.id = id;
        this.ride = ride;
        this.rider = rider;
    }



    public enum RequestStatus {
       PENDING, ACCEPTED, REJECTED
    }

    public Rides getRide() {
        return ride;
    }

    public void setRide(Rides ride) {
        this.ride = ride;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Rider getRider() {
        return rider;
    }

    public void setRider(Rider rider) {
        this.rider = rider;
    }





}
