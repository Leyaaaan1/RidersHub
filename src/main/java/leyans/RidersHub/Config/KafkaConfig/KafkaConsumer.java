package leyans.RidersHub.Config.KafkaConfig;


import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.lang.module.Configuration;

@Component
public class KafkaConsumer {



    @KafkaListener(topics = "car", groupId = "riders")
    public void consume(String message) {
        System.out.println("lean send this shit: " + message);
    }

    @KafkaListener(topics = "motor", groupId = "riders")
    public void consumeMotor(String message) {
        System.out.println("lean send this shit: " + message);
    }

    @KafkaListener(topics = "bike", groupId = "riders")
    public void consumeBike(String message) {
        System.out.println("lean send this shit: " + message);

    }




}
