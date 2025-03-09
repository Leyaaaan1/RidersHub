package leyans.RidersHub.Service;


import jakarta.transaction.Transactional;
import leyans.RidersHub.DTO.RideResponseDTO;
import leyans.RidersHub.Repository.RiderRepository;
import leyans.RidersHub.Repository.RiderTypeRepository;
import leyans.RidersHub.Repository.RidesRepository;
import leyans.RidersHub.model.Rider;
import leyans.RidersHub.model.RiderType;
import leyans.RidersHub.model.Rides;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class RidesService {

    private final RidesRepository ridesRepository;
    private final RiderRepository riderRepository;
    private final RiderTypeRepository riderTypeRepository;
    private final KafkaTemplate<Object, RideResponseDTO> kafkaTemplate;


    private final GeometryFactory geometryFactory = new GeometryFactory();


    public RidesService(RiderRepository riderRepository, RiderTypeRepository riderTypeRepository, RidesRepository ridesRepository, KafkaTemplate<Object, RideResponseDTO> kafkaTemplate) {
        this.riderRepository = riderRepository;
        this.riderTypeRepository = riderTypeRepository;
        this.ridesRepository = ridesRepository;
        this.kafkaTemplate = kafkaTemplate;
    }

    @Transactional
    public RideResponseDTO createRide(String username, String ridesName, String
            locationName, String riderType, Integer distance, String startingPoint, LocalDateTime date, double latitude, double longitude, String endingPoint) {


        Rider rider = riderRepository.findByUsername(username);
        RiderType newRiderType = riderTypeRepository.findByRiderType(riderType);

        Point coordinates = geometryFactory.createPoint(new Coordinate(longitude, latitude));
        String pointStr = coordinates.getX() + "," + coordinates.getY();


        //Initiate new instace for Rides in the database
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
     //   kafkaTemplate.send("location", newRides);

        RideResponseDTO ridesDTO = new RideResponseDTO(newRides.getRidesName(),
                newRides.getLocationName(), newRides.getDistance(), newRides.getStartingPoint(),
                newRides.getEndingPoint(), newRides.getDate(), newRides.getLatitude(),
                newRides.getLongitude());

        kafkaTemplate.send("location", ridesDTO);


        return new RideResponseDTO(newRides.getRidesName(), newRides.getLocationName(),
                newRides.getDistance(), newRides.getStartingPoint(), newRides.getEndingPoint(),
                newRides.getDate(), newRides.getLatitude(), newRides.getLongitude());
    }

}




