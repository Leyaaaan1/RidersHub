package leyans.RidersHub.Service;


import jakarta.transaction.Transactional;
import leyans.RidersHub.DTO.Response.RideResponseDTO;
import leyans.RidersHub.Repository.PsgcDataRepository;
import leyans.RidersHub.Repository.RiderRepository;
import leyans.RidersHub.Repository.RiderTypeRepository;
import leyans.RidersHub.Repository.RidesRepository;
import leyans.RidersHub.model.Rider;
import leyans.RidersHub.model.RiderType;
import leyans.RidersHub.model.Rides;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class RidesService {

    private final RidesRepository ridesRepository;

    private final KafkaTemplate<Object, RideResponseDTO> kafkaTemplate;

    @Autowired
    private final LocationService locationService;

    private final RiderService riderService;


    @Autowired
    public RidesService(RidesRepository ridesRepository,
                        KafkaTemplate<Object, RideResponseDTO> kafkaTemplate,
                        LocationService locationService, RiderService riderService) {

        this.ridesRepository = ridesRepository;
        this.kafkaTemplate = kafkaTemplate;
        this.riderService = riderService;
        this.locationService = locationService;
    }

    @Transactional
    public RideResponseDTO createRide(String creatorUsername, String ridesName, String locationName, String riderType, Integer distance, LocalDateTime date,
                                      List<String> participantUsernames, String description,
                                      double latitude, double longitude, double startLatitude, double startLongitude, double endLatitude, double endLongitude) {


        Rider creator = riderService.getRiderByUsername(creatorUsername);
        RiderType rideType = riderService.getRiderTypeByName(riderType);
        List<Rider> participants = riderService.addRiderParticipants(participantUsernames);

        Point rideLocation = locationService.createPoint(longitude, latitude);
        Point startPoint = locationService.createPoint(startLongitude, startLatitude);
        Point endPoint = locationService.createPoint(endLongitude, endLatitude);
        String resolvedLocationName = locationService.resolveBarangayName(locationName, latitude, longitude);
        String startLocationName = locationService.resolveBarangayName(null, startLatitude, startLongitude);
        String endLocationName = locationService.resolveBarangayName(null, endLatitude, endLongitude);


        Rides newRide = new Rides();
        newRide.setRidesName(ridesName);
        newRide.setLocationName(resolvedLocationName);
        newRide.setDescription(description);
        newRide.setRiderType(rideType);
        newRide.setUsername(creator);
        newRide.setDistance(distance);
        newRide.setParticipants(participants);
        newRide.setStartingLocation(startPoint);
        newRide.setEndingLocation(endPoint);
        newRide.setStartingPointName(startLocationName);
        newRide.setEndingPointName(endLocationName);
        newRide.setDate(date);
        newRide.setLocation(rideLocation);

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
                ride.getEndingLocation().getX()
        );
    }
}
