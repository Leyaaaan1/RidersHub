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
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Date;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class RidesService {

    private final RidesRepository ridesRepository;
    private final RiderRepository riderRepository;
    private final RiderTypeRepository riderTypeRepository;
    private final LocationService   locationService;


    private final GeometryFactory geometryFactory = new GeometryFactory();
    private final LocationKafkaProducer kafkaProducer;


    public RidesService(RiderRepository riderRepository, RiderTypeRepository riderTypeRepository, LocationService locationService, RidesRepository ridesRepository, LocationKafkaProducer kafkaProducer) {
        this.riderRepository = riderRepository;
        this.riderTypeRepository = riderTypeRepository;
        this.locationService = locationService;
        this.ridesRepository = ridesRepository;
        this.kafkaProducer = kafkaProducer;
    }

//    @Transactional
//    public Rides createRides(String username, String ridesName, String
//            locationName, List<String> riderTypeNames, Integer distance, String startingPoint, Date date, double latitude, double longitude) {
//
//
//
//        Rider rider = riderRepository.findByUsername(username);
//
//
//        Point coordinates = geometryFactory.createPoint(new Coordinate(longitude, latitude));
//        Locations location = new Locations(rider, locationName, coordinates);
//        location = locationRepository.save(location);
//
//        String pointStr = coordinates.getX() + "," + coordinates.getY();
//        LocationDTO locationDTO = new LocationDTO(username, locationName, pointStr);
//
//        kafkaProducer.sendLocationUpdate( locationDTO);
//
//        // Fetch RiderType objects from the database
//        List<RiderType> riderTypes = riderTypeNames.stream()
//                .map(name -> riderTypeRepository.findByRiderType(name))
//                .filter(Objects::nonNull) // Avoid null values if no match is found
//                .collect(Collectors.toList());
//
//        if (riderTypes.isEmpty()) {
//            throw new IllegalArgumentException("No valid RiderType found for given names.");
//        }
//
//
//
//        Rides newRides = new Rides();
//        newRides.setCoordinates(coordinates);
//        newRides.setLocationName(locationName);
//        newRides.setRidesName(ridesName);
//        newRides.setUsername(rider);
//        newRides.setDistance(distance);
//        newRides.setStartingPoint(startingPoint);
//        newRides.setDate(date);
//        newRides.setRiderTypes(riderTypes); // Set fetched rider types
//
//
//        return ridesRepository.save(newRides);
//    }


    @Transactional
    public Rides createRide(String username, String ridesName, String
            locationName, String riderType, Integer distance, String startingPoint, Date date, double latitude, double longitude) {


        Rider rider = riderRepository.findByUsername(username);
        RiderType newRiderType = riderTypeRepository.findByRiderType(riderType);
        LocationResponseDTO locationResponseDTO = locationService.saveLocation(username, locationName, latitude, longitude);

        Point coordinates = geometryFactory.createPoint(new Coordinate(longitude, latitude));

        String pointStr = coordinates.getX() + "," + coordinates.getY();
        LocationDTO locationDTO = new LocationDTO(username, locationName, pointStr);



        Rides newRides = new Rides();
        newRides.setCoordinates(coordinates);
        newRides.setLocationName(locationName);
        newRides.setRidesName(ridesName);
        newRides.setUsername(rider);
        newRides.setDistance(distance);
        newRides.setStartingPoint(startingPoint);
        newRides.setDate(date);
        newRides.setRiderType(newRiderType);
        return ridesRepository.save(newRides);


    }
}




