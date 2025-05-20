package leyans.RidersHub.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "started_rides")
public class StartedRide {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "rides_id", referencedColumnName = "ridesId", nullable = false)
    private Rides ride;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    // Constructors
    public StartedRide() {}

    public StartedRide(Rides ride, LocalDateTime startTime) {
        this.ride = ride;
        this.startTime = startTime;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Rides getRide() {
        return ride;
    }

    public void setRide(Rides ride) {
        this.ride = ride;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }
}
