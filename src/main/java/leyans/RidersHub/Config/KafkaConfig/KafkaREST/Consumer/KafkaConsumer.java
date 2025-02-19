package leyans.RidersHub.Config.KafkaConfig.KafkaREST.Consumer;


import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class KafkaConsumer {



    @KafkaListener(topics = "car", groupId = "riders")
    public void Carconsume(String message) {
        System.out.println("lean send this shit: " + message);
    }


    @KafkaListener(topics = "motor", groupId = "riders")
    public void MotorConsume(String message) {
        System.out.println("motor lean send this shity: " + message);

    }

    @KafkaListener(topics = "bike", groupId = "riders")
    public void BikeConsume(String message) {
        System.out.println("Bike send this: " + message);
    }






}
