package leyans.RidersHub.Config.KafkaConfig.KafkaREST.Consumer;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class RiderConsumer {


        @KafkaListener(topics = {"car", "motor", "bike"}, groupId = "rider-group")
        public void consume(ConsumerRecord<String, String> record) {
            String riderType = record.topic();
            String message = record.value();

            System.out.println("Received message: " + message + " for RiderType: " + riderType);
        }
    }




