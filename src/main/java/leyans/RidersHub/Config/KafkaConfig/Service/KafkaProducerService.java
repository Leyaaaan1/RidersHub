package leyans.RidersHub.Config.KafkaConfig.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.net.http.HttpResponse;

@Service
public class KafkaProducerService {

    private static final String TOPIC = "car";


    @Autowired
    private KafkaTemplate<String, String > kafkaTemplate;

    public void sendMessage(String message) {
        System.out.println("Producer message: " + message);
        this.kafkaTemplate.send(TOPIC, message);

    }

}
