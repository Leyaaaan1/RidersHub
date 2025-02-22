package leyans.RidersHub.Config.KafkaConfig.KafkaREST.Consumer;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class KafkaConsumer {

    @KafkaListener(
            topics = "car",
            groupId = "riders",
            containerFactory = "riderKafkaListenerContainerFactory"
    )
    public void consumeCar(String message) {

        System.out.println("Car message received: " + message);
    }

    @KafkaListener(
            topics = "motor",
            groupId = "riders",
            containerFactory = "riderKafkaListenerContainerFactory"
    )
    public void consumeMotor(String message) {
        System.out.println("Motor message received: " + message);
    }

    @KafkaListener(
            topics = "bike",
            groupId = "riders",
            containerFactory = "riderKafkaListenerContainerFactory"
    )
    public void consumeBike(String message) {
        System.out.println("Bike message received: " + message);
    }
}
