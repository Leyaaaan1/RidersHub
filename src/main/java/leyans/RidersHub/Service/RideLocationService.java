package leyans.RidersHub.Service;

import leyans.RidersHub.DTO.LocationUpdateRequestDTO;
import leyans.RidersHub.Repository.*;
import leyans.RidersHub.Utility.RiderUtil;
import leyans.RidersHub.model.*;
import org.springframework.stereotype.Service;
import org.locationtech.jts.geom.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RideLocationService {

    private final StartedRideRepository startedRideRepo;
    private final RiderLocationRepository locationRepo;

    private final PsgcDataRepository psgcDataRepository;

    private final LocationService locationService;

    private final RiderUtil riderUtil;



    @Autowired
    public RideLocationService(StartedRideRepository startedRideRepo,
                               RiderLocationRepository locationRepo, PsgcDataRepository psgcDataRepository, LocationService locationService, RiderUtil riderUtil) {
        this.startedRideRepo = startedRideRepo;
        this.locationRepo = locationRepo;
        this.psgcDataRepository = psgcDataRepository;
        this.locationService = locationService;
        this.riderUtil = riderUtil;
    }


    @Transactional
    public LocationUpdateRequestDTO updateLocation(Integer generatedRidesId, double latitude, double longitude) {

        StartedRide started = riderUtil.findStartedRideByRideId(generatedRidesId);
        String username = riderUtil.getCurrentUsername();
        Rider rider = riderUtil.findRiderByUsername(username);

        if (!started.getParticipants().contains(rider)) {
            throw new IllegalArgumentException("User is not a participant in this ride");
        }
        Point userPoint = locationService.createPoint(longitude, latitude);
        String barangayName = locationService.resolveBarangayName( null, latitude, longitude);

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


        if (userPoint == null) {
            throw new IllegalArgumentException("User location point cannot be null");
        }

// Create and populate the rider location
        RiderLocation loc = new RiderLocation();
        loc.setStartedRide(started);
        loc.setUsername(rider);
        loc.setLocation(userPoint);
        loc.setTimestamp(LocalDateTime.now());
        loc.setDistanceMeters(distanceMeters);
        if (locationName != null) {
            loc.setLocationName(locationName);
        }

        try {
            loc = locationRepo.save(loc);
        } catch (Exception e) {
            throw new RuntimeException("Failed to save rider location", e);
        }

        LocationUpdateRequestDTO locationDTO = new LocationUpdateRequestDTO(
                generatedRidesId,
                username,
                latitude,
                longitude,
                locationName,
                distanceMeters,
                loc.getTimestamp()
        );


        return locationDTO;
    }




    }
