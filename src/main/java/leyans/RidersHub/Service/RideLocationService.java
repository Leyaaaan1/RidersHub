package leyans.RidersHub.Service;

import leyans.RidersHub.DTO.LocationUpdateRequestDTO;
import leyans.RidersHub.Repository.RiderLocationRepository;
import leyans.RidersHub.Repository.StartedRideRepository;
import leyans.RidersHub.model.RiderLocation;
import leyans.RidersHub.model.StartedRide;
import org.locationtech.jts.geom.Coordinate;
import org.springframework.stereotype.Service;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
@Service
public class RideLocationService {

    private final StartedRideRepository startedRideRepo;
    private final RiderLocationRepository locationRepo;
    private final GeometryFactory geometryFactory = new GeometryFactory();

    @Autowired
    public RideLocationService(StartedRideRepository startedRideRepo,
                               RiderLocationRepository locationRepo) {
        this.startedRideRepo = startedRideRepo;
        this.locationRepo = locationRepo;

    }

    /**
     * Record rider's location update and compute distance via PostGIS.
     */
    @Transactional
    public LocationUpdateRequestDTO updateLocation(Integer rideId, double latitude, double longitude) {

        StartedRide started = startedRideRepo.findById(rideId)
                .orElseThrow(() -> new IllegalArgumentException("Started ride not found: " + rideId));

        Point userPoint = geometryFactory.createPoint(new Coordinate(longitude, latitude));
        userPoint.setSRID(4326);

        RiderLocation loc = new RiderLocation();
        loc.setStartedRide(started);
        loc.setLocation(userPoint);
        loc.setTimestamp(LocalDateTime.now());
        loc = locationRepo.save(loc);

        Point startPoint = started.getLocation();

        double distanceMeters = locationRepo.getDistanceBetweenPoints(userPoint, startPoint);

        return new LocationUpdateRequestDTO(distanceMeters);
    }
}