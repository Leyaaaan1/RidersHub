package leyans.RidersHub.Service;

import leyans.RidersHub.DTO.ParticipantLocationDTO;
import leyans.RidersHub.DTO.Response.RideResponseDTO;
import leyans.RidersHub.DTO.Response.StartRideResponseDTO;
import leyans.RidersHub.Repository.ParticipantLocationRepository;
import leyans.RidersHub.Repository.StartedRideRepository;
import leyans.RidersHub.Util.RiderUtil;
import leyans.RidersHub.model.Rider;
import leyans.RidersHub.model.Rides;
import leyans.RidersHub.model.StartedRide;
import leyans.RidersHub.model.participant.ParticipantLocation;
import org.locationtech.jts.geom.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StartRideService {

    private final StartedRideRepository startedRideRepository;
    private final RiderUtil riderUtil;
    private final RidesService ridesService;
    private final LocationService locationService;

    private final ParticipantLocationRepository participantLocationRepository;

    @Autowired
    public StartRideService(StartedRideRepository startedRideRepository,
                            RiderUtil riderUtil,
                            RidesService ridesService,
                            LocationService locationService,
                            ParticipantLocationRepository participantLocationRepository) {
        this.startedRideRepository = startedRideRepository;
        this.riderUtil = riderUtil;
        this.ridesService = ridesService;
        this.locationService = locationService;
        this.participantLocationRepository = participantLocationRepository;
    }

    /**
     * Start a ride and initialize all participant locations at the starting point
     */
    @Transactional
    public StartRideResponseDTO startRide(Integer generatedRidesId) throws AccessDeniedException {
        Rider initiator = authenticateAndGetInitiator();
        Rides ride = validateAndGetRide(generatedRidesId, initiator);

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
        List<ParticipantLocation> participantLocations = initializeParticipantLocations(
                startedRide,
                allParticipants,
                startingPoint  // All participants start at the same point
        );

        return buildStartRideResponse(startedRide, ride, participantLocations);
    }

    @Transactional
    public void stopRides(Integer generatedRidesId) throws java.nio.file.AccessDeniedException {
        Rider requester = authenticateAndGetInitiator();

        StartedRide startedRide = startedRideRepository
                .findByRideGeneratedRidesId(generatedRidesId)
                .orElseThrow(() -> new IllegalArgumentException("Started ride not found for id: " + generatedRidesId));

        boolean isCreator = startedRide.getRide().getUsername().getUsername().equals(requester.getUsername());
        boolean isInitiator = startedRide.getUsername().getUsername().equals(requester.getUsername());

        if (!isCreator && !isInitiator) {
            throw new java.nio.file.AccessDeniedException("Only the ride creator or initiator can stop the ride");
        }

        // delete participant locations first to avoid foreign key constraint issues
        participantLocationRepository.deleteAllByStartedRide(startedRide);

        // then delete the started ride
        startedRideRepository.delete(startedRide);
    }
    private List<ParticipantLocation> initializeParticipantLocations(
            StartedRide startedRide,
            List<Rider> participants,
            Point startingPoint) {

        List<ParticipantLocation> locations = new ArrayList<>();

        for (Rider participant : participants) {
            ParticipantLocation location = new ParticipantLocation();
            location.setStartedRide(startedRide);
            location.setRider(participant);

            // Create a new Point instance for each participant with the same coordinates
            Point participantStartPoint = locationService.createPoint(
                    startingPoint.getX(),  // longitude
                    startingPoint.getY()   // latitude
            );

            // Use the correct setter name from ParticipantLocation entity
            location.setParticipantLocation(participantStartPoint);  // Changed from setLocation
            location.setLastUpdate(LocalDateTime.now());  // Changed from setLastUpdated

            locations.add(participantLocationRepository.save(location));
        }

        return locations;
    }

    /**
     * Build the response DTO with all participant locations
     */
    private StartRideResponseDTO buildStartRideResponse(
            StartedRide startedRide,
            Rides ride,
            List<ParticipantLocation> participantLocations) {

        StartRideResponseDTO response = new StartRideResponseDTO();
        response.setGeneratedRidesId(ride.getGeneratedRidesId());
        response.setRidesName(ride.getRidesName());
        response.setLocationName(ride.getLocationName());

        // Get the ride's starting location
        Point startPoint = ride.getStartingLocation();
        if (startPoint != null) {
            response.setStartLatitude(startPoint.getY());  // latitude
            response.setStartLongitude(startPoint.getX()); // longitude
        }

        response.setStartPointName(ride.getStartingPointName());
        response.setLatitude(ride.getLocation().getY());
        response.setLongitude(ride.getLocation().getX());
        response.setStartTime(startedRide.getStartTime());
        response.setInitiator(startedRide.getUsername().getUsername());
        response.setRouteCoordinates(ride.getRouteCoordinates());
        response.setEstimatedDistance(ride.getDistance());

        // Map participant locations
        List<ParticipantLocationDTO> participantDTOs = participantLocations.stream()
                .map(pl -> new ParticipantLocationDTO(
                        pl.getRider().getUsername(),
                        pl.getParticipantLocation().getY(),  // latitude
                        pl.getParticipantLocation().getX(),  // longitude
                        pl.getLastUpdate()
                ))
                .collect(Collectors.toList());

        response.setParticipants(participantDTOs);
        response.setParticipantUsernames(
                participantLocations.stream()
                        .map(pl -> pl.getRider().getUsername())
                        .collect(Collectors.toList())
        );

        return response;
    }

    /**
     * Get current started rides for the authenticated user
     */
    @PreAuthorize("isAuthenticated()")
    @Transactional(readOnly = true)
    public List<RideResponseDTO> getCurrentStartedRides() throws AccessDeniedException {
        Rider requester = authenticateAndGetInitiator();
        List<StartedRide> startedRides = riderUtil.findStartedRidesByRider(requester);

        return startedRides.stream()
                .map(sr -> mapToRideResponseDTO(sr.getRide()))
                .toList();
    }

    /**
     * Authenticate and get the current initiator from security context
     */
    public Rider authenticateAndGetInitiator() throws AccessDeniedException {
        String username = riderUtil.getCurrentUsername();
        Rider initiator = riderUtil.findRiderByUsername(username);

        if (initiator == null) {
            throw new AccessDeniedException("Rider not found with username: " + username);
        }

        return initiator;
    }

    /**
     * Validate the ride and check permissions
     */
    private Rides validateAndGetRide(Integer generatedRidesId, Rider initiator) throws AccessDeniedException {
        Rides ride = riderUtil.findRideById(generatedRidesId);

        if (ride == null) {
            throw new RuntimeException("Ride not found with ID: " + generatedRidesId);
        }

        if (ride.getUsername() == null) {
            throw new RuntimeException("Ride does not have a valid creator");
        }

        // Check if the ride is already started
        if (startedRideRepository.existsByRide(ride)) {
            throw new IllegalStateException("This ride has already been started");
        }

        // Check if the initiator already has an ongoing ride
        if (startedRideRepository.existsByUsername(initiator)) {
            throw new IllegalStateException("You already have a ride in progress");
        }

        return ride;
    }

    /**
     * Map Rides entity to RideResponseDTO
     */
    private RideResponseDTO mapToRideResponseDTO(Rides ride) {
        return new RideResponseDTO(
                ride.getGeneratedRidesId(),
                ride.getLocationName(),
                ride.getRidesName(),
                ride.getRiderType(),
                ride.getDistance(),
                ride.getDate(),
                ride.getLocation().getY(),
                ride.getLocation().getX(),
                ride.getParticipants().stream().map(Rider::getUsername).toList(),
                ride.getDescription(),
                ride.getStartingPointName(),
                ride.getStartingLocation().getY(),
                ride.getStartingLocation().getX(),
                ride.getEndingPointName(),
                ride.getEndingLocation().getY(),
                ride.getEndingLocation().getX(),
                ride.getMapImageUrl(),
                ride.getMagImageStartingLocation(),
                ride.getMagImageEndingLocation(),
                ride.getUsername().getUsername(),
                ride.getRouteCoordinates(),
                ridesService.mapStopPointsToDTOs(ride.getStopPoints())
        );
    }


}