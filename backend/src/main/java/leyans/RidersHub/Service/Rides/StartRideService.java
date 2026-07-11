package leyans.RidersHub.Service.Rides;

import leyans.RidersHub.DTO.Response.Rides.StartRideResponseDTO;
import leyans.RidersHub.ExceptionHandler.RideAuthorizationException;
import leyans.RidersHub.Repository.Rides.RideCheckpointArrivalRepository;
import leyans.RidersHub.Repository.Rides.RidesRepository;
import leyans.RidersHub.Repository.Rides.StartedRideRepository;
import leyans.RidersHub.Service.Location.RideLocationService;
import leyans.RidersHub.Utility.Logger.AppLogger;
import leyans.RidersHub.Utility.Rides.RidesUtil;
import leyans.RidersHub.Utility.Rides.StartedUtil;
import leyans.RidersHub.model.Auth.Rider;
import leyans.RidersHub.model.Rides.Rides;
import leyans.RidersHub.model.Rides.StartedRide;
import leyans.RidersHub.model.participant.ParticipantLocation;
import org.locationtech.jts.geom.Point;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class StartRideService {

    private final StartedRideRepository startedRideRepository;
    private final RidesRepository ridesRepository;

    private final StartedUtil startedUtil;
    private final RidesUtil ridesUtil;
    private final RideLocationService rideLocationService;

    private final RideStatusService rideStatusService;
    private final RideCheckpointArrivalRepository rideCheckpointArrivalRepository;

    public StartRideService(StartedRideRepository startedRideRepository, RidesRepository ridesRepository,
                            StartedUtil startedUtil, RidesUtil ridesUtil, RideLocationService rideLocationService, RideStatusService rideStatusService, RideCheckpointArrivalRepository rideCheckpointArrivalRepository) {
        this.startedRideRepository = startedRideRepository;
        this.ridesRepository = ridesRepository;
        this.startedUtil = startedUtil;
        this.ridesUtil = ridesUtil;
        this.rideLocationService = rideLocationService;
        this.rideStatusService = rideStatusService;
        this.rideCheckpointArrivalRepository = rideCheckpointArrivalRepository;
    }

    @Transactional
    public StartRideResponseDTO startRide(String generatedRidesId) {
        AppLogger.info(this.getClass(), "startRide called", "generatedRidesId", generatedRidesId);
        Rider initiator = startedUtil.authenticateAndGetInitiator();
        Rides ride = ridesUtil.validateAndGetRide(generatedRidesId, initiator);

        boolean isCreator = ride.getUsername().getUsername().equals(initiator.getUsername());
        if (!isCreator) {
            AppLogger.warn(this.getClass(), "Unauthorized ride start attempt",
                    "initiator", initiator.getUsername(), "rideId", generatedRidesId);
            throw new RideAuthorizationException("Only the ride creator can start the ride");
        }

        Point startingPoint = ride.getStartingLocation();

        if (startingPoint == null) {
            AppLogger.throwInvalidRequest(this.getClass(), "Ride does not have a valid starting location");
            throw new RuntimeException("Ride does not have a valid starting location");
        }

        StartedRide startedRide = new StartedRide();
        startedRide.setRide(ride);
        startedRide.setUsername(initiator);
        startedRide.setStartTime(LocalDateTime.now());
        startedRide.setLocation(startingPoint);

        Set<Rider> allParticipants = new HashSet<>(ride.getParticipants());
        allParticipants.add(ride.getUsername()); // no duplicate check needed, Set handles it

        startedRide.setParticipants(allParticipants);
        startedRide = startedRideRepository.save(startedRide);
        AppLogger.info(this.getClass(), "Ride started successfully", "rideId", generatedRidesId);

        ride.setActive(true);
        ridesRepository.save(ride);
        rideStatusService.markStarted(generatedRidesId);

        List<ParticipantLocation> participantLocations = startedUtil.initializeParticipantLocations(
                startedRide,
                new ArrayList<>(allParticipants),
                startingPoint
        );

        return startedUtil.buildStartRideResponse(startedRide, ride, participantLocations);
    }




    @Transactional
    public void leaveRide(String generatedRidesId) {
        AppLogger.info(this.getClass(), "leaveRide called", "generatedRidesId", generatedRidesId);

        Rider rider = startedUtil.authenticateAndGetInitiator();

        // Find the active started ride
        StartedRide startedRide = startedRideRepository
                .findByRideGeneratedRidesId(generatedRidesId)
                .orElseThrow(() -> new IllegalArgumentException("No active ride found: " + generatedRidesId));
        rideLocationService.clearRiderLocation(
                startedRide.getId(),
                rider.getUsername()
        );
        Rides ride = startedRide.getRide();

        // Check if caller is actually a participant
        boolean isParticipant = startedRide.getParticipants()
                .stream()
                .anyMatch(p -> p.getUsername().equals(rider.getUsername()));
        if (!isParticipant) {
            throw new IllegalStateException(
                    "You are not a participant of this ride: " + generatedRidesId);
        }

        // Check if the leaving rider is the creator
        boolean isCreator = ride.getUsername().getUsername().equals(rider.getUsername());

        // Remove the rider from both participant sets
        startedRide.getParticipants().remove(rider);
        ride.getParticipants().remove(rider);

        Set<Rider> remainingParticipants = startedRide.getParticipants();

        // If no one is left (last participant, whether creator or not) — tear down started-ride tracking
        if (remainingParticipants.isEmpty()) {
            AppLogger.info(this.getClass(), "Last participant left. Cleaning up started ride.",
                    "generatedRidesId", generatedRidesId);

            startedRideRepository.deleteRiderLocationsByStartedRideId(generatedRidesId);
            startedRideRepository.deleteParticipantLocationsByStartedRideId(generatedRidesId);
            startedRideRepository.deleteParticipantsByStartedRideId(generatedRidesId);
            startedRideRepository.delete(startedRide);
            startedRideRepository.flush();

            if (isCreator) {
                // Owner was the sole remaining participant: remove the ride event itself,
                // along with any event-related data tied to it (e.g. checkpoint arrivals).
                AppLogger.info(this.getClass(), "Owner left as sole participant. Deleting ride and related event data.",
                        "generatedRidesId", generatedRidesId);

                rideCheckpointArrivalRepository.deleteByRideGeneratedRidesId(generatedRidesId);

                ridesRepository.delete(ride);

                AppLogger.info(this.getClass(), "Ride and related event data deleted",
                        "generatedRidesId", generatedRidesId);
            } else {
                // Non-owner was the sole remaining rider: just end the started ride.
                // The ride event itself stays intact, just marked inactive.
                AppLogger.info(this.getClass(), "Sole remaining rider (not owner) left. Deactivating ride.",
                        "generatedRidesId", generatedRidesId);

                ride.setActive(false);

                ridesRepository.save(ride);

                AppLogger.info(this.getClass(), "Ride deactivated", "generatedRidesId", generatedRidesId);
            }

            return;
        }

        // If creator is leaving but others remain — transfer ownership to a random participant
        if (isCreator) {
            Rider newCreator = remainingParticipants.iterator().next();

            ride.setUsername(newCreator);
            startedRide.setUsername(newCreator);

            AppLogger.info(this.getClass(), "Creator left; transferred ownership to new creator",
                    "previousCreator", rider.getUsername(),
                    "newCreator", newCreator.getUsername(),
                    "generatedRidesId", generatedRidesId);
        }

        startedRideRepository.save(startedRide);
        ridesRepository.save(ride);

        AppLogger.info(this.getClass(), "Rider left ride successfully",
                "rider", rider.getUsername(), "generatedRidesId", generatedRidesId);
    }
    @Transactional
    public void deactivateRide(String generatedRidesId) {
        AppLogger.info(this.getClass(), "deactivateRide called", "generatedRidesId", generatedRidesId);

        Rider initiator = startedUtil.authenticateAndGetInitiator();

        Rides ride = ridesRepository.findByGeneratedRidesId(generatedRidesId)
                .orElseThrow(() -> {
                    AppLogger.warn(this.getClass(), "Ride not found for deactivation", "rideId", generatedRidesId);
                    return new IllegalArgumentException("Ride not found: " + generatedRidesId);
                });



        boolean isCreator = ride.getUsername().getUsername().equals(initiator.getUsername());
        if (!isCreator) {
            AppLogger.warn(this.getClass(), "Unauthorized ride stop attempt",
                    "initiator", initiator.getUsername(), "rideId", generatedRidesId);
            throw new RideAuthorizationException("Only the current ride creator can stop the ride");
        }

        startedRideRepository.findByRideGeneratedRidesId(generatedRidesId).ifPresent(startedRide -> {
            startedRideRepository.deleteRiderLocationsByStartedRideId(generatedRidesId);
            startedRideRepository.deleteParticipantLocationsByStartedRideId(generatedRidesId);
            startedRideRepository.deleteParticipantsByStartedRideId(generatedRidesId);
            startedRideRepository.delete(startedRide);
            startedRideRepository.flush();
        });

        ride.setActive(false);
        AppLogger.info(this.getClass(), "Ride deactivated successfully", "generatedRidesId", generatedRidesId);
        ridesRepository.save(ride);
    }


    @Transactional
    public void leaveRidePreStart(String generatedRidesId) {
        AppLogger.info(this.getClass(), "leaveRidePreStart called", "generatedRidesId", generatedRidesId);

        Rider rider = startedUtil.authenticateAndGetInitiator();

        Rides ride = ridesRepository.findByGeneratedRidesId(generatedRidesId)
                .orElseThrow(() -> new IllegalArgumentException("Ride not found: " + generatedRidesId));

        // Guard: if the ride has already been started, this is the wrong endpoint
        if (ride.getActive()) {
            throw new IllegalStateException(
                    "Ride has already been started. Use leaveRide instead.");
        }

        boolean isParticipant = ride.getParticipants()
                .stream()
                .anyMatch(p -> p.getUsername().equals(rider.getUsername()));
        if (!isParticipant) {
            throw new IllegalStateException(
                    "You are not a participant of this ride: " + generatedRidesId);
        }

        boolean isCreator = ride.getUsername().getUsername().equals(rider.getUsername());
        if (isCreator) {
            // Same rule as the started-ride flow — owner must delete/manage the ride instead
            throw new RideAuthorizationException(
                    "Creator cannot leave ride. You must delete the ride instead.");
        }

        ride.getParticipants().remove(rider);
        ridesRepository.save(ride);

        AppLogger.info(this.getClass(), "Rider left ride (pre-start) successfully",
                "rider", rider.getUsername(), "generatedRidesId", generatedRidesId);
    }
}