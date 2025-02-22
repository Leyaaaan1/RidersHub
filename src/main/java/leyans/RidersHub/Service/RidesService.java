package leyans.RidersHub.Service;


import jakarta.transaction.Transactional;
import leyans.RidersHub.Config.KafkaConfig.KafkaREST.Service.LocationKafkaProducer;
import leyans.RidersHub.DTO.LocationDTO;
import leyans.RidersHub.DTO.LocationRequest;
import leyans.RidersHub.DTO.LocationResponseDTO;
import leyans.RidersHub.Repository.LocationRepository;
import leyans.RidersHub.Repository.RiderRepository;
import leyans.RidersHub.Repository.RiderTypeRepository;
import leyans.RidersHub.Repository.RidesRepository;
import leyans.RidersHub.model.Locations;
import leyans.RidersHub.model.Rider;
import leyans.RidersHub.model.RiderType;
import leyans.RidersHub.model.Rides;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.awt.*;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class RidesService {

    private final RiderRepository riderRepository;
    private final RiderTypeRepository riderTypeRepository;
    private final GeometryFactory geometryFactory = new GeometryFactory();
    private final LocationRepository locationRepository;
    private final RidesRepository ridesRepository;
    private final LocationKafkaProducer kafkaProducer;

    public RidesService(RiderRepository riderRepository, RiderTypeRepository riderTypeRepository, LocationRepository locationRepository, RidesRepository ridesRepository, LocationKafkaProducer kafkaProducer) {
        this.riderRepository = riderRepository;
        this.riderTypeRepository = riderTypeRepository;
        this.locationRepository = locationRepository;
        this.ridesRepository = ridesRepository;
        this.kafkaProducer = kafkaProducer;
    }

    @Transactional
    public Rides createRides(String username, String ridesName, String
            locationName, String riderType, Integer distance, String startingPoint, Date date, double latitude, double longitude) {


        Rider rider = riderRepository.findByUsername(username);
        RiderType riderTypeName  = riderTypeRepository.findByRiderType(riderType);


        Point coordinates = geometryFactory.createPoint(new Coordinate(longitude, latitude));
        Locations location = new Locations(rider, locationName, coordinates);
        location = locationRepository.save(location);

        String pointStr = coordinates.getX() + "," + coordinates.getY();
        LocationDTO locationDTO = new LocationDTO(username, locationName, pointStr);
        kafkaProducer.sendLocationUpdate(locationDTO);

        Rides rides = new Rides(null, coordinates, locationName, ridesName, rider, riderTypeName, distance, startingPoint, date);
        return ridesRepository.save(rides);

    }


}


