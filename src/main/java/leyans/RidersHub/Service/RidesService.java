package leyans.RidersHub.Service;


import jakarta.transaction.Transactional;
import leyans.RidersHub.DTO.RideResponseDTO;
import leyans.RidersHub.DTO.RidesDTO;
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

import java.util.Date;

@Service
public class RidesService {

    private final RidesRepository ridesRepository;
    private final RiderRepository riderRepository;
    private final RiderTypeRepository riderTypeRepository;
    private final KafkaTemplate<Object, RidesDTO> kafkaTemplate;


    private final GeometryFactory geometryFactory = new GeometryFactory();


    public RidesService(RiderRepository riderRepository, RiderTypeRepository riderTypeRepository, RidesRepository ridesRepository, KafkaTemplate<Object, RidesDTO> kafkaTemplate) {
        this.riderRepository = riderRepository;
        this.riderTypeRepository = riderTypeRepository;
        this.ridesRepository = ridesRepository;
        this.kafkaTemplate = kafkaTemplate;
    }

    @Transactional
    public RideResponseDTO createRide(String username, String ridesName, String
            locationName, String riderType, Integer distance, String startingPoint, Date date, double latitude, double longitude) {


        Rider rider = riderRepository.findByUsername(username);
        RiderType newRiderType = riderTypeRepository.findByRiderType(riderType);

        Point coordinates = geometryFactory.createPoint(new Coordinate(longitude, latitude));

        String pointStr = coordinates.getX() + "," + coordinates.getY();

        RidesDTO ridesDTO = new RidesDTO(username, locationName, ridesName,
                riderType, distance, startingPoint, date
        );


        Rides newRides = new Rides();
        newRides.setCoordinates(coordinates);
        newRides.setLocationName(locationName);
        newRides.setRidesName(ridesName);
        newRides.setUsername(rider);
        newRides.setDistance(distance);
        newRides.setStartingPoint(startingPoint);
        newRides.setDate(date);
        newRides.setRiderType(newRiderType);
        newRides = ridesRepository.save(newRides);

        kafkaTemplate.send("rides-group", );

        return new RideResponseDTO(ridesDTO, pointStr);
    }
}




