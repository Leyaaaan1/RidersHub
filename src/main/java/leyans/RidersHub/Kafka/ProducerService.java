package leyans.RidersHub.Kafka;

import leyans.RidersHub.DTO.RidesDTO;
import leyans.RidersHub.DTO.newRidesDTO;
import leyans.RidersHub.Service.DynamicLocations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class ProducerService {

    private final KafkaTemplate<String, newRidesDTO> kafkaTemplate;
    private final KafkaTemplate<String, RidesDTO> kafkaTemplateRides;

    @Autowired
    public ProducerService(KafkaTemplate<String, newRidesDTO> kafkaTemplate, KafkaTemplate<String, RidesDTO> kafkaTemplateRides) {
        this.kafkaTemplate = kafkaTemplate;
        this.kafkaTemplateRides = kafkaTemplateRides;
    }

    public void sendNewLocation(newRidesDTO ridesDTO) {
        kafkaTemplate.send("updated-locations", ridesDTO);
        System.out.println("Sent to Kafka: " + ridesDTO.getUsername());
    }

    public void sendNewRide(RidesDTO ridesDTO) {
        kafkaTemplateRides.send("new-ride", ridesDTO);
    }
}