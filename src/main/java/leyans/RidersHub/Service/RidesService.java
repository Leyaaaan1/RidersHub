package leyans.RidersHub.Service;


import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import leyans.RidersHub.DTO.Response.RideResponseDTO;
import leyans.RidersHub.Repository.RidesRepository;
import leyans.RidersHub.Service.MapService.MapBox.MapImageService;
import leyans.RidersHub.Service.MapService.MapBox.MapboxService;
import leyans.RidersHub.model.Rider;
import leyans.RidersHub.model.RiderType;
import leyans.RidersHub.model.Rides;
import org.locationtech.jts.geom.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RidesService {

    private final RidesRepository ridesRepository;

    private final KafkaTemplate<Object, RideResponseDTO> kafkaTemplate;

    @Autowired
    private final LocationService locationService;

    private final RiderService riderService;

    private final MapImageService mapImageService;
    private final MapboxService mapboxService;


    @Autowired
    public RidesService(RidesRepository ridesRepository,
                        KafkaTemplate<Object, RideResponseDTO> kafkaTemplate,
                        LocationService locationService, RiderService riderService, MapImageService mapImageService, MapboxService mapboxService) {

        this.ridesRepository = ridesRepository;
        this.kafkaTemplate = kafkaTemplate;
        this.riderService = riderService;
        this.locationService = locationService;
        this.mapImageService = mapImageService;
        this.mapboxService = mapboxService;
    }

    @Transactional
    public RideResponseDTO createRide( Integer generatedRidesId, String creatorUsername, String ridesName, String locationName, String riderType, Integer distance, LocalDateTime date,
                                      List<String> participantUsernames, String description,
                                      double latitude, double longitude, double startLatitude,
                                      double startLongitude, double endLatitude, double endLongitude, String mapImageUrl,
                                       String magImageStartingLocation, String magImageEndingLocation) {

        String imageUrl = mapboxService.getStaticMapImageUrl(longitude, latitude);
        String startImageUrl = mapboxService.getStaticMapImageUrl(startLongitude, startLatitude);
        String endImageUrl = mapboxService.getStaticMapImageUrl(endLongitude, endLatitude);



        Rider creator = riderService.getRiderByUsername(creatorUsername);
        RiderType rideType = riderService.getRiderTypeByName(riderType);
        List<Rider> participants = riderService.addRiderParticipants(participantUsernames);

        Point rideLocation = locationService.createPoint(longitude, latitude);
        Point startPoint = locationService.createPoint(startLongitude, startLatitude);
        Point endPoint = locationService.createPoint(endLongitude, endLatitude);
        String resolvedLocationName = locationService.resolveBarangayName(locationName, latitude, longitude);
        String startLocationName = locationService.resolveBarangayName(null, startLatitude, startLongitude);
        String endLocationName = locationService.resolveBarangayName(null, endLatitude, endLongitude);


        int calculatedDistance = locationService.calculateDistance(startPoint, endPoint);

        Rides newRide = new Rides();
        if (generatedRidesId == null) {
            int randomFourDigitNumber = 1000 + (int)(Math.random() * 9000); // Generates number between 1000-9999
            newRide.setGeneratedRidesId(randomFourDigitNumber);
        } else {
            newRide.setGeneratedRidesId(generatedRidesId);
        }

        newRide.setRidesName(ridesName);
        newRide.setRidesName(ridesName);
        newRide.setLocationName(resolvedLocationName);
        newRide.setDescription(description);
        newRide.setRiderType(rideType);
        newRide.setUsername(creator);
        newRide.setDistance(calculatedDistance);
        newRide.setParticipants(participants);
        newRide.setStartingLocation(startPoint);
        newRide.setEndingLocation(endPoint);
        newRide.setStartingPointName(startLocationName);
        newRide.setEndingPointName(endLocationName);
        newRide.setDate(date);
        newRide.setLocation(rideLocation);
        newRide.setMapImageUrl(imageUrl);
        newRide.setMagImageStartingLocation(startImageUrl);
        newRide.setMagImageEndingLocation(endImageUrl);

        try {
            newRide = ridesRepository.save(newRide);
        } catch (Exception ex) {
            throw new RuntimeException("Failed to save ride: " + ex.getMessage(), ex);
        }

        RideResponseDTO response = mapToResponseDTO(newRide);
       kafkaTemplate.send("location", response);
        return response;
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
                ride.getMagImageEndingLocation()
        );
    }


    @Transactional
    public String getRideMapImageUrlById(Integer generatedRidesId) {
        Rides ride = ridesRepository.findByGeneratedRidesId(generatedRidesId)
                .orElseThrow(() -> new EntityNotFoundException("Ride not found with ID: " + generatedRidesId));
        return ride.getMapImageUrl();
    }

    @Transactional
    public RideResponseDTO findRideByGeneratedId(Integer generatedRidesId) {
        Rides ride = ridesRepository.findByGeneratedRidesId(generatedRidesId)
                .orElseThrow(() -> new EntityNotFoundException("Ride not found with ID: " + generatedRidesId));
        return mapToResponseDTO(ride);
    }

    public Page<RideResponseDTO> getRidesWithPagination(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Rides> ridesPage = ridesRepository.findAll(pageable);

        return ridesPage.map(this::mapToResponseDTO);
    }


}
