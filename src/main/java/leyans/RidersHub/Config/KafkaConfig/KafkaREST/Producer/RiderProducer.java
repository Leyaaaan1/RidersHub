package leyans.RidersHub.Config.KafkaConfig.KafkaREST.Producer;

import leyans.RidersHub.DTO.RiderTypeDTO;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class RiderProducer {

    private final KafkaTemplate<Object, String> kafkaTemplate;

    public RiderProducer(KafkaTemplate<Object, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }


    public void sendMessage(RiderTypeDTO riderMessageDTO) {
        kafkaTemplate.send(riderMessageDTO.getRiderType(), riderMessageDTO.getMessage());


        System.out.println("Sending message to topic: " + riderMessageDTO.getMessage());
        System.out.println("Sent message: " + riderMessageDTO.getMessage() + " to RiderType: " + riderMessageDTO.getRiderType());
    }
}



