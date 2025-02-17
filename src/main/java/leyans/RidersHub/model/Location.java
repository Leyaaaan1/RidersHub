package leyans.RidersHub.model;

import jakarta.persistence.*;

import java.awt.*;

@Entity
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "locationId", unique = true, nullable = false)
    private Integer locationId;

    @Column(columnDefinition = "geometry(Point, 4325)")
    private Point location;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "username", referencedColumnName = "username", nullable = false)
    private Rider usernamae;

    
    @Column(name = "location", nullable = true)
    private String locationName;

    private static final GeometryFactory geo = new GeometryFactory();




}

