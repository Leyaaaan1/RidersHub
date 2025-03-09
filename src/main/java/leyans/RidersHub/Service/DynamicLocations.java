package leyans.RidersHub.Service;


import jakarta.transaction.Transactional;
import leyans.RidersHub.DTO.newRidesDTO;
import leyans.RidersHub.DistanceFormula.HaversineDistance;
import leyans.RidersHub.Kafka.ProducerService;
import org.locationtech.jts.geom.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class DynamicLocations {

    private final Map<String, LocalDateTime> userLastUpdateTime = new HashMap<>(); // Stores last update time per user


    @Autowired
    private ProducerService producerService;


    @Autowired
    private HaversineDistance haversineDistance;


    public DynamicLocations(ProducerService producerService) {
        this.producerService = producerService;
    }


    @Transactional
    public void newLocationUpdate(newRidesDTO ridesDTO) {

        String locationName = ridesDTO.getLocationName();
        String username = ridesDTO.getUsername();
        double latitude = ridesDTO.getLatitude();
        double longitude = ridesDTO.getLongitude();

      //  Point updatedCoordinates = geometryFactory.createPoint(new Coordinate(longitude, latitude));

        if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
            System.out.println("Invalid coordinates received.");
            return;
        }

        // Get the current time
        LocalDateTime currentTime = LocalDateTime.now();
        LocalDateTime lastUpdateTime = userLastUpdateTime.getOrDefault(username, currentTime.minusMinutes(11));


        long minutesSinceLastUpdate = java.time.Duration.between(lastUpdateTime, currentTime).toMinutes();

        HaversineDistance.DistanceResult result = haversineDistance.shouldSendUpdate(latitude, longitude, minutesSinceLastUpdate);

        double calculatedDistance = result.getDistance();
        boolean shouldUpdate = result.shouldUpdate();

        if (shouldUpdate) {
            System.out.println("User: " + username + " moved a significant distance (" + calculatedDistance + "m). Sending update.");


            newRidesDTO ridesUpdate = new newRidesDTO(username, locationName, latitude, longitude, calculatedDistance);

            producerService.sendNewLocation(ridesUpdate);

        } else {

            System.out.println("User: " + username + " has not moved significantly (" + calculatedDistance + "m). No update sent.");
        }
    }
}
