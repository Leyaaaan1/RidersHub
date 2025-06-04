package leyans.RidersHub.Service;


import jakarta.transaction.Transactional;
import leyans.RidersHub.DTO.Response.RideResponseDTO;
import leyans.RidersHub.Repository.PsgcDataRepository;
import leyans.RidersHub.Repository.RiderRepository;
import leyans.RidersHub.Repository.RiderTypeRepository;
import leyans.RidersHub.Repository.RidesRepository;
import leyans.RidersHub.model.PsgcData;
import leyans.RidersHub.model.Rider;
import leyans.RidersHub.model.RiderType;
import leyans.RidersHub.model.Rides;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.net.http.HttpHeaders;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RidesService {

    private final RidesRepository ridesRepository;
    private final RiderRepository riderRepository;
    private final RiderTypeRepository riderTypeRepository;
    private final KafkaTemplate<Object, RideResponseDTO> kafkaTemplate;
    private final PsgcDataRepository psgcDataRepository;
    private final NominatimService nominatimService;

    private final GeometryFactory geometryFactory = new GeometryFactory();

    @Autowired
    public RidesService(RiderRepository riderRepository,
                        RiderTypeRepository riderTypeRepository,
                        RidesRepository ridesRepository,
                        KafkaTemplate<Object, RideResponseDTO> kafkaTemplate,
                        PsgcDataRepository psgcDataRepository,
                        NominatimService nominatimService) {
        this.riderRepository = riderRepository;
        this.riderTypeRepository = riderTypeRepository;
        this.ridesRepository = ridesRepository;
        this.kafkaTemplate = kafkaTemplate;
        this.psgcDataRepository = psgcDataRepository;
        this.nominatimService = nominatimService;
    }

    @Transactional
    public RideResponseDTO createRide(String creatorUsername,
                                      String ridesName,
                                      String locationName,
                                      String riderType,
                                      Integer distance,
                                      LocalDateTime date,
                                      double latitude,
                                      double longitude,
                                      List<String> participantUsernames,
                                      String description,
                                      double startLatitude,
                                      double startLongitude,
                                      double endLatitude,
                                      double endLongitude) {

        Rider creator = getRiderByUsername(creatorUsername);
        RiderType rideType = getRiderTypeByName(riderType);

        Point rideLocation = createPoint(longitude, latitude);
        Point startPoint = createPoint(startLongitude, startLatitude);
        Point endPoint = createPoint(endLongitude, endLatitude);

        String resolvedLocationName = resolveBarangayName(locationName, latitude, longitude);
        String startLocationName = resolveBarangayName(null, startLatitude, startLongitude);
        String endLocationName = resolveBarangayName(null, endLatitude, endLongitude);

        List<Rider> participants = resolveParticipants(participantUsernames);

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

    private Rider getRiderByUsername(String username) {
        Rider rider = riderRepository.findByUsername(username);
        if (rider == null) {
            throw new IllegalArgumentException("Rider not found: " + username);
        }
        return rider;
    }

    private RiderType getRiderTypeByName(String typeName) {
        RiderType type = riderTypeRepository.findByRiderType(typeName);
        if (type == null) {
            throw new IllegalArgumentException("RiderType not found: " + typeName);
        }
        return type;
    }


    private List<Rider> resolveParticipants(List<String> usernames) {
        if (usernames == null) return List.of();
        return usernames.stream()
                .map(riderRepository::findByUsername)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    private String resolveBarangayName(String fallback, double lat, double lon) {
        String barangay = nominatimService.getBarangayNameFromCoordinates(lat, lon);
        if (barangay == null) {
            return fallback != null ? fallback : "Lat: " + lat + ", Lng: " + lon;
        }
        return psgcDataRepository.findByNameIgnoreCase(barangay)
                .stream()
                .findFirst()
                .map(PsgcData::getName)
                .orElse(barangay);
    }

    private Point createPoint(double longitude, double latitude) {
        Point point = geometryFactory.createPoint(new Coordinate(longitude, latitude));
        point.setSRID(4326);
        return point;
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
