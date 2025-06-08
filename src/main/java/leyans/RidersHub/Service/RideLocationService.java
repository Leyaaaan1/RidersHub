package leyans.RidersHub.Service;

import leyans.RidersHub.DTO.LocationUpdateRequestDTO;
import leyans.RidersHub.Repository.PsgcDataRepository;
import leyans.RidersHub.Repository.RiderLocationRepository;
import leyans.RidersHub.Repository.RiderRepository;
import leyans.RidersHub.Repository.StartedRideRepository;
import leyans.RidersHub.Service.MapService.NominatimService;
import leyans.RidersHub.model.PsgcData;
import leyans.RidersHub.model.Rider;
import leyans.RidersHub.model.RiderLocation;
import leyans.RidersHub.model.StartedRide;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RideLocationService {

    private final StartedRideRepository startedRideRepo;
    private final RiderLocationRepository locationRepo;
    private final GeometryFactory geometryFactory = new GeometryFactory();

    private final RiderRepository riderRepository;
    private final KafkaTemplate<Object, LocationUpdateRequestDTO> kafkaTemplate;

    private final PsgcDataRepository psgcDataRepository;
    private final NominatimService nominatimService;

    private final LocationService locationService;


    @Autowired
    public RideLocationService(StartedRideRepository startedRideRepo,
                               RiderLocationRepository locationRepo, RiderRepository riderRepository, KafkaTemplate<Object, LocationUpdateRequestDTO> kafkaTemplate, PsgcDataRepository psgcDataRepository, NominatimService nominatimService, LocationService locationService) {
        this.startedRideRepo = startedRideRepo;
        this.locationRepo = locationRepo;
        this.riderRepository = riderRepository;
        this.kafkaTemplate = kafkaTemplate;
        this.psgcDataRepository = psgcDataRepository;
        this.nominatimService = nominatimService;
        this.locationService = locationService;
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
        Point userPoint = locationService.createPoint(longitude, latitude);


        String barangayName = locationService.resolveBarangayName(null, latitude, longitude);
        String locationName = null;
        if (barangayName != null) {
            List<PsgcData> psgcDataList = psgcDataRepository.findByNameIgnoreCase(barangayName);
            locationName = psgcDataList.stream()
                    .findFirst()
                    .map(PsgcData::getName)
                    .orElse(barangayName);

            //If the barangay exists in the PSGC (Philippine Standard Geographic Code) database, it uses the standardized/official name
            //If the barangay isn't in the database, it defaults to using the original detected name
            //If no barangay was detected at all (null), the locationName remains null
        }

        Point startPoint = started.getLocation();
        double distanceMeters = locationRepo.getDistanceBetweenPoints(userPoint, startPoint);


        RiderLocation loc = new RiderLocation();
        loc.setStartedRide(started);
        loc.setUsername(rider);
        loc.setLocation(userPoint);

        loc.setTimestamp(LocalDateTime.now());
        loc.setDistanceMeters(distanceMeters);
        if (locationName != null) {
            loc.setLocationName(locationName);
        }
        loc = locationRepo.save(loc);


        LocationUpdateRequestDTO locationDTO = new LocationUpdateRequestDTO(
                rideId,
                username,
                latitude,
                longitude,
                locationName,
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
