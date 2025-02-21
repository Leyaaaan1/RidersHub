package leyans.RidersHub.Config.KafkaConfig.KafkaREST.Service;


import leyans.RidersHub.Config.KafkaConfig.KafkaREST.DTO.LocationDTO;
import leyans.RidersHub.model.Locations;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class LocationKafkaProducer {

    private final KafkaTemplate<String, LocationDTO> kafkaTemplate;
    private static final String TOPIC = "location_updates";

    public LocationKafkaProducer(KafkaTemplate<String, LocationDTO> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendLocationUpdate(LocationDTO locationDTO) {
        kafkaTemplate.send(TOPIC, locationDTO);
        System.out.println("Sent location update: " + locationDTO.getLocationName());
    }
}