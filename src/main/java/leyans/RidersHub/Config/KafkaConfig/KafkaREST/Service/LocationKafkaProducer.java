package leyans.RidersHub.Config.KafkaConfig.KafkaREST.Service;


import leyans.RidersHub.DTO.LocationDTO;
import leyans.RidersHub.DTO.RidesDTO;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class LocationKafkaProducer {

    private final KafkaTemplate<String, LocationDTO> kafkaTemplate;
    private final KafkaTemplate<String, RidesDTO> ridesTemplate;

    private static final String TOPIC = "location_updates";

    public LocationKafkaProducer(
            KafkaTemplate<String, LocationDTO> kafkaTemplate,
            KafkaTemplate<String, RidesDTO> ridesTemplate) {

        this.kafkaTemplate = kafkaTemplate;
        this.ridesTemplate = ridesTemplate;
    }

    public void sendLocationUpdate(LocationDTO locationDTO) {
        kafkaTemplate.send(TOPIC, locationDTO);
        System.out.println("Sent location update: " + locationDTO.getLocationName());
    }











}