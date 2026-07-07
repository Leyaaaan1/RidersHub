package leyans.RidersHub.Utility.Rides;

import jakarta.persistence.EntityNotFoundException;
import leyans.RidersHub.Repository.Rides.RiderRepository;
import leyans.RidersHub.Repository.Rides.RidesRepository;
import leyans.RidersHub.Repository.Rides.StartedRideRepository;
import leyans.RidersHub.model.Auth.Rider;
import leyans.RidersHub.model.Rides.Rides;
import leyans.RidersHub.model.Rides.StartedRide;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class RiderUtil {

    private final RidesRepository ridesRepository;

    private final StartedRideRepository startedRideRepository;


    private final RiderRepository riderRepository;
    public RiderUtil(RidesRepository ridesRepository, StartedRideRepository startedRideRepository, RiderRepository riderRepository) {
        this.ridesRepository = ridesRepository;
        this.startedRideRepository = startedRideRepository;
        this.riderRepository = riderRepository;
    }

    public Rides findRideById(String generatedRidesId) {
        return ridesRepository.findByGeneratedRidesId(generatedRidesId)
                .orElseThrow(() -> new EntityNotFoundException("Ride not found with ID: " + generatedRidesId));
    }


    public Rider findRiderByUsername(String username) {
        return riderRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("Rider not found with username: " + username));
    }

    public Optional<Rider> findByAuthEmail(String authEmail) {
        return riderRepository.findByAuthEmail(authEmail);
    }


    public StartedRide findStartedRideByRideId(String generatedRidesId) {
        return startedRideRepository.findByRideGeneratedRidesId(generatedRidesId)
                .orElseThrow(() -> new EntityNotFoundException("Started ride not found with ride ID: " + generatedRidesId));
    }

    public String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() ||
                "anonymousUser".equals(authentication.getName())) {  // ← add this
            throw new IllegalStateException("User not authenticated");
        }
        return authentication.getName();
    }


    public StartedRide findStartedRideByIdWithParticipants(Integer startedRideId) {
        return startedRideRepository.findByIdWithParticipants(startedRideId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Started ride not found with ID: " + startedRideId));
    }
    public StartedRide findStartedRideById(Integer startedRideId) {
        return startedRideRepository.findById(startedRideId)
                .orElseThrow(() -> new EntityNotFoundException("Started ride not found with ID: " + startedRideId));
    }



}
