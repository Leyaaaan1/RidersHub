package leyans.RidersHub.Config.KafkaConfig.KafkaREST.Producer;

import leyans.RidersHub.model.RiderType;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class RiderProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;

    public RiderProducer(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendMessage(String riderType, String message) {
        System.out.println("Sending message to topic: " + riderType);
        kafkaTemplate.send(riderType, message);
        System.out.println("Sent message: " + message + " to riderType: " + riderType);
    }
}


}
