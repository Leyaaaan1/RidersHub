package leyans.RidersHub.Kafka;

import com.fasterxml.jackson.databind.ser.std.StdKeySerializers;
import leyans.RidersHub.DTO.RidesDTO;
import leyans.RidersHub.Service.DynamicLocations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;

public class Producer {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final DynamicLocations dynamicLocations;



    public Producer(KafkaTemplate<String, Object> kafkaTemplate, DynamicLocations dynamicLocations) {
        this.kafkaTemplate = kafkaTemplate;
        this.dynamicLocations = dynamicLocations;
    }


    public void sendRideUpdate(RidesDTO ridesDTO) {
        kafkaTemplate.send("new-location", ridesDTO);
    }
}
