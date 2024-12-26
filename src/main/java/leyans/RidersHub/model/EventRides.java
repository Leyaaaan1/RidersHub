package leyans.RidersHub.model;

import jakarta.persistence.*;

@Entity
@Table(name = "event_rides")
public class EventRides {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "eventsId", nullable  = false)
    private Integer eventsId;

    @Column(name = "routes", nullable = false)
    private String routes;

    @Column(name = "username", nullable = false)
    private String owner;
}
