package leyans.RidersHub.Config.KafkaConfig.KafkaREST.Producer;

import leyans.RidersHub.DTO.RiderTypeDTO;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class RiderProducer {

    private final KafkaTemplate<String , String> kafkaTemplate;

    public RiderProducer(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }



    public void sendMessageProducer(String topic, String message) {
        kafkaTemplate.send(topic, message);
        System.out.println("Sending message to topic: " + message);
        System.out.println("Sent message: " + message + " to RiderType: " + topic);


    }
}



