package leyans.RidersHub.Config.KafkaConfig.KafkaREST.Service;


import leyans.RidersHub.model.Locations;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class LocationKafkaProducer {

    private final KafkaTemplate<String, Locations> kafkaTemplate;
    private static final String TOPIC = "location_updates";

    public LocationKafkaProducer(KafkaTemplate<String, Locations> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendLocationUpdate(Locations location) {
        kafkaTemplate.send(TOPIC, location);
        System.out.println("Sent location update: " + location.getLocationName());
    }


}
