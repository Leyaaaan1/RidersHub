package leyans.RidersHub.Service;

import leyans.RidersHub.DTO.Response.LocationUpdateResponseDTO;
import leyans.RidersHub.Repository.RiderLocationRepository;
import leyans.RidersHub.Repository.RidesRepository;
import leyans.RidersHub.Repository.StartedRideRepository;
import leyans.RidersHub.model.RiderLocation;
import leyans.RidersHub.model.StartedRide;
import org.locationtech.jts.geom.Coordinate;
import org.springframework.kafka.core.KafkaTemplate;
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
    private final RidesRepository rideRepo;
    private final KafkaTemplate<Object, LocationUpdateResponseDTO> kafkaTemplate;
    private final GeometryFactory geometryFactory = new GeometryFactory();

    @Autowired
    public RideLocationService(StartedRideRepository startedRideRepo,
                               RiderLocationRepository locationRepo,
                               RidesRepository rideRepo,
                               KafkaTemplate<Object, LocationUpdateResponseDTO> kafkaTemplate) {
        this.startedRideRepo = startedRideRepo;
        this.locationRepo = locationRepo;
        this.rideRepo = rideRepo;
        this.kafkaTemplate = kafkaTemplate;
    }

    /**
     * Record rider's location update and compute distance via PostGIS.
     */
    @Transactional
    public LocationUpdateResponseDTO updateLocation(Integer rideId, double latitude, double longitude) {
       //find active ride by ID
        StartedRide started = startedRideRepo.findById(rideId)
                .orElseThrow(() -> new IllegalArgumentException("Started ride not found: " + rideId));



       // Uses geometryFactory to create a geographical point from the coordinates
        Point userPoint = geometryFactory.createPoint(new Coordinate(longitude, latitude));
        userPoint.setSRID(4326);

        RiderLocation loc = new RiderLocation();
        loc.setStartedRide(started);
        loc.setLocation(userPoint);
        loc.setTimestamp(LocalDateTime.now());
        loc = locationRepo.save(loc);

        double distance = locationRepo.findDistanceMeters(loc.getId(), latitude, longitude);

        LocationUpdateResponseDTO response = new LocationUpdateResponseDTO(
                rideId, latitude, longitude, distance
        );

        kafkaTemplate.send("rides-location", response);
        return response;
    }
}