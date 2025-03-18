package leyans.RidersHub.Service;


import jakarta.transaction.Transactional;
import leyans.RidersHub.DTO.RidesDTO;
import leyans.RidersHub.DTO.newRidesDTO;
import leyans.RidersHub.DistanceFormula.HaversineDistance;
import leyans.RidersHub.Kafka.ProducerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class DynamicLocations {

    @Autowired
    private final KafkaTemplate<Object, newRidesDTO> kafkaTemplate;
    @Autowired
    private ProducerService producerService;
    @Autowired
    private HaversineDistance haversineDistance;


    private newRidesDTO latestRidesDTO;

    public DynamicLocations(KafkaTemplate<Object, newRidesDTO> kafkaTemplate, ProducerService producerService) {
        this.kafkaTemplate = kafkaTemplate;
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


        HaversineDistance.DistanceResult result = haversineDistance.shouldSendUpdate(latitude, longitude);

        double distance = result.distance();
        boolean shouldUpdate = result.shouldUpdate();
        System.out.println(distance);

        if (shouldUpdate) {
            System.out.println("User: " + username + " moved a significant distance (" + distance + "m). Sending update.");


            newRidesDTO ridesUpdate = new newRidesDTO(username, locationName, latitude, longitude, distance);
            kafkaTemplate.send("rides-topic", ridesUpdate);
            this.latestRidesDTO = ridesUpdate;

           // producerService.sendNewLocation(ridesUpdate);


        }
    }

    @Scheduled(fixedDelay = 10000)
    public void timeInterval() {
          if (latestRidesDTO != null) {
            System.out.println("📡 Sending latest location update to Kafka..." + latestRidesDTO.getDistance());
            kafkaTemplate.send("rides-topic", latestRidesDTO);
        } else {
            System.out.println("❌ No location update available.");
        }
    }


}