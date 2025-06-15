package leyans.RidersHub.Service;


import leyans.RidersHub.DTO.Response.StartRideResponseDTO;
import leyans.RidersHub.Repository.RiderRepository;
import leyans.RidersHub.Repository.RidesRepository;
import leyans.RidersHub.Repository.StartedRideRepository;
import leyans.RidersHub.model.Rider;
import leyans.RidersHub.model.Rides;
import leyans.RidersHub.model.StartedRide;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class StartRideService {

    private final RidesRepository ridesRepository;
    private final StartedRideRepository startedRideRepository;

    private final RiderRepository riderRepository;

    private final RiderService riderService;



    @Autowired
    public StartRideService(RidesRepository ridesRepository,
                            StartedRideRepository startedRideRepository, RiderRepository riderRepository, RiderService riderService) {
        this.ridesRepository = ridesRepository;
        this.startedRideRepository = startedRideRepository;
        this.riderRepository = riderRepository;
        this.riderService = riderService;
    }


    @Transactional
    public StartRideResponseDTO startRide(Integer generatedRidesId) throws AccessDeniedException {

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Rider initiator = riderService.getRiderByUsername(username);

        if (initiator == null) {
            throw new AccessDeniedException("Rider not found with username: " + username);
        }

        Optional<Rides> rideOptional = ridesRepository.findRideWithParticipantsById(generatedRidesId);
        Rides ride = rideOptional.orElseThrow(() -> new IllegalArgumentException("Ride not found with ID: " + generatedRidesId));


        if (ride.getUsername() == null || !ride.getUsername().getUsername().equals(initiator.getUsername())) {
            throw new AccessDeniedException("Only the ride initiator can start this ride");
        }

        if (startedRideRepository.existsByRide(ride)) {
            throw new IllegalStateException("Ride has already been started");
        }

        double longitude = 0.0;
        double latitude = 0.0;

        if (ride.getLocation() != null) {
            longitude = ride.getLocation().getX();
            latitude = ride.getLocation().getY();
        }
        StartedRide started = new StartedRide(
                ride,
                LocalDateTime.now(),
                ride.getLocation(),
                ride.getParticipants(),
                initiator
        );


        List<String> participantUsernames = ride.getParticipants().stream()
                .map(Rider::getUsername)
                .toList();

        try {
        started = startedRideRepository.save(started);
        } catch (Exception e) {
            throw new RuntimeException("Failed to save rider location", e);
        }

        StartRideResponseDTO startRideResponseDTO = new StartRideResponseDTO(
                ride.getGeneratedRidesId(),
                initiator.getUsername(),
                ride.getRidesName(),
                ride.getLocationName(),
                participantUsernames,
                longitude,
                latitude,
                started.getStartTime());

        return startRideResponseDTO;
    }







}



