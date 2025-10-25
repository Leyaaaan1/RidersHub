package leyans.RidersHub.Service;

import leyans.RidersHub.DTO.Response.StartRideResponseDTO;
import leyans.RidersHub.Repository.RidesRepository;
import leyans.RidersHub.Repository.StartedRideRepository;
import leyans.RidersHub.Utility.StartedUtil;
import leyans.RidersHub.model.Rider;
import leyans.RidersHub.model.Rides;
import leyans.RidersHub.model.StartedRide;
import leyans.RidersHub.model.participant.ParticipantLocation;
import org.locationtech.jts.geom.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class StartRideService {

    private final StartedRideRepository startedRideRepository;
    private final RidesRepository ridesRepository;

    private final StartedUtil startedUtil;

    @Autowired
    public StartRideService(StartedRideRepository startedRideRepository, RidesRepository ridesRepository,
                            StartedUtil startedUtil) {
        this.startedRideRepository = startedRideRepository;
        this.ridesRepository = ridesRepository;
        this.startedUtil = startedUtil;
    }

    @Transactional
    public StartRideResponseDTO startRide(Integer generatedRidesId) throws AccessDeniedException {
        Rider initiator = startedUtil.authenticateAndGetInitiator();
        Rides ride = startedUtil.validateAndGetRide(generatedRidesId, initiator);

        boolean isCreator = ride.getUsername().getUsername().equals(initiator.getUsername());
        boolean isParticipant = ride.getParticipants().stream()
                .anyMatch(p -> p.getUsername().equals(initiator.getUsername()));

        if (!isCreator && !isParticipant) {
            throw new AccessDeniedException("Only the ride creator or participants can start the ride");
        }

        Point startingPoint = ride.getStartingLocation();
        if (startingPoint == null) {
            throw new RuntimeException("Ride does not have a valid starting location");
        }

        StartedRide startedRide = new StartedRide();
        startedRide.setRide(ride);
        startedRide.setUsername(initiator);
        startedRide.setStartTime(LocalDateTime.now());
        startedRide.setLocation(startingPoint);

        // Include both participants and creator
        List<Rider> allParticipants = new ArrayList<>(ride.getParticipants());
        if (!allParticipants.contains(ride.getUsername())) {
            allParticipants.add(ride.getUsername());
        }
        startedRide.setParticipants(allParticipants);

        startedRide = startedRideRepository.save(startedRide);

        // Initialize locations for ALL participants with the SAME starting point
        List<ParticipantLocation> participantLocations = startedUtil.initializeParticipantLocations(
                startedRide,
                allParticipants,
                startingPoint  // All participants start at the same point
        );

        return startedUtil.buildStartRideResponse(startedRide, ride, participantLocations);
    }



    @Transactional
    public void deactivateRide(Integer generatedRidesId) {
        try {
            ridesRepository.deactivateRide(generatedRidesId);
        } catch (Exception e) {
            throw new RuntimeException("Failed to deactivate ride: " + e.getMessage());
        }
    }


}