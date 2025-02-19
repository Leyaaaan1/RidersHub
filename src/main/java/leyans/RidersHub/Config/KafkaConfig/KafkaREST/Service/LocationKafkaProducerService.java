package leyans.RidersHub.Config.KafkaConfig.KafkaREST.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import leyans.RidersHub.DTO.LocationRequest;
import leyans.RidersHub.model.Location;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class LocationKafkaProducerService {
    private static final Logger logger = LoggerFactory.getLogger(LocationKafkaProducerService.class);

    private final ObjectMapper objectMapper = new ObjectMapper(); // Converts object to JSON

    @Autowired
    KafkaTemplate<String, String> kafkaTemplate;
    LocationKafkaProducerService(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendLocation(String locationName, String latitude, String longitude, String username) {
        Map<String, Object> newLocation = new HashMap<>();

        newLocation.put("latitude", latitude);
        newLocation.put("longitude", longitude);
        newLocation.put("username", username);
        newLocation.put("locationName", locationName);

        System.out.println(locationName);
        System.out.println("yawa");

        kafkaTemplate.send("userLocation", newLocation.toString());

//        try {
//            String yawanani = objectMapper.writeValueAsString(newLocation);
//            kafkaTemplate.send("userLocation", newLocation);
//        } catch (JsonProcessingException e) {
//            throw new RuntimeException(e);
//        }


    }

    public void sendLocation2(String locationName, LocationRequest locationRequest) {

        try {
            String locMessage = objectMapper.writeValueAsString(locationRequest);
            logger.info("Sending message: {} to topic: {}", locMessage, locationName);
            kafkaTemplate.send(locationName, locMessage);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }


    }



}
