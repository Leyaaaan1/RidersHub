package leyans.RidersHub.Config.KafkaConfig.KafkaREST.Service;

import leyans.RidersHub.Config.KafkaConfig.KafkaREST.Producer.RiderProducer;
import leyans.RidersHub.model.Rider;
import leyans.RidersHub.model.RiderType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.concurrent.ListenableFuture;
import org.springframework.util.concurrent.ListenableFutureCallback;
@Service
public class RiderProducerService {

    private final KafkaTemplate<String, String> kafkaTemplate;

    public RiderProducerService(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendMessage(String riderType, String message) {
        System.out.println("Sending message to topic: " + riderType);
        kafkaTemplate.send(riderType, message);
        System.out.println("Sent message: " + message + " to RiderType: " + riderType);
    }




}
