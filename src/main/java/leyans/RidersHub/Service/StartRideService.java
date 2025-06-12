package leyans.RidersHub.Service;


import com.fasterxml.jackson.databind.ObjectMapper;
import leyans.RidersHub.DTO.ParticipantLocationDTO;
import leyans.RidersHub.DTO.Response.RideResponseDTO;
import leyans.RidersHub.DTO.Response.StartRideResponseDTO;
import leyans.RidersHub.Repository.RiderRepository;
import leyans.RidersHub.Repository.RidesRepository;
import leyans.RidersHub.Repository.StartedRideRepository;
import leyans.RidersHub.model.Rider;
import leyans.RidersHub.model.Rides;
import leyans.RidersHub.model.StartedRide;
import org.hibernate.Hibernate;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
public class StartRideService {

    private final RidesRepository ridesRepository;
    private final StartedRideRepository startedRideRepository;

    private final RiderRepository riderRepository;



    @Autowired
    public StartRideService(RidesRepository ridesRepository,
                            StartedRideRepository startedRideRepository, RiderRepository riderRepository) {
        this.ridesRepository = ridesRepository;
        this.startedRideRepository = startedRideRepository;
        this.riderRepository = riderRepository;
    }


    @Transactional
    public StartRideResponseDTO startRide(Integer rideId) throws AccessDeniedException {


        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Rider initiator = riderRepository.findByUsername(username);

        if (initiator == null) {
            throw new AccessDeniedException("Rider not found with username: " + username);
        }

        Rides ride = ridesRepository.findByIdWithParticipants(rideId)
                .orElseThrow(() -> new IllegalArgumentException("Ride not found with id: " + rideId));


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

        started = startedRideRepository.save(started);

        StartRideResponseDTO responseDTO = new StartRideResponseDTO(
                ride.getRidesId(),
                initiator.getUsername(),
                ride.getRidesName(),
                ride.getLocationName(),
                participantUsernames,
                longitude,
                latitude,
                started.getStartTime());


        return responseDTO;

    }


}



