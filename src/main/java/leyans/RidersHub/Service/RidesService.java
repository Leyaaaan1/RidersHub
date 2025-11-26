package leyans.RidersHub.Service;


import jakarta.persistence.EntityNotFoundException;
import leyans.RidersHub.DTO.Response.RideResponseDTO;
import leyans.RidersHub.DTO.StopPointDTO;
import leyans.RidersHub.Repository.RidesRepository;
import leyans.RidersHub.Service.Auth.InviteRequestService;
import leyans.RidersHub.Service.MapService.MapBox.MapboxService;
import leyans.RidersHub.Service.MapService.RouteService;
import leyans.RidersHub.Utility.RiderUtil;
import leyans.RidersHub.model.Rider;
import leyans.RidersHub.model.RiderType;
import leyans.RidersHub.model.Rides;
import leyans.RidersHub.model.StopPoint;
import leyans.RidersHub.model.auth.InviteRequest;
import org.locationtech.jts.geom.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RidesService {

    private final RidesRepository ridesRepository;


    @Autowired
    private final LocationService locationService;
    private final RiderService riderService;
    private final MapboxService mapboxService;
    private final RideParticipantService rideParticipantService;
    private final RiderUtil riderUtil;
    private final RouteService routeService;
    private final InviteRequestService inviteRequestService;


    @Autowired
    public RidesService(RidesRepository ridesRepository,

                        LocationService locationService, RiderService riderService, MapboxService mapboxService, RideParticipantService rideParticipantService, RiderUtil riderUtil, RouteService routeService, InviteRequestService inviteRequestService) {

        this.ridesRepository = ridesRepository;
        this.riderService = riderService;
        this.locationService = locationService;
        this.mapboxService = mapboxService;
        this.rideParticipantService = rideParticipantService;
        this.riderUtil = riderUtil;
        this.routeService = routeService;
        this.inviteRequestService = inviteRequestService;
    }

    @Transactional
    public RideResponseDTO createRide( Integer generatedRidesId, String creatorUsername, String ridesName, String locationName, String riderType, LocalDateTime date,
                                      List<String> participantUsernames, String description,
                                      double latitude, double longitude, double startLatitude,
                                      double startLongitude, double endLatitude, double endLongitude,
                                       List<StopPointDTO> stopPointsDto
                                       ) {

        String imageUrl = mapboxService.getStaticMapImageUrl(longitude, latitude);
        String startImageUrl = mapboxService.getStaticMapImageUrl(startLongitude, startLatitude);
        String endImageUrl = mapboxService.getStaticMapImageUrl(endLongitude, endLatitude);

        List<StopPointDTO> validStopPoints = stopPointsDto.stream()
                .filter(stop -> stop.getStopLongitude() != 0.0 && stop.getStopLatitude() != 0.0)
                .collect(Collectors.toList());

        String routeCoordinates = routeService.getRouteDirections(
                startLongitude, startLatitude,
                endLongitude, endLatitude,
                validStopPoints,  // Use filtered list
                "driving-car"
        );

        Rider creator = riderService.getRiderByUsername(creatorUsername);
        RiderType rideType = riderService.getRiderTypeByName(riderType);
        List<Rider> participants = rideParticipantService.addRiderParticipants(participantUsernames);

        Point rideLocation = locationService.createPoint(longitude, latitude);
        Point startPoint = locationService.createPoint(startLongitude, startLatitude);
        Point endPoint = locationService.createPoint(endLongitude, endLatitude);



        String resolvedLocationName = locationService.resolveLandMark(locationName, latitude, longitude);
        String startLocationName = locationService.resolveBarangayName(null, startLatitude, startLongitude);
        String endLocationName = locationService.resolveBarangayName(null, endLatitude, endLongitude);

        List<StopPoint> stopPoints = convertStopPointDTOs(stopPointsDto);

        int calculatedDistance = locationService.calculateDistance(startPoint, endPoint);

        Rides newRide = new Rides();
        newRide.setGeneratedRidesId(generatedRidesId != null ? generatedRidesId : generateUniqueRideId());
        newRide.setStopPoints(stopPoints);
        newRide.setRidesName(ridesName);
        newRide.setDescription(description);
        newRide.setRiderType(rideType);
        newRide.setUsername(creator);
        newRide.setDistance(calculatedDistance);
        newRide.setParticipants(participants);

        newRide.setLocationName(resolvedLocationName);
        newRide.setLocation(rideLocation);

        newRide.setStartingLocation(startPoint);
        newRide.setStartingPointName(startLocationName);

        newRide.setEndingLocation(endPoint);
        newRide.setEndingPointName(endLocationName);

        newRide.setDate(date);

        newRide.setMapImageUrl(imageUrl);
        newRide.setMagImageStartingLocation(startImageUrl);
        newRide.setMagImageEndingLocation(endImageUrl);
        newRide.setRouteCoordinates(routeCoordinates);
        newRide.setActive(false);



        try {
            newRide = ridesRepository.save(newRide);

            inviteRequestService.generateInviteForNewRide(
                    newRide.getGeneratedRidesId(),
                    creator,
                    InviteRequest.InviteStatus.PENDING,
                    LocalDateTime.now(),
                    LocalDateTime.now().plusMonths(1)
            );
        } catch (Exception ex) {
            throw new RuntimeException("Failed to save ride: " + ex.getMessage(), ex);
        }

        RideResponseDTO response = mapToResponseDTO(newRide);
        return response;
    }



    @Transactional(readOnly = true)
    public List<StopPointDTO> getStopPointsDTOByGeneratedRideId(Integer generatedRidesId) {
        Rides ride = findRideEntityByGeneratedId(generatedRidesId);
        String currentUsername = riderUtil.getCurrentUsername();
        boolean isOwner = ride.getUsername().getUsername().equals(currentUsername);
        boolean isParticipant = ride.getParticipants().stream()
                .anyMatch(rider -> rider.getUsername().equals(currentUsername));
        if (!isOwner && !isParticipant) {
            throw new org.springframework.security.access.AccessDeniedException("Access denied: not owner or participant");
        }
        return mapStopPointsToDTOs(ride.getStopPoints());
    }

    private List<StopPoint> convertStopPointDTOs(List<StopPointDTO> stopPointsDto) {
        if (stopPointsDto == null) return List.of();
        return stopPointsDto.stream()
                .map(dto -> new StopPoint(
                        locationService.resolveBarangayName(null, dto.getStopLatitude(), dto.getStopLongitude()),
                        locationService.createPoint( dto.getStopLongitude(), dto.getStopLatitude())
                ))
                .toList();
    }
    private int generateUniqueRideId() {
        int randomFourDigitNumber;
        boolean idExists;

        do {
            randomFourDigitNumber = 1000 + (int)(Math.random() * 9000);
            idExists = ridesRepository.findByGeneratedRidesId(randomFourDigitNumber).isPresent();
        } while (idExists);

        return randomFourDigitNumber;
    }
    private RideResponseDTO mapToResponseDTO(Rides ride) {
        return new RideResponseDTO(
                ride.getGeneratedRidesId(),
                ride.getRidesName(),
                ride.getLocationName(),
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

                mapStopPointsToDTOs(ride.getStopPoints()),
                ride.getActive()

        );    }

    public List<StopPointDTO> mapStopPointsToDTOs(List<StopPoint> stopPoints) {
        return stopPoints.stream()
                .map(stopPoint -> new StopPointDTO(
                        stopPoint.getStopName(),
                        stopPoint.getStopLocation().getX(),
                        stopPoint.getStopLocation().getY()
                ))
                .toList();
    }
    @Transactional
    public String getRideMapImageUrlById(Integer generatedRidesId) {
        Rides ride = findRideEntityByGeneratedId(generatedRidesId);
        return ride.getMapImageUrl();
    }

    @Transactional
    public RideResponseDTO findRideByGeneratedId(Integer generatedRidesId) {
        Rides ride = findRideEntityByGeneratedId(generatedRidesId);
        return mapToResponseDTO(ride);
    }

    @Transactional
    public List<RideResponseDTO> findRidesByUsername(String username) {
        List<Rides> rides = ridesRepository.findByUsername_Username(username);
        return rides.stream()
                .map(this::mapToResponseDTO)
                .toList();
    }



    public Page<RideResponseDTO> getPaginatedRides(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Rides> ridesPage = ridesRepository.findAll(pageable);
        return ridesPage.map(this::mapToResponseDTO);
    }


    @Transactional
    public Rides findRideEntityByGeneratedId(Integer generatedRidesId) {
        return ridesRepository.findByGeneratedRidesId(generatedRidesId)
                .orElseThrow(() -> new EntityNotFoundException("Ride not found with ID: " + generatedRidesId));
    }


}
