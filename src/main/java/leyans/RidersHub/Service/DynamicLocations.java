package leyans.RidersHub.Service;


import jakarta.transaction.Transactional;
import leyans.RidersHub.DTO.newRidesDTO;
import leyans.RidersHub.DistanceFormula.HaversineDistance;
import leyans.RidersHub.Kafka.ProducerService;
import leyans.RidersHub.Repository.LocationRepository;
import leyans.RidersHub.Repository.RiderRepository;
import leyans.RidersHub.Repository.RidesRepository;
import leyans.RidersHub.model.PointConverter;
import leyans.RidersHub.model.Rides;
import org.locationtech.jts.geom.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;

@Service
public class DynamicLocations {


    @Autowired
    private ProducerService producerService;


    @Autowired
    private HaversineDistance haversineDistance;

    private final GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);

    public DynamicLocations(ProducerService producerService) {
        this.producerService = producerService;
    }


    @Transactional
    public void newLocationUpdate(newRidesDTO ridesDTO) {
        String locationName = ridesDTO.getLocationName();
        String username = ridesDTO.getUsername();
        double latitude = ridesDTO.getLatitude();
        double longitude = ridesDTO.getLongitude();

        Point updatedCoordinates = geometryFactory.createPoint(new Coordinate(longitude, latitude));


        if (updatedCoordinates == null) {
            System.out.println("Invalid coordinates received.");
            return;
        }

        // Get distance and update decision
        HaversineDistance.DistanceResult result = haversineDistance.shouldSendUpdate(latitude, longitude);
        double calculatedDistance = result.getDistance();
        boolean shouldUpdate = result.shouldUpdate();

        if (shouldUpdate) {
            System.out.println("User: " + username + " moved a significant distance (" + calculatedDistance + "m). Sending update.");

            ridesDTO.setDistance(calculatedDistance);
            producerService.sendNewLocation(ridesDTO);

        } else {
            System.out.println("User: " + username + " has not moved significantly (" + calculatedDistance + "m). No update sent.");
        }
    }
}
