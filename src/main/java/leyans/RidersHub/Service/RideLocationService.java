package leyans.RidersHub.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import leyans.RidersHub.DTO.LocationUpdateRequestDTO;
import leyans.RidersHub.DTO.RiderLocationDTO;
import leyans.RidersHub.Repository.RiderLocationRepository;
import leyans.RidersHub.Repository.RiderRepository;
import leyans.RidersHub.Repository.StartedRideRepository;
import leyans.RidersHub.model.Rider;
import leyans.RidersHub.model.RiderLocation;
import leyans.RidersHub.model.StartedRide;
import org.locationtech.jts.geom.Coordinate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;

@Service
public class RideLocationService {

    private final StartedRideRepository startedRideRepo;
    private final RiderLocationRepository locationRepo;
    private final GeometryFactory geometryFactory = new GeometryFactory();

    private final RiderRepository riderRepository;
    private final KafkaTemplate<Object, LocationUpdateRequestDTO> kafkaTemplate;

    private final StringRedisTemplate stringRedisTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    public RideLocationService(StartedRideRepository startedRideRepo,
                               RiderLocationRepository locationRepo, RiderRepository riderRepository, KafkaTemplate<Object, LocationUpdateRequestDTO> kafkaTemplate, StringRedisTemplate stringRedisTemplate) {
        this.startedRideRepo = startedRideRepo;
        this.locationRepo = locationRepo;
        this.riderRepository = riderRepository;
        this.kafkaTemplate = kafkaTemplate;
        this.stringRedisTemplate = stringRedisTemplate;
    }

    /**
     * Record rider's location update and compute distance via PostGIS.
     */
    @Transactional
    public LocationUpdateRequestDTO updateLocation(Integer rideId, double latitude, double longitude) {

        StartedRide started = startedRideRepo.findById(rideId)
                .orElseThrow(() -> new IllegalArgumentException("Started ride not found: " + rideId));


        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Rider rider = riderRepository.findByUsername(username);
        if (!started.getParticipants().contains(rider)) {
            throw new IllegalArgumentException("User is not a participant in this ride");
        }


        //Current location of the rider
        Point userPoint = geometryFactory.createPoint(new Coordinate(longitude, latitude));
        userPoint.setSRID(4326);

        Point startPoint = started.getLocation();
        double distanceMeters = locationRepo.getDistanceBetweenPoints(userPoint, startPoint);

        RiderLocation loc = new RiderLocation();
        loc.setStartedRide(started);
        loc.setUsername(rider);
        loc.setLocation(userPoint);
        loc.setTimestamp(LocalDateTime.now());
        loc.setDistanceMeters(distanceMeters);
        loc = locationRepo.save(loc);

        LocationUpdateRequestDTO locationDTO = new LocationUpdateRequestDTO(
                rideId,
                rider,
                latitude,
                longitude,
                distanceMeters,
                loc.getTimestamp()
        );

//        try {
//            String locationJson = objectMapper.writeValueAsString(locationDTO);
//            String redisKey = "rider_location:" + rider.getUsername();
//            stringRedisTemplate.opsForValue().set(redisKey, locationJson, 3, TimeUnit.MINUTES);
//        } catch (Exception e) {
//            throw new RuntimeException("Failed to serialize location update", e);
//        }

        // Send Kafka message
        kafkaTemplate.send("rider-locations", locationDTO);

        return locationDTO;
    }



//    public  LocationUpdateRequestDTO getRiderLocation(String username) {
//
//        String redisKey = "rider_location:" + username;
//        String locationJson = stringRedisTemplate.opsForValue().get(redisKey);
//
//        if (locationJson == null) {
//            throw new RuntimeException("No location found for rider: " + username);
//        }
//        try {
//            return objectMapper.readValue(locationJson, LocationUpdateRequestDTO.class);
//        } catch (Exception e) {
//            throw new RuntimeException("Failed to deserialize rider location", e);
//        }
//
//    }



    }
