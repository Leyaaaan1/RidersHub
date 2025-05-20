package leyans.RidersHub.Controller;

import leyans.RidersHub.Repository.RiderLocationRepository;
import leyans.RidersHub.Repository.StartedRideRepository;
import leyans.RidersHub.model.RiderLocation;
import leyans.RidersHub.model.StartedRide;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/locations")
public class RiderLocationController {

    @Autowired
    private RiderLocationRepository riderLocationRepository;

    @Autowired
    private StartedRideRepository startedRideRepository;

    private final GeometryFactory geometryFactory = new GeometryFactory();

    @PostMapping
    public RiderLocation saveLocation(
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam int rideId
    ) {
        StartedRide ride = startedRideRepository.findById(rideId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid ride ID"));

        Point point = geometryFactory.createPoint(new Coordinate(longitude, latitude));
        point.setSRID(4326); // Important for PostGIS

        RiderLocation location = new RiderLocation(null, ride, point, LocalDateTime.now());
        return riderLocationRepository.save(location);
    }


}