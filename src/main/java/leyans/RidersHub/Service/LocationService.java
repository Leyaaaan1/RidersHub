package leyans.RidersHub.Service;


import jakarta.transaction.Transactional;
import leyans.RidersHub.DTO.LocationDTO;
import leyans.RidersHub.DTO.LocationResponseDTO;
import leyans.RidersHub.Config.KafkaConfig.KafkaREST.Service.LocationKafkaProducer;
import leyans.RidersHub.Repository.LocationRepository;
import leyans.RidersHub.Repository.RiderRepository;
import leyans.RidersHub.model.Locations;
import leyans.RidersHub.model.Rider;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.stereotype.Service;

@Service
public class LocationService {

    private final LocationRepository locationRepository;
    private final LocationKafkaProducer kafkaProducer;
    private final GeometryFactory geometryFactory = new GeometryFactory();
    private final RiderRepository riderRepository;



    public LocationService(LocationRepository locationRepository, LocationKafkaProducer kafkaProducer, RiderRepository riderRepository) {
        this.locationRepository = locationRepository;
        this.kafkaProducer = kafkaProducer;
        this.riderRepository = riderRepository;
    }

    // transactional annotation is used to ensure that
    // the method is executed within a transaction if it is
    // wrong it will roll back the transaction preventing to commit the changes
    @Transactional
    public LocationResponseDTO saveLocation(String username, String locationName, double latitude, double longitude) {
        Rider rider = riderRepository.findByUsername(username);
        // point is used for latitude and longtitude using PostGis

        Point coordinates = geometryFactory.createPoint(new Coordinate(longitude, latitude));
        Locations location = new Locations(rider, locationName, coordinates);
        location = locationRepository.save(location);

        // Create a DTO with the necessary fields since it is json type it is easy to send it to the kafka producer
        String pointStr = coordinates.getX() + "," + coordinates.getY();
        LocationDTO locationDTO = new LocationDTO(username, locationName, pointStr);

        kafkaProducer.sendLocationUpdate(locationDTO);

        return new LocationResponseDTO(location.getLocationId(), username, locationName, pointStr);
    }
}