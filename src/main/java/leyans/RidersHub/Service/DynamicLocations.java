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
import org.locationtech.jts.geom.*;
import org.locationtech.jts.io.WKTWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
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

    private final GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
    private final PointConverter pointConverter = new PointConverter();


    public DynamicLocations(RiderRepository riderRepository, LocationRepository locationRepository, KafkaTemplate<String, newRidesDTO> kafkaTemplate) {
        this.riderRepository = riderRepository;
        this.locationRepository = locationRepository;
        this.kafkaTemplate = kafkaTemplate;
    }

    @KafkaListener(topics = "new-location", groupId = "location-group")
    @Transactional
    public void newLocationUpdate(newRidesDTO ridesDTO) {
        String username = ridesDTO.getUsername();
        double latitude = ridesDTO.getLatitude();
        double longitude = ridesDTO.getLongitude();

        // Create a new Point object for the updated location
        Point updatedCoordinates = geometryFactory.createPoint(new Coordinate(longitude, latitude));

        if (updatedCoordinates == null) {
            System.out.println("Invalid coordinates received.");
            return;
        }

        Rides lastRide = ridesRepository.findLastRideByUsername(username);

        if (lastRide != null && lastRide.getCoordinates() != null) {
            double lastLatitude = lastRide.getCoordinates().getY();
            double lastLongitude = lastRide.getCoordinates().getX();

            double updatedLatitude = updatedCoordinates.getY();
            double updatedLongitude = updatedCoordinates.getX();

            // Calculate distance in meters
            double distance = ridesRepository.findClosestLocation(lastLatitude, lastLongitude, updatedLatitude, updatedLongitude);

            System.out.println("User: " + username + " - Distance moved: " + distance + " meters.");

            if (distance > 100.0) {
                System.out.println("User " + username + " is within 100m range, NOT sending Kafka message.");
                return; // Prevent sending message if within 100m
            }

            System.out.println("User " + username + " moved more than 100m, sending to 'new-location'.");
           // kafkaTemplate.send("new-location", ridesDTO);
        } else {
            System.out.println("No previous ride found for " + username + ". Sending first location update.");
          //  kafkaTemplate.send("new-location", ridesDTO);
        }
    }
}

