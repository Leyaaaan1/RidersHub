package leyans.RidersHub.Service;

import leyans.RidersHub.DTO.LocationUpdateRequestDTO;
import leyans.RidersHub.DTO.RiderLocationDTO;
import leyans.RidersHub.Repository.RiderLocationRepository;
import leyans.RidersHub.Repository.RiderRepository;
import leyans.RidersHub.Repository.StartedRideRepository;
import leyans.RidersHub.model.Rider;
import leyans.RidersHub.model.RiderLocation;
import leyans.RidersHub.model.StartedRide;
import org.locationtech.jts.geom.Coordinate;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
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

    private final RiderRepository riderRepository;
    private final KafkaTemplate<Object, LocationUpdateRequestDTO> kafkaTemplate;

    @Autowired
    public RideLocationService(StartedRideRepository startedRideRepo,
                               RiderLocationRepository locationRepo, RiderRepository riderRepository, KafkaTemplate<Object, LocationUpdateRequestDTO> kafkaTemplate) {
        this.startedRideRepo = startedRideRepo;
        this.locationRepo = locationRepo;
        this.riderRepository = riderRepository;
        this.kafkaTemplate = kafkaTemplate;
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

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Rider initiator = riderRepository.findByUsername(username);

        Point startPoint = started.getLocation();
        double distanceMeters = locationRepo.getDistanceBetweenPoints(userPoint, startPoint);


        RiderLocation loc = new RiderLocation();
        loc.setStartedRide(started);
        loc.setUsername(initiator);
        loc.setLocation(userPoint);
        loc.setTimestamp(LocalDateTime.now());
        loc.setDistanceMeters(distanceMeters);
        loc = locationRepo.save(loc);

        LocationUpdateRequestDTO locationDTO = new LocationUpdateRequestDTO(
                rideId,
                initiator,
                latitude,
                longitude,
                distanceMeters,
                loc.getTimestamp()
        );

        kafkaTemplate.send("rider-locations", locationDTO);

        return locationDTO;
    }
    }
