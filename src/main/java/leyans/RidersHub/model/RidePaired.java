package leyans.RidersHub.model;

import jakarta.persistence.*;

import java.awt.*;
import java.util.Date;

@Entity
public class RidePaired {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer ridePaired;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "username1", referencedColumnName = "username")
    private Rider username1;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "username2", referencedColumnName = "username")
    private Rider username2;


    @Convert(converter = PointConverter.class)
    @Column(columnDefinition = "TEXT")
    private Point pairedCoordinates;


    @Convert(converter = PointConverter.class)
    @Column(columnDefinition = "TEXT")
    @JoinColumn(name = "userCoordinate", referencedColumnName = "coordinates")
    private Point userCoordinate;

    @Column(name = "date", nullable = false)
    private Date date;

    




}
