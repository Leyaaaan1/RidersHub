package leyans.RidersHub.Service;


import jakarta.transaction.Transactional;
import leyans.RidersHub.DTO.Response.LocationResponseDTO;
import leyans.RidersHub.DTO.Response.RideResponseDTO;
import leyans.RidersHub.DTO.newRidesDTO;
import leyans.RidersHub.Repository.LocationRepository;
import leyans.RidersHub.Repository.RiderRepository;
import leyans.RidersHub.Repository.RiderTypeRepository;
import leyans.RidersHub.Repository.RidesRepository;
import leyans.RidersHub.model.Dynamic.Locations;
import leyans.RidersHub.model.Rider;
import leyans.RidersHub.model.RiderType;
import leyans.RidersHub.model.Rides;
import org.locationtech.jts.geom.GeometryFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class RidesService {

    private final RidesRepository ridesRepository;
    private final RiderRepository riderRepository;
    private final RiderTypeRepository riderTypeRepository;

    @Autowired
    private final KafkaTemplate<Object, RideResponseDTO> kafkaTemplate;
    @Autowired
    private final KafkaTemplate<Object, LocationResponseDTO> kafkaTemplate2;



    public RidesService(RiderRepository riderRepository,
                        RiderTypeRepository riderTypeRepository, RidesRepository ridesRepository,
                        KafkaTemplate<Object, RideResponseDTO> kafkaTemplate,
                        KafkaTemplate<Object, LocationResponseDTO> kafkaTemplate2) {
        this.riderRepository = riderRepository;
        this.riderTypeRepository = riderTypeRepository;
        this.ridesRepository = ridesRepository;
        this.kafkaTemplate = kafkaTemplate;
        this.kafkaTemplate2 = kafkaTemplate2;
    }

    @Transactional
    public RideResponseDTO createRide(String username, String ridesName, String locationName,
                                      String riderType, Integer distance, String startingPoint,
                                      LocalDateTime date, double latitude, double longitude,
                                      String endingPoint) {

        Rider rider = riderRepository.findByUsername(username);
        RiderType newRiderType = riderTypeRepository.findByRiderType(riderType);

        // 1️⃣ Save Rides Synchronously
        Rides newRides = new Rides();
        newRides.setLocationName(locationName);
        newRides.setRidesName(ridesName);
        newRides.setUsername(rider);
        newRides.setDistance(distance);
        newRides.setStartingPoint(startingPoint);
        newRides.setEndingPoint(endingPoint);
        newRides.setDate(date);
        newRides.setRiderType(newRiderType);
        newRides.setLatitude(latitude);
        newRides.setLongitude(longitude);

        newRides = ridesRepository.save(newRides);


        // DTO for kafka  updates of new rides
        RideResponseDTO ridesDTO = new RideResponseDTO(
                newRides.getLocationName(),
                newRides.getRidesName(),
                newRides.getUsername(),
                newRides.getRiderType(),
                newRides.getDistance(),
                newRides.getStartingPoint(),
                newRides.getEndingPoint(),
                newRides.getDate(),
                newRides.getLatitude(),
                newRides.getLongitude()

        );
        //DTO for kafka location updates of new rides
        LocationResponseDTO newLocations = new LocationResponseDTO(
                newRides.getLocationName(),
                newRides.getUsername().getUsername(),
                newRides.getLatitude(),
                newRides.getLongitude()
        );
        kafkaTemplate.send("location", ridesDTO);
        kafkaTemplate2.send("new-location", newLocations);
        return ridesDTO;
    }

}




