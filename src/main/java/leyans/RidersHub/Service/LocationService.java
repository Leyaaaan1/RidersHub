package leyans.RidersHub.Service;


import jakarta.transaction.Transactional;
import leyans.RidersHub.Config.KafkaConfig.KafkaREST.Service.LocationKafkaProducer;
import leyans.RidersHub.Repository.LocationRepository;
import leyans.RidersHub.model.Locations;
import leyans.RidersHub.model.Rider;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class LocationService {

    private final LocationRepository locationRepository;
    private final LocationKafkaProducer kafkaProducer;
    private final GeometryFactory geometryFactory = new GeometryFactory();


    public LocationService(LocationRepository locationRepository, LocationKafkaProducer kafkaProducer) {
        this.locationRepository = locationRepository;
        this.kafkaProducer = kafkaProducer;
    }

    // transactional annotation is used to ensure that
    // the method is executed within a transaction if it is
    // wrong it will roll back the transaction preventing to commit the changes
    @Transactional
    public Locations saveLocation(String username, String locationName, double latitude, double longitude) {
        Rider rider = new Rider();
        rider.setUsername(username);

        Point coordinates = geometryFactory.createPoint(new Coordinate(longitude, latitude));
        Locations location = new Locations(rider, locationName, coordinates);

        location = locationRepository.save(location);

        kafkaProducer.sendLocationUpdate(location);

        return location;
    }
}
