package leyans.RidersHub.Service;


import leyans.RidersHub.DTO.Response.StartRideResponseDTO;
import leyans.RidersHub.Repository.RidesRepository;
import leyans.RidersHub.Repository.StartedRideRepository;
import leyans.RidersHub.Util.RiderUtil;
import leyans.RidersHub.model.Rider;
import leyans.RidersHub.model.Rides;
import leyans.RidersHub.model.StartedRide;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class StartRideService {

    private final StartedRideRepository startedRideRepository;

    private final RiderUtil riderUtil;



    @Autowired
    public StartRideService(StartedRideRepository startedRideRepository, RiderUtil riderUtil) {
        this.startedRideRepository = startedRideRepository;
        this.riderUtil = riderUtil;
    }


    @Transactional
    public StartRideResponseDTO startRide(Integer generatedRidesId) throws AccessDeniedException {
        Rider initiator = authenticateAndGetInitiator();

        Rides ride = validateAndGetRide(generatedRidesId, initiator);

        double[] coordinates = extractLocationCoordinates(ride);
        double longitude = coordinates[0];
        double latitude = coordinates[1];

        StartedRide started = createAndSaveStartedRide(ride, initiator);

        return buildResponseDTO(ride, initiator, started, longitude, latitude);
    }

    @PreAuthorize("isAuthenticated()")
    @Transactional(readOnly = true)
    public List<StartRideResponseDTO> getCurrentStartedRides() throws AccessDeniedException {
        Rider requester = authenticateAndGetInitiator();

        List<StartedRide> startedRides = riderUtil.findStartedRidesByRider(requester);

        return startedRides.stream()
                .map(sr -> {
                    Rides ride = sr.getRide();
                    double[] coordinates = extractLocationCoordinates(ride);
                    double longitude = coordinates[0];
                    double latitude = coordinates[1];
                    return buildResponseDTO(ride, sr.getUsername(), sr, longitude, latitude);
                })
                .toList();
    }


    private Rider authenticateAndGetInitiator() throws AccessDeniedException {
        String username = riderUtil.getCurrentUsername();
        Rider initiator = riderUtil.findRiderByUsername(username);

        if (initiator == null) {
            throw new AccessDeniedException("Rider not found with username: " + username);
        }

        return initiator;
    }

    private Rides validateAndGetRide(Integer generatedRidesId, Rider initiator) throws AccessDeniedException {
        Rides ride = riderUtil.findRideById(generatedRidesId);

        if (ride.getUsername() == null || !ride.getUsername().getUsername().equals(initiator.getUsername())) {
            throw new AccessDeniedException("Only the ride initiator can start this ride");
        }

        if (startedRideRepository.existsByRide(ride)) {
            throw new IllegalStateException("You have currently rides ongoing");
        }
        if (startedRideRepository.existsByUsername(initiator)) {
            throw new IllegalStateException("Ride is already in progress");
        }

        return ride;
    }

    private double[] extractLocationCoordinates(Rides ride) {
        double longitude = 0.0;
        double latitude = 0.0;

        if (ride.getLocation() != null) {
            longitude = ride.getLocation().getX();
            latitude = ride.getLocation().getY();
        }

        return new double[]{longitude, latitude};
    }

    private StartedRide createAndSaveStartedRide(Rides ride, Rider initiator) {
        StartedRide started = new StartedRide(
                ride,
                LocalDateTime.now(),
                ride.getLocation(),
                ride.getParticipants(),
                initiator
        );

        try {
            return startedRideRepository.save(started);
        } catch (Exception e) {
            throw new RuntimeException("Failed to save rider location", e);
        }
    }



    private StartRideResponseDTO buildResponseDTO(Rides ride, Rider initiator, StartedRide started,
                                                  double longitude, double latitude) {
        List<String> participantUsernames = ride.getParticipants().stream()
                .map(Rider::getUsername)
                .toList();

        return new StartRideResponseDTO(
                ride.getGeneratedRidesId(),
                initiator.getUsername(),
                ride.getRidesName(),
                ride.getLocationName(),
                participantUsernames,
                longitude,
                latitude,
                started != null ? started.getStartTime() : null
        );
    }








}



