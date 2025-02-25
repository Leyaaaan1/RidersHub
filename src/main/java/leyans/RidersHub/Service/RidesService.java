package leyans.RidersHub.Service;


import jakarta.transaction.Transactional;
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
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class RidesService {

    private final RidesRepository ridesRepository;
    private final RiderRepository riderRepository;
    private final RiderTypeRepository riderTypeRepository;
    private final LocationService   locationService;


    private final GeometryFactory geometryFactory = new GeometryFactory();


    public RidesService(RiderRepository riderRepository, RiderTypeRepository riderTypeRepository, LocationService locationService, RidesRepository ridesRepository) {
        this.riderRepository = riderRepository;
        this.riderTypeRepository = riderTypeRepository;
        this.locationService = locationService;
        this.ridesRepository = ridesRepository;
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

        Point coordinates = geometryFactory.createPoint(new Coordinate(longitude, latitude));

        String pointStr = coordinates.getX() + "," + coordinates.getY();
        RidesDTO ridesDTO = new RidesDTO(username, locationName, pointStr, ridesName,
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
        return ridesRepository.save(newRides);


    }
}




