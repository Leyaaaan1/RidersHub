package leyans.RidersHub.Config.KafkaConfig.KafkaREST.Consumer;

import leyans.RidersHub.DTO.RiderTypeDTO;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class RiderConsumer {

    @KafkaListener(topics = "car", groupId = "rider-group")
    public void consumeCar(String message) {
        System.out.println("Received message for car: " + message);
    }

    @KafkaListener(topics = "motor", groupId = "rider-group")
    public void consumeMotor(String message) {
        System.out.println("Received message for motor: " + message);
    }

    @KafkaListener(topics = "bike", groupId = "rider-group")
    public void consumeBike(String message) {
        System.out.println("Received message for bike: " + message);
    }
}





