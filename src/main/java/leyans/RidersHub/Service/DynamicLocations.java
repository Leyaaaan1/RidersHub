package leyans.RidersHub.Service;


import jakarta.transaction.Transactional;
import leyans.RidersHub.DTO.LocationDTO;
import leyans.RidersHub.DTO.newRidesDTO;
import leyans.RidersHub.Kafka.Producer;
import leyans.RidersHub.Repository.LocationRepository;
import leyans.RidersHub.Repository.RiderRepository;
import leyans.RidersHub.Repository.RidesRepository;
import leyans.RidersHub.model.PointConverter;
import leyans.RidersHub.model.Rides;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.io.WKTWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;

@Service
public class DynamicLocations {

    @Autowired
    private KafkaTemplate<String, newRidesDTO> kafkaTemplate;

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private RiderRepository riderRepository;

    @Autowired
    private RidesRepository ridesRepository;

    private Producer producer;

    private final GeometryFactory geometryFactory = new GeometryFactory();

    public DynamicLocations(RiderRepository riderRepository, LocationRepository locationRepository, KafkaTemplate<String, newRidesDTO> kafkaTemplate) {
        this.riderRepository = riderRepository;
        this.locationRepository = locationRepository;
        this.kafkaTemplate = kafkaTemplate;
    }

    @KafkaListener(topics = "new-location", groupId = "location-group")
    @Transactional
    public void newLocationUpdate(newRidesDTO ridesDTO) {

        String username = ridesDTO.getUsername();
        String locationName = ridesDTO.getLocationName();


        double latitude = ridesDTO.getLatitude();
        double longitude = ridesDTO.getLongitude();

        Point updatedCoordinates = geometryFactory.createPoint(new Coordinate(longitude, latitude));


        if (updatedCoordinates != null) {
            Rides lastRide = ridesRepository.findLastRideByUsername(username);

            if (lastRide != null && lastRide.getCoordinates() != null) {
                // Use your converter to transform the Point into a String
                PointConverter pointConverter = new PointConverter();
                String lastPointString = pointConverter.convertToDatabaseColumn(lastRide.getCoordinates());
                String updatedPointString = pointConverter.convertToDatabaseColumn(updatedCoordinates);

                double distance = ridesRepository.calculateDistance(lastPointString, updatedPointString);

                if (distance < 100.0) {
                    System.out.println("Rides is less than 100m: " + username);
                    return;
                }
                System.out.println("Rides is more than 100m: " + username);
            } else {
                System.out.println("No previous ride found, skipping distance check.");
            }
        }

        kafkaTemplate.send("new-location", ridesDTO);
    }
}
//        lastRide.setCoordinates(updatedCoordinates);
//        lastRide.setDate(ridesDTO.getDate());
//        lastRide.setUsername(riderRepository.findByUsername(username));
//        lastRide.setLocationName(locationName);

        //prducer.sendRideUpdate("ride-updates", ridesDTO);


//    public void processRideUpdate(RidesDTO ridesDTO) {
//        producer.sendRideUpdate(ridesDTO);
//        System.out.println("Ride update sent to Kafka: " + ridesDTO.getUsername());
//    }


