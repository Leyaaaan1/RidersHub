package leyans.RidersHub.Config.KafkaConfig.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaProducerService {


    @Autowired
    private KafkaTemplate<String, String > kafkaTemplate;



    public void sendMessage(String riderType, String message) {
        System.out.println("Sending message to topic: " + riderType);
        kafkaTemplate.send(riderType, message);
    }

    public void sendMotor(String riderType, String message) {
        System.out.println("Sending message to topic: " + riderType);
        kafkaTemplate.send(riderType, message);
    }


    public void sendBike(String riderType, String message) {
        System.out.println("Sending message to topic: " + riderType);
        kafkaTemplate.send(riderType, message);
    }




}
