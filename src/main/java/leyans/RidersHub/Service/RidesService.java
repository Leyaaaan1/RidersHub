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


    @Autowired
    private PsgcDataRepository psgcDataRepository;

    @Autowired
    private NominatimService nominatimService;

    @Autowired
    private final KafkaTemplate<Object, RideResponseDTO> kafkaTemplate;



    public RidesService(RiderRepository riderRepository,
                        RiderTypeRepository riderTypeRepository, RidesRepository ridesRepository ,
                        KafkaTemplate<Object, RideResponseDTO> kafkaTemplate) {
        this.riderRepository = riderRepository;
        this.riderTypeRepository = riderTypeRepository;
        this.ridesRepository = ridesRepository;
        this.kafkaTemplate = kafkaTemplate;
    }

    @Transactional
    public RideResponseDTO createRide(String username,
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
                                      double endLongitude
                                     ) {



        Rider rider = riderRepository.findByUsername(username);

        RiderType newRiderType = riderTypeRepository.findByRiderType(riderType);

        GeometryFactory geometryFactory = new GeometryFactory();

        Point coordinates = geometryFactory.createPoint(new Coordinate(longitude, latitude));
        coordinates.setSRID(4326);

        String barangayName = nominatimService.getBarangayNameFromCoordinates(latitude, longitude);
        String resolvedLocationName = locationName;
        if (barangayName != null) {
            List<PsgcData> psgcDataList = psgcDataRepository.findByNameIgnoreCase(barangayName);
            resolvedLocationName = !psgcDataList.isEmpty() ? psgcDataList.get(0).getName() : barangayName;
        }

        String startLocationName = nominatimService.getBarangayNameFromCoordinates(startLatitude, startLongitude);
        String endLocationName = nominatimService.getBarangayNameFromCoordinates(endLatitude, endLongitude);

        if (startLocationName == null) {
            startLocationName = "Lat: " + startLatitude + ", Lng: " + startLongitude;
        }
        if (endLocationName == null) {
            endLocationName = "Lat: " + endLatitude + ", Lng: " + endLongitude;
        }


        Point startPoint = geometryFactory.createPoint(new Coordinate(startLongitude, startLatitude));
        Point endPoint = geometryFactory.createPoint(new Coordinate(endLongitude, endLatitude));
        startPoint.setSRID(4326);
        endPoint.setSRID(4326);



        Rides newRides = new Rides();
      //  newRides.setLocationName(locationName);
        newRides.setLocationName(resolvedLocationName);
        newRides.setRidesName(ridesName);
        newRides.setDescription(description);
        newRides.setRiderType(newRiderType);
        newRides.setUsername(rider);
        newRides.setDistance(distance);


        if (participantUsernames != null && !participantUsernames.isEmpty()) {
            List<Rider> participants = participantUsernames.stream()
                    .map(riderRepository::findByUsername)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
            newRides.setParticipants(participants);


        newRides.setStartingPointName(startLocationName);
        newRides.setEndingPointName(endLocationName);

        newRides.setStartingLocation(startPoint);
        newRides.setEndingLocation(endPoint);
        newRides.setDate(date);
        newRides.setLocation(coordinates);






        }
        try {
            newRides = ridesRepository.save(newRides);
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }

        if (newRides.getLocation() != null) {
            latitude = newRides.getLocation().getY();
            longitude = newRides.getLocation().getX();

        }


        if (newRides.getStartingLocation() != null) {
            startLatitude = newRides.getStartingLocation().getY();
            startLongitude = newRides.getStartingLocation().getX();
        }

        if (newRides.getEndingLocation() != null) {
            endLatitude = newRides.getEndingLocation().getY();
            endLongitude = newRides.getEndingLocation().getX();
        }

        List<String> listUsername = newRides.getParticipants().stream()
                .map(Rider::getUsername)
                .toList();

        RideResponseDTO ridesDTO = new RideResponseDTO(

                newRides.getRidesName(),
                newRides.getLocationName(),
                newRides.getRiderType(),
                newRides.getDistance(),
                newRides.getDate(),
                latitude,
                longitude,
                listUsername,
                newRides.getDescription(),
                newRides.getStartingPointName(),
                startLatitude,
                startLongitude,
                newRides.getEndingPointName(),
                endLatitude,
                endLongitude
        );

        kafkaTemplate.send("location", ridesDTO);
        return ridesDTO;
    }



}




